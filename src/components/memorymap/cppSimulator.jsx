/**
 * C++ Memory Simulator
 * Parses and simulates basic C++ code execution to generate memory states
 */

let addressCounter = 0x1000; // Simulated memory addresses

function generateAddress() {
  const addr = `0x${addressCounter.toString(16)}`;
  addressCounter += 8;
  return addr;
}

function resetAddressCounter() {
  addressCounter = 0x1000;
}

// List of supported C++ types
const SUPPORTED_TYPES = [
  'int', 'float', 'double', 'char', 'bool',
  'long', 'short', 'unsigned', 'signed',
  'std::string', 'string'
];

// Create regex pattern that matches any supported type
const TYPE_PATTERN = SUPPORTED_TYPES.join('|').replace(/\./g, '\\.');

/**
 * Parse and simulate C++ code execution
 * Returns an array of execution steps with memory states
 */
export function parseAndSimulateCpp(code) {
  resetAddressCounter();
  
  // Keep track of original line numbers including blank lines
  const allLines = code.split('\n');
  const steps = [];
  
  // Memory state
  const stack = new Map(); // name -> { type, value, address }
  const heap = new Map(); // address -> { type, value, isDeleted }
  const pointers = new Map(); // pointer name -> target address
  const danglingPointers = new Set(); // track pointers to deleted memory
  const memoryLeaks = new Set(); // track heap addresses never freed
  
  allLines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip blank lines and comments
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      return;
    }
    
    try {
      let parsed = false;
      
      // Variable declaration: int x = 5; or std::string s = "hello";
      const varDeclPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s+(\\w+)\\s*=\\s*([^;]+);?\\s*$`);
      const varDeclMatch = trimmedLine.match(varDeclPattern);
      if (varDeclMatch) {
        const [, type, name, value] = varDeclMatch;
        const address = generateAddress();
        stack.set(name, {
          name,
          type: normalizeType(type),
          value: parseValue(value, type),
          address,
        });
        
        addStep(steps, index + 1, trimmedLine, stack, heap, pointers, danglingPointers);
        parsed = true;
      }
      
      // Pointer declaration: int* ptr; or double* ptr = &x; or std::string* ptr = new std::string("test");
      if (!parsed) {
        const ptrDeclPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s*\\*\\s*(\\w+)\\s*(?:=\\s*([^;]+))?;?\\s*$`);
        const ptrDeclMatch = trimmedLine.match(ptrDeclPattern);
        if (ptrDeclMatch) {
          const [, type, name, initialValue] = ptrDeclMatch;
          const address = generateAddress();
          
          let targetAddress = null;
          if (initialValue) {
            if (initialValue.includes('new')) {
              // new allocation - match: new Type(value) or new Type or new Type()
              const newPattern = new RegExp(`new\\s+(${TYPE_PATTERN})\\s*(?:\\(([^)]*)\\))?`);
              const newMatch = initialValue.match(newPattern);
              if (newMatch) {
                const [, heapType, heapValue] = newMatch;
                targetAddress = generateAddress();
                heap.set(targetAddress, {
                  type: normalizeType(heapType),
                  value: parseValue(heapValue || getDefaultValue(heapType), heapType),
                  isDeleted: false,
                });
                memoryLeaks.add(targetAddress); // Track for leak detection
              }
            } else if (initialValue.startsWith('&')) {
              // Address-of operator
              const targetVar = initialValue.substring(1).trim();
              if (stack.has(targetVar)) {
                targetAddress = stack.get(targetVar).address;
              }
            } else if (initialValue === 'nullptr' || initialValue === 'NULL') {
              targetAddress = null;
            }
          }
          
          stack.set(name, {
            name,
            type: `${normalizeType(type)}*`,
            value: targetAddress,
            address,
          });
          
          if (targetAddress) {
            pointers.set(name, targetAddress);
          }
          
          addStep(steps, index + 1, trimmedLine, stack, heap, pointers, danglingPointers);
          parsed = true;
        }
      }
      
      // Assignment to existing variable: x = 10;
      if (!parsed) {
        const varAssignMatch = trimmedLine.match(/^\s*(\w+)\s*=\s*([^;]+);?\s*$/);
        if (varAssignMatch && !trimmedLine.includes('*')) {
          const [, name, value] = varAssignMatch;
          
          if (stack.has(name)) {
            const variable = stack.get(name);
            
            if (variable.type.includes('*')) {
              // Pointer assignment
              let targetAddress = null;
              
              if (value.includes('new')) {
                const newPattern = new RegExp(`new\\s+(${TYPE_PATTERN})\\s*(?:\\(([^)]*)\\))?`);
                const newMatch = value.match(newPattern);
                if (newMatch) {
                  const [, heapType, heapValue] = newMatch;
                  targetAddress = generateAddress();
                  heap.set(targetAddress, {
                    type: normalizeType(heapType),
                    value: parseValue(heapValue || getDefaultValue(heapType), heapType),
                    isDeleted: false,
                  });
                  memoryLeaks.add(targetAddress);
                }
              } else if (value.startsWith('&')) {
                const targetVar = value.substring(1).trim();
                if (stack.has(targetVar)) {
                  targetAddress = stack.get(targetVar).address;
                }
              } else if (stack.has(value) && stack.get(value).type.includes('*')) {
                targetAddress = stack.get(value).value;
              } else if (value === 'nullptr' || value === 'NULL') {
                targetAddress = null;
              }
              
              // Check if reassigning causes a leak (old address no longer referenced)
              const oldAddress = variable.value;
              if (oldAddress && heap.has(oldAddress) && !heap.get(oldAddress).isDeleted) {
                const stillReferenced = Array.from(stack.values()).some(v => 
                  v.type.includes('*') && v.value === oldAddress && v.name !== name
                );
                if (!stillReferenced) {
                  // This could cause a leak if not deleted
                  memoryLeaks.add(oldAddress);
                }
              }
              
              stack.set(name, {
                ...variable,
                value: targetAddress,
              });
              
              if (targetAddress) {
                pointers.set(name, targetAddress);
                // Check for dangling pointer
                if (heap.has(targetAddress) && heap.get(targetAddress).isDeleted) {
                  danglingPointers.add(name);
                }
              } else {
                pointers.delete(name);
                danglingPointers.delete(name);
              }
            } else {
              // Regular variable assignment
              stack.set(name, {
                ...variable,
                value: parseValue(value, variable.type),
              });
            }
            
            addStep(steps, index + 1, trimmedLine, stack, heap, pointers, danglingPointers);
            parsed = true;
          }
        }
      }
      
      // Dereference assignment: *ptr = 10;
      if (!parsed) {
        const derefMatch = trimmedLine.match(/^\s*\*(\w+)\s*=\s*([^;]+);?\s*$/);
        if (derefMatch) {
          const [, ptrName, newValue] = derefMatch;
          if (stack.has(ptrName)) {
            const pointer = stack.get(ptrName);
            const targetAddress = pointer.value;
            if (targetAddress) {
              // Get the base type from pointer type (e.g., "double*" -> "double")
              const baseType = pointer.type.replace('*', '').trim();
              
              // Update heap or stack value
              if (heap.has(targetAddress)) {
                heap.set(targetAddress, {
                  ...heap.get(targetAddress),
                  value: parseValue(newValue, baseType),
                });
              } else {
                // Find stack variable by address
                for (const [varName, varData] of stack.entries()) {
                  if (varData.address === targetAddress) {
                    stack.set(varName, {
                      ...varData,
                      value: parseValue(newValue, varData.type),
                    });
                    break;
                  }
                }
              }
            }
          }
          
          addStep(steps, index + 1, trimmedLine, stack, heap, pointers, danglingPointers);
          parsed = true;
        }
      }
      
      // Delete: delete ptr;
      if (!parsed) {
        const deleteMatch = trimmedLine.match(/^\s*delete\s+(\w+);?\s*$/);
        if (deleteMatch) {
          const [, ptrName] = deleteMatch;
          if (stack.has(ptrName)) {
            const targetAddress = stack.get(ptrName).value;
            if (targetAddress && heap.has(targetAddress)) {
              heap.set(targetAddress, {
                ...heap.get(targetAddress),
                isDeleted: true,
              });
              memoryLeaks.delete(targetAddress); // No longer a leak
              
              // Mark this pointer as dangling
              danglingPointers.add(ptrName);
              
              // Check if other pointers point to same address
              for (const [otherPtr, otherAddr] of pointers.entries()) {
                if (otherAddr === targetAddress) {
                  danglingPointers.add(otherPtr);
                }
              }
            }
          }
          
          addStep(steps, index + 1, trimmedLine, stack, heap, pointers, danglingPointers);
          parsed = true;
        }
      }
      
    } catch (error) {
      console.error(`Error parsing line ${index + 1}:`, error);
    }
  });
  
  console.log(`Generated ${steps.length} execution steps`);
  return steps;
}

