/**
 * C Memory Simulator
 * Supports: primitives, pointers, arrays, structs, malloc/free
 */

let addressCounter = 0x1000;

function generateAddress() {
  const addr = `0x${addressCounter.toString(16)}`;
  addressCounter += 8;
  return addr;
}

function resetAddressCounter() {
  addressCounter = 0x1000;
}

const SUPPORTED_TYPES = [
  'int', 'float', 'double', 'char', 'bool',
  'long', 'short', 'unsigned', 'signed', 'void', 'size_t'
];

const TYPE_PATTERN = SUPPORTED_TYPES.join('|');

/**
 * Parse and simulate C code execution
 */
export function parseAndSimulateC(code) {
  resetAddressCounter();
  
  const allLines = code.split('\n');
  const steps = [];
  
  // Global memory state
  const heap = new Map();
  const pointers = new Map();
  const danglingPointers = new Set();
  const memoryLeaks = new Set();
  const structs = new Map();
  const functions = new Map();
  
  // Stack frames for function calls
  const callStack = [{ name: 'main', variables: new Map(), lineOffset: 0 }];
  
  let skipUntilLine = -1;
  
  // First pass: Extract struct and function definitions
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i].trim();
    
    // Struct definition
    const structMatch = line.match(/^struct\s+(\w+)\s*\{/);
    if (structMatch) {
      const structName = structMatch[1];
      const members = [];
      let j = i + 1;
      
      while (j < allLines.length && !allLines[j].trim().includes('}')) {
        const memberLine = allLines[j].trim();
        const memberMatch = memberLine.match(new RegExp(`^\\s*(${TYPE_PATTERN})\\s+(\\w+)\\s*;`));
        if (memberMatch) {
          members.push({ type: memberMatch[1], name: memberMatch[2] });
        }
        j++;
      }
      
      structs.set(structName, { members });
    }
    
    // Function definition
    const funcMatch = line.match(new RegExp(`^\\s*(${TYPE_PATTERN})\\s+(\\w+)\\s*\\(([^)]*)\\)\\s*\\{?`));
    if (funcMatch && funcMatch[2] !== 'main') {
      const [, returnType, funcName, paramsStr] = funcMatch;
      const funcBody = [];
      const startLine = i;
      let j = i + 1;
      let braceCount = 1;
      
      while (j < allLines.length && braceCount > 0) {
        const bodyLine = allLines[j].trim();
        if (bodyLine.includes('{')) braceCount++;
        if (bodyLine.includes('}')) braceCount--;
        if (braceCount > 0) {
          funcBody.push({ line: allLines[j], lineNumber: j });
        }
        j++;
      }
      
      // Parse parameters
      const params = [];
      if (paramsStr.trim()) {
        paramsStr.split(',').forEach(param => {
          const paramMatch = param.trim().match(new RegExp(`^\\s*(${TYPE_PATTERN})\\s*\\*?\\s*(\\w+)`));
          if (paramMatch) {
            params.push({ type: paramMatch[1], name: paramMatch[2] });
          }
        });
      }
      
      functions.set(funcName, { returnType, params, body: funcBody, startLine });
    }
  }
  
  // Execute code
  function executeLine(line, lineIndex, currentFrame) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('#')) {
      return null;
    }
    
    try {
      let parsed = false;
      
      // malloc allocation: int* ptr = (int*)malloc(sizeof(int));
      if (!parsed) {
        const mallocPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s*\\*\\s*(\\w+)\\s*=\\s*\\(?\\s*(${TYPE_PATTERN})?\\s*\\*?\\)?\\s*malloc\\s*\\(([^)]+)\\)\\s*;?`);
        const mallocMatch = trimmedLine.match(mallocPattern);
        if (mallocMatch) {
          const [, ptrType, name, , sizeExpr] = mallocMatch;
          const address = generateAddress();
          const heapAddress = generateAddress();
          
          // Check if it's an array allocation
          const arrayMatch = sizeExpr.match(/(\d+)\s*\*\s*sizeof/);
          const isArray = arrayMatch !== null;
          const arraySize = isArray ? parseInt(arrayMatch[1]) : 1;
          
          if (isArray) {
            heap.set(heapAddress, {
              type: `${ptrType}[${arraySize}]`,
              value: Array(arraySize).fill(getDefaultValue(ptrType)),
              isDeleted: false,
              isArray: true,
              arraySize,
            });
          } else {
            heap.set(heapAddress, {
              type: ptrType,
              value: getDefaultValue(ptrType),
              isDeleted: false,
            });
          }
          
          memoryLeaks.add(heapAddress);
          
          currentFrame.variables.set(name, {
            name,
            type: `${ptrType}*`,
            value: heapAddress,
            address,
          });
          
          pointers.set(name, heapAddress);
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // calloc allocation
      if (!parsed) {
        const callocPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s*\\*\\s*(\\w+)\\s*=\\s*\\(?\\s*(${TYPE_PATTERN})?\\s*\\*?\\)?\\s*calloc\\s*\\(([^,]+),([^)]+)\\)\\s*;?`);
        const callocMatch = trimmedLine.match(callocPattern);
        if (callocMatch) {
          const [, ptrType, name, , countExpr] = callocMatch;
          const address = generateAddress();
          const heapAddress = generateAddress();
          const arraySize = parseInt(countExpr.trim()) || 1;
          
          heap.set(heapAddress, {
            type: `${ptrType}[${arraySize}]`,
            value: Array(arraySize).fill(0), // calloc initializes to zero
            isDeleted: false,
            isArray: true,
            arraySize,
          });
          
          memoryLeaks.add(heapAddress);
          
          currentFrame.variables.set(name, {
            name,
            type: `${ptrType}*`,
            value: heapAddress,
            address,
          });
          
          pointers.set(name, heapAddress);
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // free(ptr)
      if (!parsed) {
        const freeMatch = trimmedLine.match(/^\s*free\s*\(\s*(\w+)\s*\)\s*;?/);
        if (freeMatch) {
          const ptrName = freeMatch[1];
          if (currentFrame.variables.has(ptrName)) {
            const targetAddress = currentFrame.variables.get(ptrName).value;
            if (targetAddress && heap.has(targetAddress)) {
              heap.set(targetAddress, {
                ...heap.get(targetAddress),
                isDeleted: true,
              });
              memoryLeaks.delete(targetAddress);
              
              for (const [otherPtr, otherAddr] of pointers.entries()) {
                if (otherAddr === targetAddress) {
                  danglingPointers.add(otherPtr);
                }
              }
            }
            currentFrame.variables.set(ptrName, {
              ...currentFrame.variables.get(ptrName),
              value: null,
            });
            pointers.delete(ptrName);
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // Static array declaration
      if (!parsed) {
        const staticArrayPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s+(\\w+)\\s*\\[\\s*(\\d+)\\s*\\]\\s*(?:=\\s*\\{([^}]*)\\})?\\s*;?`);
        const staticArrayMatch = trimmedLine.match(staticArrayPattern);
        if (staticArrayMatch) {
          const [, type, name, size, initValues] = staticArrayMatch;
          const arraySize = parseInt(size);
          const address = generateAddress();
          
          const values = initValues 
            ? initValues.split(',').map(v => parseValue(v.trim(), type))
            : Array(arraySize).fill(getDefaultValue(type));
          
          currentFrame.variables.set(name, {
            name,
            type: `${type}[${arraySize}]`,
            value: values,
            address,
            isArray: true,
            arraySize,
          });
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // Array element assignment
      if (!parsed) {
        const arrayAssignMatch = trimmedLine.match(/^\s*(\w+)\s*\[\s*(\d+)\s*\]\s*=\s*([^;]+)\s*;?/);
        if (arrayAssignMatch) {
          const [, name, indexStr, value] = arrayAssignMatch;
          const index = parseInt(indexStr);
          
          if (currentFrame.variables.has(name)) {
            const variable = currentFrame.variables.get(name);
            if (variable.isArray && variable.value) {
              const baseType = variable.type.replace(/\[.*\]/, '');
              variable.value[index] = parseValue(value, baseType);
              currentFrame.variables.set(name, variable);
              parsed = true;
            }
          }
          
          if (!parsed) {
            for (const [varName, varData] of currentFrame.variables.entries()) {
              if (varData.type.includes('*') && varData.value && heap.has(varData.value)) {
                const heapBlock = heap.get(varData.value);
                if (heapBlock.isArray) {
                  const baseType = heapBlock.type.replace(/\[.*\]/, '');
                  heapBlock.value[index] = parseValue(value, baseType);
                  heap.set(varData.value, heapBlock);
                  parsed = true;
                  break;
                }
              }
            }
          }

          if(parsed) {
            addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          }
        }
      }
      
      // Struct instance
      if (!parsed) {
        for (const [structName, structDef] of structs.entries()) {
          const structInstPattern = new RegExp(`^\\s*struct\\s+${structName}\\s+(\\w+)\\s*;?`);
          const structInstMatch = trimmedLine.match(structInstPattern);
          if (structInstMatch) {
            const [, instanceName] = structInstMatch;
            const address = generateAddress();
            
            const memberValues = {};
            structDef.members.forEach(member => {
              memberValues[member.name] = getDefaultValue(member.type);
            });
            
            currentFrame.variables.set(instanceName, {
              name: instanceName,
              type: `struct ${structName}`,
              value: memberValues,
              address,
              isStruct: true,
              members: structDef.members,
            });
            
            addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
            parsed = true;
            break;
          }
        }
      }
      
      // Member access
      if (!parsed) {
        const memberAssignMatch = trimmedLine.match(/^\s*(\w+)\.(\w+)\s*=\s*([^;]+)\s*;?/);
        if (memberAssignMatch) {
          const [, objName, memberName, value] = memberAssignMatch;
          
          if (currentFrame.variables.has(objName)) {
            const obj = currentFrame.variables.get(objName);
            if (obj.isStruct && obj.value) {
              const member = obj.members.find(m => m.name === memberName);
              if (member) {
                obj.value[memberName] = parseValue(value, member.type);
                currentFrame.variables.set(objName, obj);
              }
            }
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // Pointer member access (->)
      if (!parsed) {
        const ptrMemberMatch = trimmedLine.match(/^\s*(\w+)->(\w+)\s*=\s*([^;]+)\s*;?/);
        if (ptrMemberMatch) {
          const [, ptrName, memberName, value] = ptrMemberMatch;
          
          if (currentFrame.variables.has(ptrName)) {
            const ptr = currentFrame.variables.get(ptrName);
            if (ptr.value && heap.has(ptr.value)) {
              const heapBlock = heap.get(ptr.value);
              if (heapBlock.value && typeof heapBlock.value === 'object') {
                heapBlock.value[memberName] = parseValue(value, 'int');
                heap.set(ptr.value, heapBlock);
              }
            }
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // Variable declaration
      if (!parsed) {
        const varDeclPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s+(\\w+)\\s*=\\s*([^;]+);?\\s*$`);
        const varDeclMatch = trimmedLine.match(varDeclPattern);
        if (varDeclMatch) {
          const [, type, name, value] = varDeclMatch;
          const address = generateAddress();
          currentFrame.variables.set(name, {
            name,
            type: type,
            value: parseValue(value, type),
            address,
          });
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // Pointer declaration
      if (!parsed) {
        const ptrDeclPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s*\\*\\s*(\\w+)\\s*(?:=\\s*([^;]+))?;?\\s*$`);
        const ptrDeclMatch = trimmedLine.match(ptrDeclPattern);
        if (ptrDeclMatch) {
          const [, type, name, initialValue] = ptrDeclMatch;
          const address = generateAddress();
          
          let targetAddress = null;
          if (initialValue) {
            if (initialValue.startsWith('&')) {
              const targetVar = initialValue.substring(1).trim();
              if (currentFrame.variables.has(targetVar)) {
                targetAddress = currentFrame.variables.get(targetVar).address;
              }
            } else if (initialValue === 'NULL' || initialValue === '0') {
              targetAddress = null;
            } else if (currentFrame.variables.has(initialValue) && currentFrame.variables.get(initialValue).type.includes('*')) {
              targetAddress = currentFrame.variables.get(initialValue).value;
            }
          }
          
          currentFrame.variables.set(name, {
            name,
            type: `${type}*`,
            value: targetAddress,
            address,
          });
          
          if (targetAddress) {
            pointers.set(name, targetAddress);
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
      // Assignment to existing variable
      if (!parsed) {
        const varAssignMatch = trimmedLine.match(/^\s*(\w+)\s*=\s*([^;]+);?\s*$/);
        if (varAssignMatch && !trimmedLine.includes('*') && !trimmedLine.includes('[') && !trimmedLine.includes('.')) {
          const [, name, value] = varAssignMatch;
          
          if (currentFrame.variables.has(name)) {
            const variable = currentFrame.variables.get(name);
            
            if (variable.type.includes('*')) {
              let targetAddress = null;
              
              if (value.startsWith('&')) {
                const targetVar = value.substring(1).trim();
                if (currentFrame.variables.has(targetVar)) {
                  targetAddress = currentFrame.variables.get(targetVar).address;
                }
              } else if (currentFrame.variables.has(value) && currentFrame.variables.get(value).type.includes('*')) {
                targetAddress = currentFrame.variables.get(value).value;
              } else if (value === 'NULL' || value === '0') {
                targetAddress = null;
              }
              
              currentFrame.variables.set(name, {
                ...variable,
                value: targetAddress,
              });
              
              if (targetAddress) {
                pointers.set(name, targetAddress);
                if (heap.has(targetAddress) && heap.get(targetAddress).isDeleted) {
                  danglingPointers.add(name);
                }
              } else {
                pointers.delete(name);
                danglingPointers.delete(name);
              }
            } else {
              currentFrame.variables.set(name, {
                ...variable,
                value: parseValue(value, variable.type),
              });
            }
            
            addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
            parsed = true;
          }
        }
      }
      
      // Dereference assignment
      if (!parsed) {
        const derefMatch = trimmedLine.match(/^\s*\*(\w+)\s*=\s*([^;]+);?\s*$/);
        if (derefMatch) {
          const [, ptrName, newValue] = derefMatch;
          if (currentFrame.variables.has(ptrName)) {
            const pointer = currentFrame.variables.get(ptrName);
            const targetAddress = pointer.value;
            if (targetAddress) {
              const baseType = pointer.type.replace('*', '').trim();
              
              if (heap.has(targetAddress)) {
                heap.set(targetAddress, {
                  ...heap.get(targetAddress),
                  value: parseValue(newValue, baseType),
                });
              } else {
                for (const [varName, varData] of currentFrame.variables.entries()) {
                  if (varData.address === targetAddress) {
                    currentFrame.variables.set(varName, {
                      ...varData,
                      value: parseValue(newValue, varData.type),
                    });
                    break;
                  }
                }
              }
            }
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, new Map(), danglingPointers);
          parsed = true;
        }
      }
      
    } catch (error) {
      console.error(`Error parsing line ${lineIndex + 1}:`, error);
    }
  }
  
  // Second pass: Execute main code
  allLines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('#')) {
      return;
    }
    
    // Skip struct definitions
    if (trimmedLine.match(/^struct\s+\w+\s*\{/)) {
      skipUntilLine = index;
      let braceCount = 0;
      for (let i = index; i < allLines.length; i++) {
        if (allLines[i].includes('{')) braceCount++;
        if (allLines[i].includes('}')) {
          braceCount--;
          if (braceCount === 0) {
            skipUntilLine = i;
            break;
          }
        }
      }
      return;
    }
    
    if (index <= skipUntilLine) return;
    
    // Skip function definitions (except main)
    if (trimmedLine.match(new RegExp(`^\\s*(${TYPE_PATTERN})\\s+(\\w+)\\s*\\([^)]*\\)\\s*\\{?`)) && !trimmedLine.includes('main')) {
      skipUntilLine = index;
      let braceCount = 1;
      for (let i = index + 1; i < allLines.length; i++) {
        if (allLines[i].includes('{')) braceCount++;
        if (allLines[i].includes('}')) {
          braceCount--;
          if (braceCount === 0) {
            skipUntilLine = i;
            break;
          }
        }
      }
      return;
    }
    
    const currentFrame = callStack[callStack.length - 1];
    executeLine(line, index, currentFrame);
  });
  
  console.log(`Generated ${steps.length} C execution steps`);
  return steps;
}

function addStep(steps, lineNumber, line, callStack, heap, pointers, references, danglingPointers) {
  const currentFrame = callStack[callStack.length - 1];
  const pointerArrows = [];
  
  for (const [ptrName, targetAddr] of pointers.entries()) {
    const varEntry = currentFrame.variables.get(ptrName);
    if (varEntry && varEntry.type.includes('*') && varEntry.value === targetAddr) {
      pointerArrows.push({
        from: ptrName,
        to: targetAddr,
        isDangling: danglingPointers.has(ptrName),
        type: 'pointer',
      });
    }
  }
  
  steps.push({
    lineNumber: lineNumber,
    line: line,
    memoryState: {
      stack: Array.from(currentFrame.variables.values()),
      heap: Array.from(heap.entries()).map(([addr, data]) => ({ ...data, address: addr })),
      pointers: pointerArrows,
      danglingPointers: Array.from(danglingPointers),
      callStack: callStack.map(frame => ({ name: frame.name, varCount: frame.variables.size })),
    },
  });
}

function getDefaultValue(type) {
  switch (type) {
    case 'int':
    case 'long':
    case 'short':
    case 'unsigned':
    case 'size_t':
      return 0;
    case 'float':
    case 'double':
      return 0.0;
    case 'char':
      return "'\\0'";
    case 'bool':
      return 0;
    default:
      return 0;
  }
}

function parseValue(value, type) {
  if (!value) return getDefaultValue(type);
  
  value = value.trim().replace(/;$/, '');
  
  if (value.startsWith('"') && value.endsWith('"')) {
    return value;
  }
  
  if (value.startsWith("'") && value.endsWith("'")) {
    return value;
  }
  
  if (value === 'NULL' || value === '0' && type.includes('*')) {
    return null;
  }

  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num;
  }
  
  return value;
}