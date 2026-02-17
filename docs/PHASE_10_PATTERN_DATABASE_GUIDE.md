# Phase 10: Pattern Database User Guide

**Version**: 1.0
**Date**: 2026-02-28
**Audience**: Developers using FreeLang v2-freelang-ai

---

## 📋 Quick Start (5 minutes)

### Installation

```bash
npm install v2-freelang-ai@2.1.0
```

### Import Database

```typescript
import { DATABASE, UnifiedPatternDatabase } from 'v2-freelang-ai';

// Use singleton
const pattern = DATABASE.getByName('sum');

// Or create instance
const db = new UnifiedPatternDatabase();
```

### Find a Pattern

```typescript
// By name
const sumPattern = db.getByName('sum');
console.log(sumPattern.confidence); // 0.99

// By alias
const pattern = db.getByAlias('add_all');
// Same as above

// By search
const results = db.search('calculate total');
console.log(results[0].name); // 'sum'
```

### Use Pattern Metadata

```typescript
const pattern = db.getByName('readFile');

console.log(pattern.inputTypes);   // "string, {encoding?: string}"
console.log(pattern.outputType);   // "string"
console.log(pattern.tags);         // ["async", "io", "read", "file"]
console.log(pattern.confidence);   // 0.98
console.log(pattern.examples);     // [{input: "...", output: "...", ...}]
```

---

## 🔍 Core API Reference

### UnifiedPatternDatabase Class

#### Constructor

```typescript
const db = new UnifiedPatternDatabase();
```

#### Lookup Methods

**getByName(name: string): IntentPattern | undefined**
```typescript
const pattern = db.getByName('sum');
if (pattern) {
  console.log(pattern.confidence); // 0.99
}
```

**getByAlias(alias: string): IntentPattern | undefined**
```typescript
const pattern = db.getByAlias('read_file');
// Maps to 'readFile'
```

**getById(id: string): IntentPattern | undefined**
```typescript
const pattern = db.getById('v1-fs-read');
```

#### Search Methods

**search(query: string, limit?: number): IntentPattern[]**
```typescript
// Find top 10 patterns matching "array"
const results = db.search('array', 10);

// Results ranked by relevance and confidence
results.forEach(p => {
  console.log(`${p.name}: ${p.confidence}`);
});
```

**getByCategory(category: string): IntentPattern[]**
```typescript
// Get all network patterns
const network = db.getByCategory('network');
console.log(network.length); // 84

// Get all core patterns
const core = db.getByCategory('core');
console.log(core.length); // 124
```

**getByPackage(pkg: string): IntentPattern[]**
```typescript
// Get all HTTP patterns
const http = db.getByPackage('http');
console.log(http.length); // 29

// Get all file system patterns
const fs = db.getByPackage('fs');
console.log(fs.length); // 16
```

**getByTag(tag: string): IntentPattern[]**
```typescript
// Get all async patterns
const async = db.getByTag('async');
console.log(async.length); // 150+

// Get all read operations
const read = db.getByTag('read');
console.log(read.length); // 80+
```

**getHighConfidence(threshold?: number): IntentPattern[]**
```typescript
// Get very confident patterns (default: >= 0.85)
const confident = db.getHighConfidence();
console.log(confident.length); // 565

// Get extremely confident patterns
const veryConfident = db.getHighConfidence(0.95);
console.log(veryConfident.length); // 400+
```

#### Relationship Methods

**getRelated(patternId: string, limit?: number): IntentPattern[]**
```typescript
const pattern = db.getByName('sum');
const related = db.getRelated(pattern.id, 5);

related.forEach(p => {
  console.log(`Related: ${p.name}`);
  // Related: mean
  // Related: median
  // Related: count
});
```

#### Statistics & Utility

**getStatistics(): DatabaseStatistics**
```typescript
const stats = db.getStatistics();
console.log(`
  Total: ${stats.totalPatterns}
  Avg Confidence: ${stats.averageConfidence}
  Categories: ${stats.categories}
  Packages: ${stats.packages}
  High Confidence: ${stats.confidenceBreakdown.high}
`);
```

**getAll(): IntentPattern[]**
```typescript
// Get all 578 patterns
const allPatterns = db.getAll();
```

**count(): number**
```typescript
console.log(`Database has ${db.count()} patterns`);
```

---

## 💡 Common Use Cases

### Use Case 1: Auto-Complete

```typescript
function getAutocompleteSuggestions(prefix: string): string[] {
  const results = db.search(prefix, 10);
  return results.map(p => p.name);
}

// Usage
console.log(getAutocompleteSuggestions('read'));
// Output: ['readFile', 'readLine', 'readdir', ...]
```