function addStep(steps, lineNumber, line, stack, heap, pointers, danglingPointers) {
  // Calculate pointer arrows for visualization
  const pointerArrows = [];
  for (const [ptrName, targetAddr] of pointers.entries()) {
    pointerArrows.push({
      from: ptrName,
      to: targetAddr,
      isDangling: danglingPointers.has(ptrName),
    });
  }
  
  steps.push({
    lineNumber: lineNumber,
    line: line,
    memoryState: {
      stack: Array.from(stack.values()),
      heap: Array.from(heap.entries()).map(([addr, data]) => ({ ...data, address: addr })),
      pointers: pointerArrows,
      danglingPointers: Array.from(danglingPointers),
    },
  });
}

function normalizeType(type) {
  // Normalize type names (e.g., "string" -> "std::string")
  if (type === 'string') return 'std::string';
  return type;
}

function getDefaultValue(type) {
  const normalized = normalizeType(type);
  switch (normalized) {
    case 'int':
    case 'long':
    case 'short':
    case 'unsigned':
      return '0';
    case 'float':
    case 'double':
      return '0.0';
    case 'char':
      return "'\\0'";
    case 'bool':
      return 'false';
    case 'std::string':
      return '""';
    default:
      return '0';
  }
}

function parseValue(value, type) {
  if (!value) return getDefaultValue(type);
  
  // Remove trailing semicolons and whitespace
  value = value.trim().replace(/;$/, '');
  
  // Handle string literals
  if (value.startsWith('"') && value.endsWith('"')) {
    return value;
  }
  
  // Handle char literals
  if (value.startsWith("'") && value.endsWith("'")) {
    return value;
  }
  
  // Handle boolean values
  if (value === 'true' || value === 'false') {
    return value;
  }
  
  // Try to parse as number
  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num;
  }
  
  // Return as string for complex expressions
  return value;
}