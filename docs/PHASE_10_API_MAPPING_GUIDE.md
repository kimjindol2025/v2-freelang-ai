# Phase 10: v1 API to Intent Pattern Mapping Guide

**Version**: 1.0
**Date**: 2026-02-28
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [v1 to v2 Mapping Strategy](#v1-to-v2-mapping-strategy)
3. [Pattern Structure](#pattern-structure)
4. [API Package Coverage](#api-package-coverage)
5. [Confidence Scoring](#confidence-scoring)
6. [Usage Examples](#usage-examples)
7. [Integration Points](#integration-points)
8. [Migration Path](#migration-path)

---

## Overview

### What is v1 API Mapping?

FreeLang v1 contains 596 proven, production-tested APIs across 36 packages. Phase 10 converts these into Intent patterns for v2-freelang-ai's AI-first interface.

### Why Map v1 APIs?

| Reason | Benefit |
|--------|---------|
| **Proven Code** | 18,000 LOC production code |
| **Test Coverage** | 385+ test cases (100% passing) |
| **API Completeness** | 495+ unique functions/methods |
| **Documentation** | Full JSDoc comments |
| **Confidence** | 96.67% average score |

### What Gets Mapped?

```
v1 APIs (596 total)
├─ Functions (248)
├─ Methods (249)
├─ Classes (46)
├─ Interfaces (36)
├─ Constants (8)
└─ Type Aliases (9)

    ↓ Convert ↓

Intent Patterns (578 unique)
├─ Name standardization
├─ Alias generation (3-5 per pattern)
├─ Tag classification
├─ Confidence scoring
├─ Example generation
└─ Relationship linking
```

---

## v1 to v2 Mapping Strategy

### 1. Name Mapping

**v1 API Name** → **Intent Pattern Name**

```
Example 1: Printf Function
  v1: printf(format: string, ...args: any[]): void
  v2: printf

Example 2: HTTP Server Method
  v1: HTTPServer.listen(port: number): void
  v2: HTTPServer.listen

Example 3: JSON Parser
  v1: JSON.parse(text: string): any
  v2: parse (in json package)
```

### 2. Signature Mapping

**v1 Signature** → **v2 Input/Output Types**

```typescript
// v1 Signature
function sum(arr: number[]): number

// v2 Intent Pattern
{
  name: "sum",
  inputTypes: "array<number>",
  outputType: "number",
  examples: [
    {
      input: "[1,2,3,4,5]",
      output: "15",
      description: "Sum of array elements"
    }
  ]
}
```

### 3. Type Mapping

| v1 TypeScript | v2 Intent Type |
|---------------|----------------|
| `number` | `number` |
| `string` | `string` |
| `boolean` | `boolean` |
| `number[]` | `array<number>` |
| `string[]` | `array<string>` |
| `Record<string, T>` | `object<string, T>` |
| `Promise<T>` | `async T` |
| Custom Interface | `<InterfaceName>` |
| `any` | `any` |

### 4. Async Handling

```typescript
// v1: Promise-based
async function readFile(path: string): Promise<string>

// v2: Tagged as async
{
  name: "readFile",
  inputTypes: "string",
  outputType: "string",
  tags: ["async", "io", "read"],
  metadata: {
    isAsync: true,
    paramCount: 1
  }
}
```

---

## Pattern Structure

### Complete Pattern Format

```typescript
interface IntentPattern {
  // Identification
  id: string;                    // "v1-123" (unique ID)
  name: string;                  // "sum" (primary name)
  aliases: string[];             // ["total", "add_all", ...]

  // Classification
  category: string;              // "core" | "network" | etc
  packages: string[];            // ["io", "fs", ...]

  // Description & Examples
  description: string;           // "Calculate sum of array"
  examples: Array<{
    input: string;
    output: string;
    description: string;
  }>;

  // Signature
  inputTypes: string;            // "array<number>, number"
  outputType: string;            // "number"

  // Metadata
  tags: string[];                // ["async", "math", "array", ...]
  complexity: number;            // 1-10 scale
  confidence: number;            // 0.70-0.99

  // Relationships
  relatedPatterns: string[];     // ["v1-124", "v1-125", ...]

  // Machine-readable metadata
  metadata: {
    source: "v1-stdlib" | "v2.1.0";
    apiType: "function" | "method" | ...;
    paramCount: number;
    isAsync: boolean;
    signature: string;            // Full signature
  };
}
```

### Example: File Read Pattern

```json
{
  "id": "v1-fs-read",
  "name": "readFile",
  "aliases": ["read_file", "fs:readFile", "read"],
  "category": "core",
  "packages": ["fs"],
  "description": "Read file contents asynchronously",
  "confidence": 0.98,
  "inputTypes": "string, {encoding?: string}",
  "outputType": "string",
  "examples": [
    {
      "input": "readFile('data.txt')",
      "output": "file contents",
      "description": "Read text file"
    },
    {
      "input": "readFile('config.json', {encoding: 'utf8'})",
      "output": "JSON string",
      "description": "Read with encoding"
    }
  ],
  "tags": ["async", "io", "read", "file"],
  "complexity": 2,
  "relatedPatterns": ["v1-fs-readdir", "v1-fs-stat", "v1-fs-write"],
  "metadata": {
    "source": "v1-stdlib",
    "apiType": "function",
    "paramCount": 2,
    "isAsync": true,
    "signature": "readFile(path: string, options?: {encoding?: string}): Promise<string>"
  }
}
```

---

## API Package Coverage

### Core Packages (124 patterns)

#### I/O (@freelang/io)

| v1 API | Intent Pattern | Confidence |
|--------|----------------|-----------|
| `print()` | print | 98.0% |
| `println()` | println | 98.0% |
| `readLine()` | readLine | 95.0% |
| `printf()` | printf | 97.0% |

#### File System (@freelang/fs)

| v1 API | Intent Pattern | Confidence |
|--------|----------------|-----------|
| `readFile()` | readFile | 98.0% |
| `writeFile()` | writeFile | 98.0% |
| `mkdir()` | mkdir | 97.0% |
| `readdir()` | readdir | 97.0% |

#### Math (@freelang/math)

| v1 API | Intent Pattern | Confidence |
|--------|----------------|-----------|
| `sum()` | sum | 99.0% |
| `mean()` | mean | 98.0% |
| `sqrt()` | sqrt | 98.0% |
| `pow()` | pow | 98.0% |
| ... | ... | ... |

### Network Packages (84 patterns)

#### HTTP (@freelang/http)

```
HTTPClient.get()      → http_get
HTTPClient.post()     → http_post
HTTPServer.listen()   → http_listen
ServerResponse.send() → response_send
```

#### WebSocket (@freelang/ws)

```
WebSocket.connect()   → ws_connect
WebSocket.send()      → ws_send
WebSocket.close()     → ws_close
```

### Security Packages (41 patterns)

```
hash.sha256()         → hash_sha256
jwt.sign()            → jwt_sign
jwt.verify()          → jwt_verify
aes.encrypt()         → aes_encrypt
bcrypt.hash()         → bcrypt_hash
```

---

## Confidence Scoring

### Scoring Algorithm

```
Base Confidence (from v1)
  + Complexity Factor        (-20% worst case)
  + Parameter Factor         (-15% worst case)
  + Async Factor            (-5%)
  + Package Maturity Bonus   (5-15%)
  + Source Quality Bonus     (5%)
  = Final Confidence (clipped to 0.65-0.99)
```

### Confidence Tiers

| Tier | Range | Meaning | Count |
|------|-------|---------|-------|
| **High** | 0.85-0.99 | Stable, well-tested | 565 |
| **Medium** | 0.75-0.84 | Good, some quirks | 13 |
| **Low** | <0.75 | Unstable, avoid | 0 |

### Confidence by Category

```
Core:           97.7% (Functions: print, read, write, etc)
Utilities:      97.8% (Atomic, Mutex, Timer, Logger)
Network:        96.6% (HTTP, WebSocket, TCP)
Infrastructure: 96.3% (SQL, ORM, Prometheus)
Security:       96.0% (Hash, JWT, Encrypt)
Collections:    95.5% (String, Array, DateTime)
Advanced:       94.5% (Cache, Event, Plugin)
```

---

## Usage Examples

### Example 1: Finding Patterns for "Array Operations"

```typescript
const db = new UnifiedPatternDatabase();

// Search for array patterns
const results = db.search("array", 10);

// Results might include:
// - sum (array<number> → number)
// - filter (array<T> → array<T>)
// - map (array<T> → array<U>)
// - find (array<T> → T)
// - length (array<T> → number)
```

### Example 2: Getting Patterns by Category

```typescript
// Get all core patterns
const corePatterns = db.getByCategory("core");
// Returns 124 patterns: print, read, write, parse, etc

// Get all network patterns
const networkPatterns = db.getByCategory("network");
// Returns 84 patterns: http_get, ws_connect, etc
```

### Example 3: Finding Related Patterns

```typescript
const pattern = db.getByName("sum");
const related = db.getRelated(pattern.id);

// Returns related patterns like:
// - mean (same category)
// - count (same category)
// - filter (same package)
```

### Example 4: Pattern Lookup by Alias

```typescript
// Alias: "add_all" → pattern "sum"
const pattern = db.getByAlias("add_all");
// Confidence: 99.0%

// Or snake_case version
const pattern2 = db.getByAlias("read_file");
// Maps to "readFile"
```

---

## Integration Points

### Phase 11: Dynamic Confidence

```
Pattern Confidence (static in Phase 10)
           ↓
    User Feedback
           ↓
Auto-adjust Confidence (Phase 11)
           ↓
Updated Pattern Database
```

### Phase 12: Web Dashboard

```
Pattern Database (578 patterns)
           ↓
Dashboard UI (React)
           ↓
User Interface
  - Search patterns
  - View confidence metrics
  - See related patterns
  - View examples
```

### Phase 13: Custom Patterns

```
v1 API Patterns (578)
           ↓
Custom Pattern DSL (Phase 13)
           ↓
User-defined Patterns
           ↓
Extended Database (600+)
```

---

## Migration Path

### For v1 Users

If you're using v1 directly:

```typescript
// v1 (Direct API)
import * as io from '@freelang/io';
io.println('Hello');

// v2 (Intent-based)
const db = new UnifiedPatternDatabase();
const pattern = db.getByName('println');
// Use pattern metadata to call v1 directly
io.println('Hello');
```

### For v2 Users

If you're using v2-freelang-ai:

```typescript
// v2-freelang-ai (Intent)
const intent = "print message";

// Maps to pattern 'println'
const pattern = db.search('print message')[0];
// Execute via v1 stdlib
v1Stdlib[pattern.name](message);
```

---

## Performance Characteristics

### Lookup Performance

```
Pattern by name:    O(1) - HashMap lookup
Pattern by alias:   O(1) - HashMap lookup
Pattern by category: O(1) - Index lookup
Search by keyword:  O(n) - Full-text scan
```

### Memory Usage

```
Total Patterns:     578
Per-pattern size:   ~2KB (metadata + aliases)
Total DB size:      ~1.2 MB
Loaded in memory:   ~2 MB (with indices)
```

### Initialization Time

```
Loading patterns:   ~10ms
Building indices:   ~5ms
Ready for queries:  ~15ms total
```

---

## Reference

### All 578 Patterns

See `/src/phase-10/v1-v2-adjusted-patterns.json` for complete pattern listing.

### Statistics

- **Total Patterns**: 578
- **Average Confidence**: 96.67%
- **Categories**: 7 (core, collections, network, security, utilities, infrastructure, advanced)
- **Packages**: 36+ (io, fs, http, ws, json, etc)

---

## Troubleshooting

### Pattern Not Found

**Problem**: Can't find expected pattern

**Solution**:
1. Try searching by alias: `db.getByAlias('alias_name')`
2. Try keyword search: `db.search('keyword')`
3. Check category: `db.getByCategory('network')`
4. Check confidence: might be excluded if < 0.75

### Low Confidence Pattern

**Problem**: Pattern has confidence < 0.80

**Reason**: Complex API with many parameters or async nature

**Solution**: Use with caution in Phase 11+ (will be refined with usage)

### Performance Issues

**Problem**: Search is slow

**Reason**: Searching 578 patterns is O(n)

**Solution**: Use direct lookup instead
```typescript
// Slow
db.search('println');

// Fast
db.getByName('println');
```

---

## Future Enhancements

### Phase 11
- Dynamic confidence adjustment based on usage
- Pattern discovery mechanisms
- User feedback integration

### Phase 12
- Web dashboard for 600+ patterns
- Visual pattern browser
- Example repository

### Phase 13
- Custom pattern DSL
- Pattern extension language
- Community pattern sharing

---

**Last Updated**: 2026-02-28
**Status**: Production Ready
**Next**: Phase 11 - Dynamic Confidence System
