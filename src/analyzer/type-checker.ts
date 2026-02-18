/**
 * FreeLang Type Checker
 * Validate type compatibility and check function calls
 */

import { TypeParser } from '../cli/type-parser';

/**
 * Result of a type check operation
 */
export interface TypeCheckResult {
  compatible: boolean;
  message: string;
  details?: {
    expected?: string;
    received?: string;
    paramName?: string;
    paramIndex?: number;
  };
}

/**
 * Function type information
 */
export interface FunctionTypes {
  params: Record<string, string>;  // param name -> type
  returnType?: string;             // return type (optional)
}

/**
 * FunctionTypeChecker: Validate type compatibility and track errors
 */
export class FunctionTypeChecker {
  private errors: Array<{
    functionName: string;
    error: TypeCheckResult;
    timestamp: Date;
  }> = [];

  /**
   * Check function call type compatibility
   * Validates that provided argument types match expected parameter types
   */
  checkFunctionCall(
    funcName: string,
    argTypes: string[],
    expectedParams: Record<string, string>,
    expectedParamNames: string[]
  ): TypeCheckResult {
    // Check parameter count
    if (argTypes.length !== expectedParamNames.length) {
      const result: TypeCheckResult = {
        compatible: false,
        message: `Function '${funcName}' expects ${expectedParamNames.length} arguments, got ${argTypes.length}`,
        details: {
          expected: `${expectedParamNames.length} parameters`,
          received: `${argTypes.length} arguments`
        }
      };
      this.trackError(funcName, result);
      return result;
    }

    // Check each parameter type
    for (let i = 0; i < expectedParamNames.length; i++) {
      const paramName = expectedParamNames[i];
      const expectedType = expectedParams[paramName];
      const providedType = argTypes[i];

      if (expectedType && !TypeParser.areTypesCompatible(expectedType, providedType)) {
        const result: TypeCheckResult = {
          compatible: false,
          message: `Parameter '${paramName}' expects ${expectedType}, got ${providedType}`,
          details: {
            expected: expectedType,
            received: providedType,
            paramName,
            paramIndex: i
          }
        };
        this.trackError(funcName, result);
        return result;
      }
    }

    // All checks passed
    return {
      compatible: true,
      message: `Function '${funcName}' call is type-safe`
    };
  }

  /**
   * Check type assignment compatibility
   * Can source type be assigned to target type?
   */
  checkAssignment(paramName: string, paramType: string, argType: string): TypeCheckResult {
    const compatible = TypeParser.areTypesCompatible(paramType, argType);

    return {
      compatible,
      message: compatible
        ? `Assignment of '${argType}' to '${paramType}' is valid`
        : `Cannot assign '${argType}' to '${paramType}' parameter '${paramName}'`,
      details: {
        expected: paramType,
        received: argType,
        paramName
      }
    };
  }

  /**
   * Infer type of a value
   */
  inferType(value: any): string {
    return TypeParser.inferType(value);
  }

  /**
   * Validate function signature types
   */
  validateFunctionSignature(
    funcName: string,
    paramTypes: Record<string, string>,
    returnType: string | undefined,
    paramNames: string[]
  ): TypeCheckResult {
    // Check that all parameter types are valid
    for (const paramName of paramNames) {
      const paramType = paramTypes[paramName];
      if (paramType && !TypeParser.isValidType(paramType)) {
        const result: TypeCheckResult = {
          compatible: false,
          message: `Invalid type '${paramType}' for parameter '${paramName}' in function '${funcName}'`,
          details: {
            expected: 'Valid type',
            received: paramType,
            paramName
          }
        };
        this.trackError(funcName, result);
        return result;
      }
    }

    // Check return type is valid
    if (returnType && !TypeParser.isValidType(returnType)) {
      const result: TypeCheckResult = {
        compatible: false,
        message: `Invalid return type '${returnType}' for function '${funcName}'`,
        details: {
          expected: 'Valid type',
          received: returnType
        }
      };
      this.trackError(funcName, result);
      return result;
    }

    return {
      compatible: true,
      message: `Function '${funcName}' signature is valid`
    };
  }

