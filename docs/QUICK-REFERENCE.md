# FreeLang v2 Quick API Reference

## 📚 Complete API Documentation Map

```
Source Code
    ↓
[1. Lexer]           → Tokenization
   📖 docs/api/lexer.md
    ↓
[2. Parser]          → AST Generation
   📖 docs/api/parser.md
    ↓
[3. Semantic Analyzer] → Type Inference
   📖 docs/api/semantic-analyzer.md
    ↓
[4. Type System]     → Type Checking & Validation
   📖 docs/api/type-system.md
    ↓
[5. Code Generator]  → IR + Target Code
   📖 docs/api/code-generator.md
    ↓
[6. Optimizer]       → IR Optimization
   📖 docs/api/optimizer.md
    ↓
[7. Virtual Machine] → Bytecode Execution
   📖 docs/api/virtual-machine.md
    ↓
Binary / Execution
```

---

## 🚀 Quick Start Examples

### 1. Tokenize Source Code
```typescript
import { Lexer } from './src/lexer/lexer';

const lexer = new Lexer("fn add(a, b) { a + b }");
const tokens = lexer.tokenize();
```
**Docs**: [Lexer API](./docs/api/lexer.md)

---

### 2. Parse Tokens to AST
```typescript
import { Parser } from './src/parser/parser';

const parser = new Parser(tokens);
const ast = parser.parse();
```
**Docs**: [Parser API](./docs/api/parser.md)

---

### 3. Analyze Types and Variables
```typescript
import { SemanticAnalyzer } from './src/analyzer/semantic-analyzer';

const analyzer = new SemanticAnalyzer();
const variables = analyzer.analyzeVariableLifecycle(code);
```
**Docs**: [Semantic Analyzer API](./docs/api/semantic-analyzer.md)

---

### 4. Validate Type Compatibility
```typescript
import { FunctionTypeChecker } from './src/analyzer/type-checker';

const checker = new FunctionTypeChecker();
const result = checker.checkFunctionCall('add', ['number', 'number'], ...);
```
**Docs**: [Type System API](./docs/api/type-system.md)

---

### 5. Generate IR Code
```typescript
import { IRGenerator } from './src/codegen/ir-generator';

const generator = new IRGenerator();
const ir = generator.generateIR(ast);
```
**Docs**: [Code Generator API](./docs/api/code-generator.md)

---

### 6. Optimize IR
```typescript
import { OptimizationDetector, OptimizationApplier } from './src/analyzer/optimization-*';

const detector = new OptimizationDetector();
const suggestions = detector.detectOptimizations(ir);

const applier = new OptimizationApplier();
for (const suggestion of suggestions) {
  const decision = applier.decide(suggestion);
  if (decision.shouldApply) {
    ir = applier.apply(decision, ir);
  }
}
```
**Docs**: [Optimizer API](./docs/api/optimizer.md)

---

### 7. Execute Bytecode
```typescript
import { VM } from './src/vm';

const vm = new VM();
const result = vm.run(ir);

if (result.ok) {
  console.log(`Result: ${result.value}`);
  console.log(`Cycles: ${result.cycles}`);
  console.log(`Time: ${result.ms}ms`);
}
```
**Docs**: [Virtual Machine API](./docs/api/virtual-machine.md)

---

## 📖 Complete Workflow Guide

**Full example with all steps**: [API Workflow Guide](./docs/getting-started/api-workflow.md)

---

## 🔧 API Reference Summary

| API | File | Key Classes | Main Method |
|-----|------|-------------|------------|
| **Lexer** | lexer.md | Lexer | `tokenize()` |
| **Parser** | parser.md | Parser | `parse()` |
| **Semantic** | semantic-analyzer.md | SemanticAnalyzer | `analyzeVariableLifecycle()` |
| **Types** | type-system.md | FunctionTypeChecker | `checkFunctionCall()` |
| **Codegen** | code-generator.md | IRGenerator, CGenerator | `generateIR()` |
| **Optimizer** | optimizer.md | OptimizationDetector | `detectOptimizations()` |
| **VM** | virtual-machine.md | VM | `run()` |

---

## 📊 Documentation Statistics

| Item | Count |
|------|-------|
| API Reference Files | 8 |
| Getting Started Guides | 1 |
| Total Documentation Lines | 4,400+ |
| Total Size | 110 KB |
| Code Examples | 80+ |
| Interfaces Documented | 30+ |
| Classes Documented | 10+ |
| Methods Documented | 40+ |

---

## 🎯 Common Tasks

### Analyze a FreeLang Function
```typescript
// Complete analysis pipeline
const source = "fn sum(arr) { ... }";

// 1. Tokenize
const lexer = new Lexer(source);
const tokens = lexer.tokenize();

// 2. Parse
const parser = new Parser(tokens);
const ast = parser.parse();

// 3. Analyze
const analyzer = new SemanticAnalyzer();
const vars = analyzer.analyzeVariableLifecycle(source);

// 4. Infer types
const signature = analyzer.inferFunctionSignature(source);

// 5. Validate
const checker = new FunctionTypeChecker();
const valid = checker.checkFunctionCall(signature.name, ...);
```

