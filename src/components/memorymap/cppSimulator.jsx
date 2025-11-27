/**
 * C++ Memory Simulator - Enhanced Version
 * Supports: primitives, pointers, arrays, functions, references, structs/classes, std::vector
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
  'long', 'short', 'unsigned', 'signed',
  'std::string', 'string', 'void', 'std::vector'
];

const TYPE_PATTERN = SUPPORTED_TYPES.join('|').replace(/\./g, '\\.');

/**
 * Parse and simulate C++ code execution
 */
export function parseAndSimulateCpp(code) {
  resetAddressCounter();
  
  const allLines = code.split('\n');
  const steps = [];
  
  // Global memory state
  const heap = new Map();
  const pointers = new Map();
  const references = new Map();
  const danglingPointers = new Set();
  const memoryLeaks = new Set();
  const structs = new Map();
  const functions = new Map();
  
  // Stack frames for function calls
  const callStack = [{ name: 'main', variables: new Map(), lineOffset: 0 }];
  
  let skipUntilLine = -1;
  
  // First pass: Extract struct/class and function definitions
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i].trim();
    
    // Struct/Class definition
    const structMatch = line.match(/^(?:struct|class)\s+(\w+)\s*\{/);
    if (structMatch) {
      const structName = structMatch[1];
      const members = [];
      let j = i + 1;
      
      while (j < allLines.length && !allLines[j].trim().includes('}')) {
        const memberLine = allLines[j].trim();
        const memberMatch = memberLine.match(new RegExp(`^\\s*(${TYPE_PATTERN}(?:\\s*<\\s*\\w+\\s*>)?)\\s+(\\w+)\\s*;`));
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
  
  // Execute code - recursive function to handle function calls
  function executeLine(line, lineIndex, currentFrame) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      return null;
    }
    
    try {
      let parsed = false;
      
      // Function call: functionName(args);
      const funcCallMatch = trimmedLine.match(/^(\w+)\s*\(([^)]*)\)\s*;?$/);
      if (funcCallMatch && functions.has(funcCallMatch[1])) {
        const [, funcName, argsStr] = funcCallMatch;
        const func = functions.get(funcName);
        
        // Create new stack frame
        const newFrame = { name: funcName, variables: new Map(), lineOffset: lineIndex };
        callStack.push(newFrame);
        
        // Parse and assign arguments to parameters
        const args = argsStr ? argsStr.split(',').map(a => a.trim()) : [];
        func.params.forEach((param, idx) => {
          if (idx < args.length) {
            const argValue = evaluateExpression(args[idx], currentFrame);
            const address = generateAddress();
            newFrame.variables.set(param.name, {
              name: param.name,
              type: normalizeType(param.type),
              value: argValue,
              address,
            });
          }
        });
        
        addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
        
        // Execute function body
        func.body.forEach(({ line: bodyLine, lineNumber }) => {
          if (bodyLine.trim().startsWith('return')) {
            // Handle return statement
            const returnMatch = bodyLine.trim().match(/^return\s+([^;]+);?/);
            if (returnMatch) {
              const returnValue = evaluateExpression(returnMatch[1], newFrame);
              // Store return value (simplified - not storing in variable for now)
            }
            addStep(steps, lineNumber + 1, bodyLine.trim(), callStack, heap, pointers, references, danglingPointers);
          } else {
            executeLine(bodyLine, lineNumber, newFrame);
          }
        });
        
        // Pop stack frame
        callStack.pop();
        addStep(steps, lineIndex + 1, `// end of ${funcName}()`, callStack, heap, pointers, references, danglingPointers);
        
        parsed = true;
      }
      
      // Variable declaration with function call: int result = add(5, 10);
      if (!parsed) {
        const varWithFuncMatch = trimmedLine.match(new RegExp(`^\\s*(${TYPE_PATTERN})\\s+(\\w+)\\s*=\\s*(\\w+)\\s*\\(([^)]*)\\)\\s*;?`));
        if (varWithFuncMatch && functions.has(varWithFuncMatch[3])) {
          const [, type, varName, funcName, argsStr] = varWithFuncMatch;
          const func = functions.get(funcName);
          
          // Create new stack frame
          const newFrame = { name: funcName, variables: new Map(), lineOffset: lineIndex };
          callStack.push(newFrame);
          
          // Parse and assign arguments
          const args = argsStr ? argsStr.split(',').map(a => a.trim()) : [];
          func.params.forEach((param, idx) => {
            if (idx < args.length) {
              const argValue = evaluateExpression(args[idx], currentFrame);
              const address = generateAddress();
              newFrame.variables.set(param.name, {
                name: param.name,
                type: normalizeType(param.type),
                value: argValue,
                address,
              });
            }
          });
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          
          // Execute function body and capture return value
          let returnValue = getDefaultValue(type);
          func.body.forEach(({ line: bodyLine, lineNumber }) => {
            if (bodyLine.trim().startsWith('return')) {
              const returnMatch = bodyLine.trim().match(/^return\s+([^;]+);?/);
              if (returnMatch) {
                returnValue = evaluateExpression(returnMatch[1], newFrame);
              }
              addStep(steps, lineNumber + 1, bodyLine.trim(), callStack, heap, pointers, references, danglingPointers);
            } else {
              executeLine(bodyLine, lineNumber, newFrame);
            }
          });
          
          // Pop stack frame
          callStack.pop();
          
          // Store return value in caller's frame
          const address = generateAddress();
          currentFrame.variables.set(varName, {
            name: varName,
            type: normalizeType(type),
            value: returnValue,
            address,
          });
          
          addStep(steps, lineIndex + 1, `${varName} = ${returnValue} // from ${funcName}()`, callStack, heap, pointers, references, danglingPointers);
          parsed = true;
        }
      }
      
      // std::vector declaration
      if (!parsed) {
        const vectorPattern = /^\s*std::vector\s*<\s*(\w+)\s*>\s+(\w+)\s*(?:=\s*\{([^}]*)\})?\s*;?/;
        const vectorMatch = trimmedLine.match(vectorPattern);
        if (vectorMatch) {
          const [, elemType, name, initValues] = vectorMatch;
          const address = generateAddress();
          const heapAddress = generateAddress();
          
          const values = initValues 
            ? initValues.split(',').map(v => parseValue(v.trim(), elemType))
            : [];
          
          heap.set(heapAddress, {
            type: `std::vector<${elemType}>`,
            value: values,
            isDeleted: false,
            isVector: true,
            elemType: elemType,
          });
          
          memoryLeaks.add(heapAddress);
          
          currentFrame.variables.set(name, {
            name,
            type: `std::vector<${elemType}>`,
            value: heapAddress,
            address,
            isVector: true,
          });
          
          pointers.set(name, heapAddress);
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          parsed = true;
        }
      }
      
      // Vector push_back
      if (!parsed) {
        const pushBackMatch = trimmedLine.match(/^\s*(\w+)\.push_back\s*\(\s*([^)]+)\s*\)\s*;?/);
        if (pushBackMatch) {
          const [, vecName, value] = pushBackMatch;
          
          if (currentFrame.variables.has(vecName)) {
            const variable = currentFrame.variables.get(vecName);
            if (variable.isVector && variable.value && heap.has(variable.value)) {
              const heapBlock = heap.get(variable.value);
              const parsedValue = parseValue(value, heapBlock.elemType);
              heapBlock.value.push(parsedValue);
              heap.set(variable.value, heapBlock);
            }
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          parsed = true;
        }
      }
      
      // Vector element access/assignment
      if (!parsed) {
        const vecAssignMatch = trimmedLine.match(/^\s*(\w+)\s*\[\s*(\d+)\s*\]\s*=\s*([^;]+)\s*;?/);
        if (vecAssignMatch) {
          const [, name, indexStr, value] = vecAssignMatch;
          const idx = parseInt(indexStr);
          
          if (currentFrame.variables.has(name)) {
            const variable = currentFrame.variables.get(name);
            if (variable.isVector && variable.value && heap.has(variable.value)) {
              const heapBlock = heap.get(variable.value);
              if (idx >= 0 && idx < heapBlock.value.length) {
                heapBlock.value[idx] = parseValue(value, heapBlock.elemType);
                heap.set(variable.value, heapBlock);
                addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
                parsed = true;
              }
            }
          }
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
            type: `${normalizeType(type)}[${arraySize}]`,
            value: values,
            address,
            isArray: true,
            arraySize,
          });
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          parsed = true;
        }
      }
      
      // Dynamic array allocation
      if (!parsed) {
        const dynArrayPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s*\\*\\s*(\\w+)\\s*=\\s*new\\s+(${TYPE_PATTERN})\\s*\\[\\s*(\\d+)\\s*\\]\\s*;?`);
        const dynArrayMatch = trimmedLine.match(dynArrayPattern);
        if (dynArrayMatch) {
          const [, ptrType, name, arrayType, size] = dynArrayMatch;
          const arraySize = parseInt(size);
          const address = generateAddress();
          const heapAddress = generateAddress();
          
          const values = Array(arraySize).fill(getDefaultValue(arrayType));
          
          heap.set(heapAddress, {
            type: `${normalizeType(arrayType)}[${arraySize}]`,
            value: values,
            isDeleted: false,
            isArray: true,
            arraySize,
          });
          
          memoryLeaks.add(heapAddress);
          
          currentFrame.variables.set(name, {
            name,
            type: `${normalizeType(ptrType)}*`,
            value: heapAddress,
            address,
          });
          
          pointers.set(name, heapAddress);
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
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
            addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          }
        }
      }
      
      // Reference declaration
      if (!parsed) {
        const refPattern = new RegExp(`^\\s*(${TYPE_PATTERN})\\s*&\\s*(\\w+)\\s*=\\s*(\\w+)\\s*;?`);
        const refMatch = trimmedLine.match(refPattern);
        if (refMatch) {
          const [, type, refName, targetName] = refMatch;
          
          if (currentFrame.variables.has(targetName)) {
            const target = currentFrame.variables.get(targetName);
            const address = generateAddress();
            
            currentFrame.variables.set(refName, {
              name: refName,
              type: `${normalizeType(type)}&`,
              value: target.value,
              address,
              isReference: true,
              referenceTo: targetName,
              referenceAddress: target.address,
            });
            
            references.set(refName, target.address);
            
            addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
            parsed = true;
          }
        }
      }
      
      // Struct/Class instance
      if (!parsed) {
        for (const [structName, structDef] of structs.entries()) {
          const structInstPattern = new RegExp(`^\\s*${structName}\\s+(\\w+)\\s*;?`);
          const structInstMatch = trimmedLine.match(structInstPattern);
          if (structInstMatch) {
            const [, instanceName] = structInstMatch;
            const address = generateAddress();
            
            const memberValues = {};
            structDef.members.forEach(member => {
              if (member.type.startsWith('std::vector')) {
                memberValues[member.name] = [];
              } else {
                memberValues[member.name] = getDefaultValue(member.type);
              }
            });
            
            currentFrame.variables.set(instanceName, {
              name: instanceName,
              type: structName,
              value: memberValues,
              address,
              isStruct: true,
              members: structDef.members,
            });
            
            addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
            parsed = true;
            break;
          }
        }
      }
      
      // Member access
      if (!parsed) {
        const memberAssignMatch = trimmedLine.match(/^\s*(\w+)\.(\w+)\s*=\s*([^;]+)\s*;?/);
        const nestedMemberCallMatch = trimmedLine.match(/^\s*(\w+)\.(\w+)\.push_back\s*\(\s*([^)]+)\s*\)\s*;?/);

        if (memberAssignMatch) {
          const [, objName, memberName, value] = memberAssignMatch;
          
          if (currentFrame.variables.has(objName)) {
            const obj = currentFrame.variables.get(objName);
            if (obj.isStruct && obj.value) {
              const member = obj.members.find(m => m.name === memberName);
              if (member) {
                if (member.type.startsWith('std::vector')) {
                   const parsedValue = value.match(/\{([^}]*)\}/) 
                     ? value.match(/\{([^}]*)\}/)[1].split(',').map(v => parseValue(v.trim(), 'int'))
                     : parseValue(value, member.type.replace(/std::vector<\s*(\w+)\s*>/, '$1'));
                   obj.value[memberName] = parsedValue;
                } else {
                  obj.value[memberName] = parseValue(value, member.type);
                }
                currentFrame.variables.set(objName, obj);
              }
            }
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          parsed = true;
        } else if (nestedMemberCallMatch) {
          const [, objName, memberName, pushBackValue] = nestedMemberCallMatch;

          if (currentFrame.variables.has(objName)) {
            const obj = currentFrame.variables.get(objName);
            if (obj.isStruct && obj.value) {
              const member = obj.members.find(m => m.name === memberName);
              if (member && member.type.startsWith('std::vector')) {
                const elemTypeMatch = member.type.match(/std::vector<\s*(\w+)\s*>/);
                const elemType = elemTypeMatch ? elemTypeMatch[1] : 'int';
                
                obj.value[memberName].push(parseValue(pushBackValue, elemType));
                currentFrame.variables.set(objName, obj);
                addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
                parsed = true;
              }
            }
          }
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
            type: normalizeType(type),
            value: parseValue(value, type),
            address,
          });
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
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
            if (initialValue.includes('new') && !initialValue.includes('[')) {
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
                memoryLeaks.add(targetAddress);
              }
            } else if (initialValue.startsWith('&')) {
              const targetVar = initialValue.substring(1).trim();
              if (currentFrame.variables.has(targetVar)) {
                targetAddress = currentFrame.variables.get(targetVar).address;
              }
            } else if (initialValue === 'nullptr' || initialValue === 'NULL') {
              targetAddress = null;
            }
          }
          
          currentFrame.variables.set(name, {
            name,
            type: `${normalizeType(type)}*`,
            value: targetAddress,
            address,
          });
          
          if (targetAddress) {
            pointers.set(name, targetAddress);
          }
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
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
              
              if (value.includes('new') && !value.includes('[')) {
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
                if (currentFrame.variables.has(targetVar)) {
                  targetAddress = currentFrame.variables.get(targetVar).address;
                }
              } else if (currentFrame.variables.has(value) && currentFrame.variables.get(value).type.includes('*')) {
                targetAddress = currentFrame.variables.get(value).value;
              } else if (value === 'nullptr' || value === 'NULL') {
                targetAddress = null;
              }
              
              const oldAddress = variable.value;
              if (oldAddress && heap.has(oldAddress) && !heap.get(oldAddress).isDeleted) {
                const stillReferenced = Array.from(currentFrame.variables.values()).some(v => 
                  (v.type.includes('*') && v.value === oldAddress && v.name !== name) ||
                  (v.isVector && v.value === oldAddress && v.name !== name)
                );
                const otherPointersReferencing = Array.from(pointers.entries()).some(([ptrKey, ptrAddr]) => 
                    ptrAddr === oldAddress && ptrKey !== name
                );

                if (!stillReferenced && !otherPointersReferencing) {
                  memoryLeaks.add(oldAddress);
                }
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
            
            addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
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
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          parsed = true;
        }
      }
      
      // Delete
      if (!parsed) {
        const deleteMatch = trimmedLine.match(/^\s*delete\s*\[\s*\]\s*(\w+);?\s*$|^\s*delete\s+(\w+);?\s*$/);
        if (deleteMatch) {
          const ptrName = deleteMatch[1] || deleteMatch[2];
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
          
          addStep(steps, lineIndex + 1, trimmedLine, callStack, heap, pointers, references, danglingPointers);
          parsed = true;
        }
      }
      
    } catch (error) {
      console.error(`Error parsing line ${lineIndex + 1}:`, error);
    }
  }
  
  // Helper function to evaluate expressions (variables, literals, operations)
  function evaluateExpression(expr, frame) {
    expr = expr.trim();
    
    // Check if it's a variable
    if (frame.variables.has(expr)) {
      return frame.variables.get(expr).value;
    }
    
    // Check if it's a literal
    return parseValue(expr, 'int'); // Default to int
  }
  
  // Second pass: Execute main code
  allLines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      return;
    }
    
    // Skip struct/class definitions
    if (trimmedLine.match(/^(?:struct|class)\s+\w+/)) {
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
  
  console.log(`Generated ${steps.length} execution steps`);
  return steps;
}

function addStep(steps, lineNumber, line, callStack, heap, pointers, references, danglingPointers) {
  const currentFrame = callStack[callStack.length - 1];
  const pointerArrows = [];
  
  // Add pointer arrows
  for (const [ptrName, targetAddr] of pointers.entries()) {
    const varEntry = currentFrame.variables.get(ptrName);
    if (varEntry && (varEntry.type.includes('*') || varEntry.isVector) && varEntry.value === targetAddr) {
        pointerArrows.push({
            from: ptrName,
            to: targetAddr,
            isDangling: danglingPointers.has(ptrName),
            type: varEntry.type.includes('*') ? 'pointer' : 'vector_data_ptr',
        });
    }
  }
  
  // Add reference arrows
  for (const [refName, targetAddr] of references.entries()) {
    pointerArrows.push({
      from: refName,
      to: targetAddr,
      isDangling: false,
      type: 'reference',
    });
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

function normalizeType(type) {
  if (type === 'string') return 'std::string';
  if (type.startsWith('std::vector')) return 'std::vector';
  return type;
}

function getDefaultValue(type) {
  const normalized = normalizeType(type);
  switch (normalized) {
    case 'int':
    case 'long':
    case 'short':
    case 'unsigned':
      return 0;
    case 'float':
    case 'double':
      return 0.0;
    case 'char':
      return "'\\0'";
    case 'bool':
      return false;
    case 'std::string':
      return '""';
    case 'std::vector':
      return [];
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
  
  if (value === 'true' || value === 'false') {
    return value === 'true';
  }
  
  if (value === 'nullptr' || value === 'NULL') {
      return null;
  }

  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num;
  }
  
  return value;
}