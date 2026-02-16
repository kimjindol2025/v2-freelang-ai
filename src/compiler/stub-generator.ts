/**
 * Phase 2 Task 2.1: Stub Generator for Incomplete Code
 *
 * Generates type-aware stub values for incomplete code:
 * - Empty function bodies → return stub(returnType)
 * - Incomplete expressions → complete with type-appropriate values
 * - Empty blocks → fill with appropriate stubs
 * - Missing returns → insert automatically
 *
 * Example:
 * ```freelang
 * fn calculate
 *   input: x: number
 *   output: number
 *   do
 *     // Empty
 * ↓
 * fn calculate(x: number) -> number {
 *   return stub(number);  // Auto-generated
 * }
 * ```
 */

import { FunctionStatement, BlockStatement, Expression, Statement } from '../parser/ast';

/**
 * Configuration for stub generation
 */
export interface StubGeneratorConfig {
  defaultValue: boolean;  // true: basic default (0, "", []), false: null
  autoComplete: boolean;  // true: auto-complete incomplete expressions
  strictMode: boolean;    // true: stub is error, false: warning only
}

/**
 * Result of stub generation
 */
export interface StubResult {
  success: boolean;
  code: string;
  stubs: Stub[];
  warnings: Warning[];
  modified: boolean;
}

/**
 * A generated stub
 */
export interface Stub {
  type: string;           // number, string, array<T>, etc.
  value: string;          // The stub value (e.g., "0", '""', "[]")
  location: string;       // Where it was inserted
  reason: string;         // Why it was inserted
}

/**
 * A warning about incomplete code
 */
export interface Warning {
  type: 'INCOMPLETE_BODY' | 'INCOMPLETE_EXPR' | 'MISSING_RETURN' | 'EMPTY_BLOCK';
  line: number;
  message: string;
  suggestion?: string;
  autoFixed: boolean;
}

/**
 * Stub Generator - Creates type-aware stubs for incomplete code
 */
export class StubGenerator {
  private config: StubGeneratorConfig;
  private stubs: Stub[] = [];
  private warnings: Warning[] = [];

  constructor(config: Partial<StubGeneratorConfig> = {}) {
    this.config = {
      defaultValue: true,
      autoComplete: true,
      strictMode: false,
      ...config,
    };
  }

  /**
   * Generate stubs for incomplete function
   */
  public generateForFunction(
    func: FunctionStatement,
    returnType: string
  ): StubResult {
    this.stubs = [];
    this.warnings = [];

    let code = func.toString();
    let modified = false;

    // Check for empty body
    if (this.isEmpty(func.body)) {
      const stub = this.generateStubForType(returnType);
      const returnStmt = `return ${stub};`;
      code = this.insertReturn(code, returnStmt);
      modified = true;

      this.stubs.push({
        type: returnType,
        value: stub,
        location: 'empty_body',
        reason: 'Function body is empty',
      });

      this.warnings.push({
        type: 'INCOMPLETE_BODY',
        line: func.line || 0,
        message: 'Empty function body',
        suggestion: `Add: ${returnStmt}`,
        autoFixed: true,
      });
    }

    // Check for empty blocks (if, for, while)
    const blockStubs = this.findAndFixEmptyBlocks(code, 'void');
    if (blockStubs.length > 0) {
      modified = true;
      this.stubs.push(...blockStubs);
    }

    // Check for missing return
    if (returnType !== 'void') {
      const hasReturn = this.hasReturn(code);
      if (!hasReturn) {
        const stub = this.generateStubForType(returnType);
        code += `\nreturn ${stub};`;
        modified = true;

        this.stubs.push({
          type: returnType,
          value: stub,
          location: 'missing_return',
          reason: 'Missing return statement',
        });

        this.warnings.push({
          type: 'MISSING_RETURN',
          line: func.line || 0,
          message: `Missing return for type ${returnType}`,
          suggestion: `Add: return ${stub};`,
          autoFixed: true,
        });
      }
    }

    return {
      success: true,
      code,
      stubs: this.stubs,
      warnings: this.warnings,
      modified,
    };
  }

  /**
   * Complete an incomplete expression with type-appropriate value
   *
   * Example:
   * - "total = total +" → "total = total + stub(number)"
   * - "arr.push(" → "arr.push(stub(any))"
   * - "if " → "if stub(bool)"
   */
  public completeExpression(
    expr: string,
    expectedType: string
  ): string {
    if (!expr.trim()) {
      return this.generateStubForType(expectedType);
    }

    // Remove trailing operators
    const trimmed = expr.trimEnd();

    // Check for incomplete binary operators
    const binaryOps = ['+', '-', '*', '/', '%', '&&', '||', '==', '!=', '<', '>', '<=', '>='];
    for (const op of binaryOps) {
      if (trimmed.endsWith(op)) {
        const stub = this.generateStubForType(expectedType);
        return expr + stub;
      }
    }

    // Check for incomplete function call
    if (trimmed.endsWith('(')) {
      const stub = this.generateStubForType(expectedType);
      return expr + stub + ')';
    }

    // Check for incomplete array access
    if (trimmed.endsWith('[')) {
      return expr + this.generateStubForType('number') + ']';
    }

    // Check for incomplete method chain
    if (trimmed.endsWith('.')) {
      return expr + 'method()';
    }

    // Default: return as-is
    return expr;
  }