### Use Case 2: Pattern Recommendation

```typescript
function recommendPatterns(userInput: string): IntentPattern[] {
  return db.search(userInput, 5);
}

// Usage
const patterns = recommendPatterns("I want to sum an array");
const best = patterns[0];
console.log(`Recommended: ${best.name} (confidence: ${best.confidence})`);
// Output: Recommended: sum (confidence: 0.99)
```

### Use Case 3: Category Browsing

```typescript
function browsePatterns(category: string): void {
  const patterns = db.getByCategory(category);

  console.log(`\n📦 ${category.toUpperCase()} (${patterns.length} patterns)\n`);
  patterns.slice(0, 5).forEach(p => {
    console.log(`  • ${p.name.padEnd(20)} - ${p.description}`);
  });
}

// Usage
browsePatterns('core');
// Output:
// 📦 CORE (124 patterns)
//
//   • print                 - Output text to console
//   • println               - Output text with newline
//   • readFile              - Read file contents
//   • writeFile             - Write to file
//   • mkdir                 - Create directory
```

### Use Case 4: Finding Related Functionality

```typescript
function findSimilar(patternName: string): void {
  const pattern = db.getByName(patternName);
  if (!pattern) {
    console.log(`Pattern '${patternName}' not found`);
    return;
  }

  console.log(`\n🔗 Related to '${patternName}':\n`);

  const related = db.getRelated(pattern.id);
  related.forEach(p => {
    console.log(`  • ${p.name} (confidence: ${(p.confidence * 100).toFixed(0)}%)`);
  });
}

// Usage
findSimilar('sum');
// Output:
// 🔗 Related to 'sum':
//
//   • mean (confidence: 98%)
//   • median (confidence: 92%)
//   • count (confidence: 97%)
//   • stddev (confidence: 91%)
```

### Use Case 5: Pattern Statistics

```typescript
function analyzeConfidence(): void {
  const stats = db.getStatistics();

  console.log(`\n📊 Pattern Database Statistics\n`);
  console.log(`Total Patterns: ${stats.totalPatterns}`);
  console.log(`Average Confidence: ${(stats.averageConfidence * 100).toFixed(2)}%`);
  console.log(`\nConfidence Distribution:`);
  console.log(`  High (≥0.85): ${stats.confidenceBreakdown.high}`);
  console.log(`  Medium (0.75-0.85): ${stats.confidenceBreakdown.medium}`);
  console.log(`  Low (<0.75): ${stats.confidenceBreakdown.low}`);
  console.log(`\nCategories: ${stats.categories}`);
  console.log(`Packages: ${stats.packages}`);
}

// Usage
analyzeConfidence();
```

---

## 🏗️ Pattern Structure

### IntentPattern Interface

```typescript
interface IntentPattern {
  // Identification
  id: string;              // "v1-fs-read"
  name: string;            // "readFile"
  aliases: string[];       // ["read_file", "fs:readFile", ...]

  // Classification
  category: string;        // "core" | "network" | ...
  packages: string[];      // ["fs"]

  // Description
  description: string;     // "Read file contents"
  examples: Array<{
    input: string;
    output: string;
    description: string;
  }>;

  // Signature
  inputTypes: string;      // "string, {encoding?: string}"
  outputType: string;      // "string"

  // Quality Metrics
  confidence: number;      // 0.70-0.99
  complexity: number;      // 1-10
  tags: string[];          // ["async", "io", "read", ...]

  // Relationships
  relatedPatterns: string[]; // ["v1-fs-write", "v1-io-read", ...]

  // Metadata
  metadata: {
    source: string;        // "v1-stdlib" | "v2.1.0"
    apiType: string;       // "function" | "method" | ...
    paramCount: number;
    isAsync: boolean;
    signature: string;
  };
}
```

### Example Pattern Object

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
    }
  ],
  "tags": ["async", "io", "read", "file"],
  "complexity": 2,
  "relatedPatterns": ["v1-fs-write", "v1-fs-stat", "v1-io-println"],
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

## 📊 Available Categories

```
core            (124 patterns)  - I/O, File System, Math, Path, Environment, JSON
network         (84 patterns)   - HTTP, WebSocket, TCP, URL, gRPC
utilities       (117 patterns)  - Timer, Logger, Atomic, Mutex, Promise
infrastructure  (96 patterns)   - SQL, ORM, Prometheus, Swagger
security        (41 patterns)   - Hash, JWT, AES, Bcrypt
collections     (58 patterns)   - String, Array/List, DateTime, Regex
advanced        (58 patterns)   - Cache, Event, Plugin, Worker, Stream
```