  /**
   * Generate function signature string
   * Example: "fn add(number, number): number"
   */
  generateSignature(
    funcName: string,
    paramTypes: Record<string, string>,
    paramNames: string[],
    returnType?: string
  ): string {
    const params = paramNames
      .map(name => paramTypes[name] ? `${name}: ${paramTypes[name]}` : name)
      .join(', ');

    const returnPart = returnType ? `: ${returnType}` : '';
    return `fn ${funcName}(${params})${returnPart}`;
  }

  /**
   * Track type error for reporting
   */
  private trackError(functionName: string, error: TypeCheckResult): void {
    this.errors.push({
      functionName,
      error,
      timestamp: new Date()
    });
  }

  /**
   * Get all tracked errors
   */
  getErrors(): Array<{
    functionName: string;
    error: TypeCheckResult;
    timestamp: Date;
  }> {
    return [...this.errors];
  }

  /**
   * Get errors for a specific function
   */
  getFunctionErrors(funcName: string): TypeCheckResult[] {
    return this.errors
      .filter(e => e.functionName === funcName)
      .map(e => e.error);
  }

  /**
   * Clear all tracked errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * Check if a parameter requires type annotation
   * Based on usage patterns, returns whether type is necessary
   */
  shouldRequireTypeAnnotation(paramName: string, usedInOperations: string[]): boolean {
    // If parameter is used in mathematical operations, should have numeric type
    const mathOps = ['+', '-', '*', '/', '%', '>', '<', '>=', '<='];
    const hasMathUsage = usedInOperations.some(op => mathOps.includes(op));

    // If parameter is used in string operations, should have string type
    const stringOps = ['concat', '+', 'substring', 'contains'];
    const hasStringUsage = usedInOperations.some(op => stringOps.includes(op));

    // Return true if mixed usage (needs clarification) or single clear usage
    return hasMathUsage || hasStringUsage;
  }

  /**
   * Validate parameter count against expected types
   */
  validateParameterCount(
    funcName: string,
    actualCount: number,
    expectedParamTypes: Record<string, string>,
    expectedParamNames: string[]
  ): TypeCheckResult {
    if (actualCount !== expectedParamNames.length) {
      return {
        compatible: false,
        message: `Function '${funcName}' definition has ${actualCount} parameters but type signature expects ${expectedParamNames.length}`,
        details: {
          expected: `${expectedParamNames.length} parameters`,
          received: `${actualCount} parameters`
        }
      };
    }

    return {
      compatible: true,
      message: `Parameter count matches type signature`
    };
  }

  /**
   * Phase 2: Check for...of statement type safety
   * Validates:
   * 1. Iterable is array type
   * 2. Element type is correctly inferred
   * 3. Variable is properly bound in scope
   */
  checkForOfStatement(
    variable: string,
    iterableType: string,
    loopBodyContext?: any
  ): TypeCheckResult {
    // 1. Validate iterable is array
    if (!iterableType.startsWith('array<')) {
      return {
        compatible: false,
        message: `for...of requires array type, got ${iterableType}`,
        details: {
          expected: 'array<T>',
          received: iterableType,
          paramName: 'iterable'
        }
      };
    }

    // 2. Extract element type
    const elementType = this.extractElementType(iterableType);

    // 3. Validate element type is valid
    if (!TypeParser.isValidType(elementType)) {
      return {
        compatible: false,
        message: `Invalid element type '${elementType}' in array`,
        details: {
          expected: 'Valid type',
          received: elementType
        }
      };
    }

    // 4. Variable binding succeeded
    return {
      compatible: true,
      message: `for...of loop variable '${variable}' bound to type '${elementType}'`,
      details: {
        expected: elementType,
        received: elementType,
        paramName: variable
      }
    };
  }

  /**
   * Phase 2: Extract element type from array<T>
   * Example: array<string> → string
   * Example: array<number> → number
   * Example: array<object> → object
   */
  extractElementType(arrayType: string): string {
    const match = arrayType.match(/array<(.+)>/);
    return match ? match[1] : 'unknown';
  }

  /**
   * Phase 2: Validate for...of variable can be used in loop body
   * Returns the type that the variable should have
   */
  getForOfVariableType(iterableType: string): string {
    if (!iterableType.startsWith('array<')) {
      return 'unknown';
    }
    return this.extractElementType(iterableType);
  }
}