  /**
   * Insert missing return statement
   */
  public insertMissingReturn(
    func: FunctionStatement,
    returnType: string
  ): FunctionStatement {
    if (this.hasReturn(func.body.toString())) {
      return func;
    }

    const stub = this.generateStubForType(returnType);
    const returnStmt = new Statement();
    returnStmt.type = 'return';

    // This is a simplified version; in reality, we'd parse and create proper AST
    func.body.statements.push({
      type: 'return',
      value: stub,
    } as any);

    this.warnings.push({
      type: 'MISSING_RETURN',
      line: func.line || 0,
      message: `Added missing return of type ${returnType}`,
      autoFixed: true,
    });

    return func;
  }

  /**
   * Generate type-aware stub value
   *
   * Type → Stub Value Mapping:
   * - number → "0"
   * - string → '""'
   * - bool → "false"
   * - array<T> → "[]"
   * - any/unknown → "null"
   */
  public generateStubForType(type: string): string {
    // Parse generic types
    if (type.startsWith('array<')) {
      return '[]';
    }

    switch (type.toLowerCase()) {
      case 'number':
      case 'int':
      case 'float':
      case 'double':
        return this.config.defaultValue ? '0' : 'null';

      case 'string':
      case 'str':
        return this.config.defaultValue ? '""' : 'null';

      case 'bool':
      case 'boolean':
        return this.config.defaultValue ? 'false' : 'null';

      case 'array':
        return '[]';

      case 'void':
        return '// empty';

      case 'null':
      case 'none':
        return 'null';

      case 'any':
      case 'unknown':
      default:
        return this.config.defaultValue ? 'null' : 'null';
    }
  }

  /**
   * Check if block is empty
   */
  private isEmpty(block: BlockStatement | string): boolean {
    if (typeof block === 'string') {
      const trimmed = block.trim();
      return trimmed.length === 0 || trimmed === '{}' || trimmed === 'do';
    }

    // Check AST node
    const stmts = Array.isArray(block.statements) ? block.statements : [];
    return stmts.length === 0;
  }

  /**
   * Find and fix empty blocks (if, for, while)
   */
  private findAndFixEmptyBlocks(code: string, defaultType: string): Stub[] {
    const stubs: Stub[] = [];
    const lines = code.split('\n');

    const blockKeywords = ['if ', 'for ', 'while ', 'else '];
    const blockRegex = new RegExp(`^\\s*(${blockKeywords.join('|')})`);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (blockRegex.test(line)) {
        // Check if next lines are empty/just closing brace
        let j = i + 1;
        let isEmpty = true;

        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine === '' || nextLine === '}') {
            j++;
            continue;
          }
          isEmpty = false;
          break;
        }

        if (isEmpty && this.config.autoComplete) {
          const stub = this.generateStubForType(defaultType);
          lines.splice(i + 1, 0, `  ${stub}`);

          stubs.push({
            type: defaultType,
            value: stub,
            location: `line_${i + 1}`,
            reason: 'Empty block body',
          });

          this.warnings.push({
            type: 'EMPTY_BLOCK',
            line: i + 1,
            message: 'Empty block',
            suggestion: `Add: ${stub}`,
            autoFixed: true,
          });
        }
      }
    }

    return stubs;
  }

  /**
   * Check if code has return statement
   */
  private hasReturn(code: string): boolean {
    const lines = code.split('\n');
    return lines.some(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('return ') || trimmed === 'return';
    });
  }

  /**
   * Insert return statement into code
   */
  private insertReturn(code: string, returnStmt: string): string {
    const lines = code.split('\n');

    // Find the last non-empty line
    let insertIdx = lines.length;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim() !== '') {
        insertIdx = i + 1;
        break;
      }
    }

    lines.splice(insertIdx, 0, returnStmt);
    return lines.join('\n');
  }

  /**
   * Get all generated stubs
   */
  public getStubs(): Stub[] {
    return this.stubs;
  }

  /**
   * Get all warnings
   */
  public getWarnings(): Warning[] {
    return this.warnings;
  }

  /**
   * Clear state
   */
  public reset(): void {
    this.stubs = [];
    this.warnings = [];
  }
}

// Convenience function
export function createStubGenerator(
  config?: Partial<StubGeneratorConfig>
): StubGenerator {
  return new StubGenerator(config);
}