---

## 🎯 Available Packages

| Category | Package | Count | Examples |
|----------|---------|-------|----------|
| Core | io | 11 | print, println, readLine |
| Core | fs | 16 | readFile, writeFile, mkdir |
| Core | math | 44 | sum, mean, sqrt, pow |
| Core | json | 14 | parse, stringify |
| Network | http | 29 | HTTPClient, HTTPServer |
| Network | ws | 18 | WebSocket connection |
| Security | hash | 18 | SHA256, MD5 |
| Security | jwt | 10 | sign, verify, decode |
| Utilities | timer | 30 | setTimeout, setInterval |
| Utilities | logger | 20 | log, warn, error |

---

## 🚀 Performance Tips

### Tip 1: Use Direct Lookup for Best Performance

```typescript
// ✅ Fast (O(1))
const pattern = db.getByName('sum');

// ✅ Fast (O(1))
const pattern = db.getByAlias('add_all');

// ⚠️ Slower (O(n))
const patterns = db.search('sum', 1);
const pattern = patterns[0];
```

### Tip 2: Cache Results

```typescript
const patternCache = new Map<string, IntentPattern>();

function getCachedPattern(name: string): IntentPattern | undefined {
  if (!patternCache.has(name)) {
    patternCache.set(name, db.getByName(name));
  }
  return patternCache.get(name);
}
```

### Tip 3: Use Categories for Bulk Operations

```typescript
// Instead of searching for each pattern individually
const patterns = db.getByCategory('network');
// Get all 84 network patterns at once
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Assuming Pattern Exists

```typescript
// ❌ Bad: Will crash if pattern not found
const pattern = db.getByName('nonexistent');
console.log(pattern.confidence); // TypeError!

// ✅ Good: Check first
const pattern = db.getByName('nonexistent');
if (pattern) {
  console.log(pattern.confidence);
} else {
  console.log('Pattern not found');
}
```

### Pitfall 2: Ignoring Confidence

```typescript
// ❌ Bad: Using low-confidence patterns
const pattern = db.getHighConfidence(0.5)[0]; // Very unreliable

// ✅ Good: Use high-confidence patterns
const pattern = db.getHighConfidence(0.85)[0]; // 565 safe patterns
```

### Pitfall 3: Over-searching

```typescript
// ❌ Bad: Full-text search in loop
for (let i = 0; i < 1000; i++) {
  const p = db.search('pattern')[0]; // O(n) each iteration!
}

// ✅ Good: Cache or use direct lookup
const pattern = db.getByName('pattern'); // O(1)
for (let i = 0; i < 1000; i++) {
  console.log(pattern.name);
}
```

---

## 🔗 Integration Examples

### Example: Express.js Integration

```typescript
import express from 'express';
import { DATABASE } from 'v2-freelang-ai';

const app = express();

// Endpoint: Get pattern by name
app.get('/api/patterns/:name', (req, res) => {
  const pattern = DATABASE.getByName(req.params.name);
  if (!pattern) {
    return res.status(404).json({ error: 'Pattern not found' });
  }
  res.json(pattern);
});

// Endpoint: Search patterns
app.get('/api/search', (req, res) => {
  const q = req.query.q as string;
  const limit = parseInt(req.query.limit as string) || 10;
  const results = DATABASE.search(q, limit);
  res.json(results);
});

// Endpoint: Get statistics
app.get('/api/stats', (req, res) => {
  const stats = DATABASE.getStatistics();
  res.json(stats);
});

app.listen(3000);
```

### Example: React Component

```typescript
import React, { useState } from 'react';
import { DATABASE } from 'v2-freelang-ai';

export function PatternSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (q: string) => {
    setQuery(q);
    const patterns = DATABASE.search(q, 10);
    setResults(patterns);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search patterns..."
      />
      <ul>
        {results.map((p) => (
          <li key={p.id}>
            {p.name} ({p.confidence.toFixed(0)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 📞 Support & Resources

- **Gogs**: https://gogs.dclub.kr/kim/v2-freelang-ai
- **API Mapping Guide**: `./PHASE_10_API_MAPPING_GUIDE.md`
- **Phase 10 Report**: `./src/phase-10/PHASE_10_WEEK2_REPORT.md`

---

**Last Updated**: 2026-02-28
**Status**: Production Ready
**Next**: Phase 11 - Dynamic Confidence System