---

### Compile and Execute
```typescript
// Full compilation pipeline
const source = "fn main() { 5 + 3 }";

// 1-4. Parse (see above)
const ast = parser.parse();

// 5. Generate IR
const generator = new IRGenerator();
let ir = generator.generateIR(ast);

// 6. Optimize
const detector = new OptimizationDetector();
const suggestions = detector.detectOptimizations(ir);
// ... apply optimizations ...

// 7. Execute
const vm = new VM();
const result = vm.run(ir);
```

---

### Detect and Apply Optimizations
```typescript
const detector = new OptimizationDetector();
const applier = new OptimizationApplier();
const tracker = new OptimizationTracker();

// Find all optimizations
const suggestions = detector.detectOptimizations(ir);

// Apply safe ones
let optimized = ir;
for (const suggestion of suggestions) {
  const decision = applier.decide(suggestion);

  if (decision.shouldApply && decision.riskLevel === 'safe') {
    optimized = applier.apply(decision, optimized);

    // Track result
    tracker.record(suggestion, true, expectedImprovement);
  }
}
```

---

## 🔍 Error Handling

### Parse Errors
```typescript
try {
  const parser = new Parser(tokens);
  const ast = parser.parse();
} catch (error) {
  if (error instanceof ParseError) {
    console.error(`${error.line}:${error.column} ${error.message}`);
  }
}
```

### Type Errors
```typescript
const result = checker.checkFunctionCall('func', ...);
if (!result.compatible) {
  console.error(`Type mismatch: ${result.message}`);
  console.error(`Expected: ${result.details?.expected}`);
  console.error(`Got: ${result.details?.received}`);
}
```

### Runtime Errors
```typescript
const result = vm.run(ir);
if (!result.ok) {
  console.error(`Runtime error: ${result.error?.detail}`);
  console.error(`At: ${result.error?.pc}`);
  console.error(`Stack: ${result.error?.stack_depth}`);
}
```

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| [Lexer API](./docs/api/lexer.md) | Tokenization (tokens from code) |
| [Parser API](./docs/api/parser.md) | AST generation (tree from tokens) |
| [Type System API](./docs/api/type-system.md) | Type checking & validation |
| [Semantic Analyzer API](./docs/api/semantic-analyzer.md) | Type inference & analysis |
| [Code Generator API](./docs/api/code-generator.md) | IR & target code generation |
| [Optimizer API](./docs/api/optimizer.md) | IR optimization passes |
| [Virtual Machine API](./docs/api/virtual-machine.md) | Bytecode execution |
| [API Workflow Guide](./docs/getting-started/api-workflow.md) | Complete pipeline example |

---

## 🎓 Learning Path

1. **Start with Workflow** → [API Workflow Guide](./docs/getting-started/api-workflow.md)
2. **Understand Tokens** → [Lexer API](./docs/api/lexer.md)
3. **Learn Parsing** → [Parser API](./docs/api/parser.md)
4. **Type System** → [Type System API](./docs/api/type-system.md)
5. **Code Generation** → [Code Generator API](./docs/api/code-generator.md)
6. **Optimization** → [Optimizer API](./docs/api/optimizer.md)
7. **Execution** → [Virtual Machine API](./docs/api/virtual-machine.md)

---

## ⚡ Performance Tips

1. **Reuse objects**: Create VM/Parser once, use multiple times
2. **Enable caching**: Type checks are cached (3-5x faster)
3. **Profile with metrics**: Watch cycles and ms
4. **Apply safe optimizations**: Always apply constant folding, DCE
5. **Monitor warnings**: Check type warnings and errors

---

## 🔗 File Locations

```
FreeLang v2 Directory:
├── src/
│   ├── lexer/
│   │   ├── lexer.ts        (Lexer class)
│   │   ├── token.ts        (Token types)
│   │   └── zero-copy-tokenizer.ts
│   ├── parser/
│   │   ├── parser.ts       (Parser class)
│   │   ├── ast.ts          (AST types)
│   │   └── one-pass-parser.ts
│   ├── analyzer/
│   │   ├── semantic-analyzer.ts
│   │   ├── type-checker.ts
│   │   ├── optimization-detector.ts
│   │   ├── optimization-applier.ts
│   │   └── optimization-tracker.ts
│   ├── codegen/
│   │   ├── ir-generator.ts
│   │   ├── c-generator.ts
│   │   └── simd-*
│   └── vm.ts               (VM class)
└── docs/
    ├── api/                (API Reference)
    ├── getting-started/    (Guides)
    └── QUICK-REFERENCE.md  (This file)
```

---

## 📞 Support

For detailed API documentation, refer to the individual API reference files in `/docs/api/`.

For complete workflow examples, see `/docs/getting-started/api-workflow.md`.

---

**Last Updated**: 2026-02-18
**Version**: v2.2.0
**Status**: Documentation Complete for Core APIs ✅
