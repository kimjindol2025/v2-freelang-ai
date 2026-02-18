# Standard Library Reference

## Overview

FreeLang's Standard Library provides 280+ functions across 11 modules for common programming tasks.

**Version**: v2.2.0
**Total Functions**: 280+
**Modules**: 11
**Status**: Production Ready

---

## 📦 Module Index

| Module | Functions | Purpose |
|--------|-----------|---------|
| **math** | 48 | Mathematical operations |
| **array** | 37 | Array manipulation |
| **string** | 31 | String operations |
| **object** | 24 | Object manipulation |
| **date** | 24 | Date/time handling |
| **map** | 22 | Map data structure |
| **promise** | 19 | Promise/async support |
| **set** | 17 | Set data structure |
| **encoding** | 17 | Encoding/decoding |
| **regex** | 16 | Regular expressions |
| **json** | 9 | JSON parsing |
| **io** | 7 | Input/output |
| **TOTAL** | **280+** | |

---

## 🧮 Math Module

### Constants

```typescript
import { PI, E, LN2, SQRT2 } from "std/math";

PI       // 3.14159265...
E        // 2.71828182...
LN2      // 0.69314718...
SQRT2    // 1.41421356...
```

### Functions (48 total)

#### Rounding & Truncation
- `abs(n)` - Absolute value
- `round(n)` - Round to nearest integer
- `floor(n)` - Round down
- `ceil(n)` - Round up
- `trunc(n)` - Truncate decimals
- `sign(n)` - Get sign (-1, 0, 1)

#### Powers & Roots
- `pow(base, exp)` - Power: base^exp
- `sqrt(n)` - Square root
- `cbrt(n)` - Cubic root
- `hypot(...args)` - Hypotenuse

#### Exponential & Logarithm
- `exp(n)` - e^n
- `log(n)` - Natural logarithm
- `log10(n)` - Base 10 logarithm
- `log2(n)` - Base 2 logarithm

#### Trigonometry
- `sin(rad)`, `cos(rad)`, `tan(rad)` - Sine, cosine, tangent
- `asin(x)`, `acos(x)`, `atan(x)` - Inverse trig
- `atan2(y, x)` - Two-argument arctangent

#### Hyperbolic
- `sinh(x)`, `cosh(x)`, `tanh(x)` - Hyperbolic functions

#### Min/Max/Clamping
- `min(...args)` - Minimum value
- `max(...args)` - Maximum value
- `clamp(value, min, max)` - Constrain to range

#### Random Numbers
- `random()` - Random 0-1
- `randomInt(max)` - Random 0 to max-1
- `randomRange(min, max)` - Random in range

#### Statistics
- `mean(arr)` - Average
- `median(arr)` - Median
- `variance(arr)` - Variance
- `stdDev(arr)` - Standard deviation
- `sum(arr)` - Sum of elements

### Examples

```typescript
import { sqrt, PI, random, clamp } from "std/math";

sqrt(16);           // 4
sin(PI / 2);        // 1
random();           // 0.42391...
clamp(150, 0, 100); // 100
```

---

## 📚 Array Module (37 functions)

### Creation & Inspection
- `create(size)` - Create array of size
- `from(iterable)` - Create from iterable
- `length(arr)` - Get array length
- `isEmpty(arr)` - Check if empty

### Accessing Elements
- `get(arr, index)` - Get element
- `set(arr, index, value)` - Set element
- `first(arr)` - Get first element
- `last(arr)` - Get last element
- `at(arr, index)` - Get with negative indices

### Modification
- `push(arr, ...items)` - Add to end
- `pop(arr)` - Remove last
- `shift(arr)` - Remove first
- `unshift(arr, ...items)` - Add to start
- `concat(arr1, arr2)` - Combine arrays
- `slice(arr, start, end)` - Extract portion
- `splice(arr, start, deleteCount, ...items)` - Replace portion

### Functional Operations
- `map(arr, fn)` - Transform each element
- `filter(arr, predicate)` - Keep matching elements
- `reduce(arr, fn, initial)` - Fold into single value
- `forEach(arr, fn)` - Iterate with side effects
- `find(arr, predicate)` - Find first match
- `findIndex(arr, predicate)` - Find first index
- `some(arr, predicate)` - Check if any match
- `every(arr, predicate)` - Check if all match

### Sorting & Ordering
- `sort(arr, compareFn?)` - Sort array
- `reverse(arr)` - Reverse order
- `shuffle(arr)` - Random shuffle

### Searching & Comparison
- `includes(arr, item)` - Check membership
- `indexOf(arr, item)` - Find index
- `lastIndexOf(arr, item)` - Find last index
- `unique(arr)` - Remove duplicates
- `flatten(arr, depth?)` - Flatten nested arrays
- `join(arr, separator)` - Join as string

### Examples

```typescript
import { map, filter, reduce, unique } from "std/array";

map([1, 2, 3], x => x * 2);        // [2, 4, 6]
filter([1, 2, 3], x => x > 1);     // [2, 3]
reduce([1, 2, 3], (a, b) => a + b, 0); // 6
unique([1, 1, 2, 2, 3]);            // [1, 2, 3]
```

---

## 🔤 String Module (31 functions)

### Case Conversion
- `toUpperCase(str)` - Convert to uppercase
- `toLowerCase(str)` - Convert to lowercase
- `capitalize(str)` - Capitalize first letter
- `toTitleCase(str)` - Title case

### Searching & Matching
- `includes(str, search)` - Check substring
- `startsWith(str, search)` - Check prefix
- `endsWith(str, search)` - Check suffix
- `indexOf(str, search)` - Find index
- `lastIndexOf(str, search)` - Find last index

### Extraction & Splitting
- `charAt(str, index)` - Get character
- `slice(str, start, end)` - Extract substring
- `substring(str, start, end)` - Extract (non-negative)
- `substr(str, start, length)` - Extract by length
- `split(str, separator)` - Split into array
- `splitAtIndex(str, index)` - Split at position

### Transformation
- `trim(str)` - Remove whitespace
- `trimStart(str)` - Remove leading whitespace
- `trimEnd(str)` - Remove trailing whitespace
- `repeat(str, count)` - Repeat string
- `replace(str, search, replacement)` - Replace first
- `replaceAll(str, search, replacement)` - Replace all
- `reverse(str)` - Reverse characters
- `padStart(str, length, fill)` - Pad left
- `padEnd(str, length, fill)` - Pad right

### Information
- `length(str)` - String length
- `isEmpty(str)` - Check if empty
- `charCodeAt(str, index)` - Get character code
- `fromCharCode(...codes)` - Create from codes

### Examples

```typescript
import { toUpperCase, split, replace } from "std/string";

toUpperCase("hello");        // "HELLO"
split("a-b-c", "-");        // ["a", "b", "c"]
replace("foo foo", "foo", "bar"); // "bar foo"
```

---

## 🗺️ Object Module (24 functions)

### Keys & Values
- `keys(obj)` - Array of keys
- `values(obj)` - Array of values
- `entries(obj)` - Array of [key, value] pairs
- `hasOwnProperty(obj, key)` - Check key

### Creation & Copying
- `create(proto?)` - Create object
- `assign(target, ...sources)` - Copy properties
- `extend(obj, mixin)` - Add mixin methods

### Iteration
- `forEach(obj, fn)` - Iterate with side effects
- `map(obj, fn)` - Transform to new object
- `filter(obj, predicate)` - Keep matching pairs
- `reduce(obj, fn, initial)` - Fold object

### Transformation
- `invert(obj)` - Swap keys and values
- `merge(...objects)` - Deep merge objects
- `pick(obj, keys)` - Select properties
- `omit(obj, keys)` - Exclude properties
- `groupBy(arr, fn)` - Group by key

### Information
- `isEmpty(obj)` - Check if empty
- `size(obj)` - Count properties
- `toString(obj)` - Convert to string

### Examples

```typescript
import { keys, values, assign } from "std/object";

keys({ a: 1, b: 2 });        // ["a", "b"]
values({ a: 1, b: 2 });      // [1, 2]
assign({ x: 1 }, { y: 2 });  // { x: 1, y: 2 }
```

---

## 📅 Date Module (24 functions)

### Current Time
- `now()` - Current timestamp (ms)
- `today()` - Today at midnight
- `current()` - Current date object

### Parsing & Creation
- `parse(str)` - Parse date string
- `from(timestamp)` - Create from timestamp
- `create(year, month, day, ...)` - Create date

### Components
- `year(date)`, `month(date)`, `day(date)` - Get components
- `hour(date)`, `minute(date)`, `second(date)` - Get time
- `dayOfWeek(date)` - Get day name
- `dayOfYear(date)` - Get day number in year

### Formatting
- `format(date, format?)` - Format as string
- `toISOString(date)` - ISO 8601 format
- `toDateString(date)` - Date only

### Manipulation
- `addDays(date, count)` - Add days
- `addHours(date, count)` - Add hours
- `addMinutes(date, count)` - Add minutes
- `startOfDay(date)` - Midnight
- `endOfDay(date)` - 23:59:59

### Comparison
- `isBefore(date1, date2)` - Compare dates
- `isAfter(date1, date2)` - Compare dates
- `isSame(date1, date2)` - Same date

---

## 🔄 Map Module (22 functions)

- `create(entries?)` - Create map
- `set(map, key, value)` - Set entry
- `get(map, key)` - Get value
- `has(map, key)` - Check key
- `delete(map, key)` - Remove entry
- `clear(map)` - Remove all
- `size(map)` - Entry count
- `keys(map)` - Get all keys
- `values(map)` - Get all values
- `entries(map)` - Get all [key, value]
- `forEach(map, fn)` - Iterate
- `map(map, fn)` - Transform values
- `filter(map, predicate)` - Keep matching
- `reduce(map, fn, initial)` - Fold map
- `invert(map)` - Swap keys/values
- `merge(...maps)` - Combine maps

---

## 💬 Promise Module (19 functions)

- `resolve(value)` - Resolved promise
- `reject(reason)` - Rejected promise
- `all(promises)` - All succeed
- `race(promises)` - First completes
- `allSettled(promises)` - All finish
- `any(promises)` - At least one succeeds
- `then(promise, onFulfill, onReject)` - Chain
- `catch(promise, onReject)` - Error handling
- `finally(promise, onFinally)` - Cleanup
- `timeout(ms)` - Delay promise

---

## 🔒 Set Module (17 functions)

- `create(iterable?)` - Create set
- `add(set, item)` - Add item
- `has(set, item)` - Check membership
- `delete(set, item)` - Remove item
- `clear(set)` - Remove all
- `size(set)` - Item count
- `forEach(set, fn)` - Iterate
- `union(set1, set2)` - Combine sets
- `intersection(set1, set2)` - Common items
- `difference(set1, set2)` - Items in set1 not set2
- `isSubset(set1, set2)` - set1 ⊆ set2
- `isSuperset(set1, set2)` - set1 ⊇ set2

---

## 🔐 Encoding Module (17 functions)

### Base64
- `base64Encode(str)` - Encode to base64
- `base64Decode(str)` - Decode from base64

### URL
- `urlEncode(str)` - URL encoding
- `urlDecode(str)` - URL decoding

### Hex
- `hexEncode(str)` - To hex
- `hexDecode(str)` - From hex

### Other
- `utf8Encode(str)` - UTF-8 bytes
- `utf8Decode(bytes)` - From UTF-8

---

## 🔍 Regex Module (16 functions)

- `create(pattern, flags?)` - Create regex
- `test(pattern, str)` - Test match
- `match(str, pattern)` - Find matches
- `matchAll(str, pattern)` - Find all matches
- `replace(str, pattern, replacement)` - Replace
- `replaceAll(str, pattern, replacement)` - Replace all
- `split(str, pattern)` - Split by pattern
- `escape(str)` - Escape special chars
- `flags(regex)` - Get flags
- `source(regex)` - Get pattern

---

## 📄 JSON Module (9 functions)

- `stringify(value)` - Object to JSON string
- `parse(str)` - JSON string to object
- `stringifyPretty(value)` - Formatted JSON
- `stringifyReplacer(value, replacer)` - Custom stringify
- `parseReviver(str, reviver)` - Custom parse

---

## 🖥️ IO Module (7 functions)

- `console.log(...args)` - Print to stdout
- `console.error(...args)` - Print to stderr
- `console.warn(...args)` - Print warning
- `console.info(...args)` - Print info
- `file.read(path)` - Read file
- `file.write(path, content)` - Write file

---

## 📊 Usage Examples

### Complete Example

```typescript
import {
  array, string, math, object, date
} from "std";

// Array operations
const numbers = [3, 1, 4, 1, 5, 9];
const doubled = array.map(numbers, x => x * 2);
const sum = array.reduce(doubled, (a, b) => a + b, 0);

// String operations
const message = "hello world";
const upper = string.toUpperCase(message);
const words = string.split(message, " ");

// Math operations
const sqrt16 = math.sqrt(16);
const random = math.random();

// Object operations
const obj = { name: "Kim", age: 30 };
const keys = object.keys(obj);

// Date operations
const now = date.now();
const formatted = date.format(now, "YYYY-MM-DD");
```

---

## 🎯 Common Patterns

### Chaining Operations

```typescript
array
  .filter([1, 2, 3, 4, 5], x => x > 2)
  .map(arr, x => x * 2)
  .forEach(arr, console.log);
```

### Functional Composition

```typescript
const process = (str) => string
  .toLowerCase(str)
  .split(str, " ")
  .map(words, w => string.capitalize(w))
  .join(words, " ");
```

### Error Handling

```typescript
try {
  const data = json.parse(jsonString);
} catch (error) {
  console.error("JSON parse error:", error);
}
```

---

## 📚 Integration

All modules can be imported and used together:

```typescript
import std from "std";

// Namespaced access
std.array.map([1, 2, 3], x => x * 2);
std.string.toUpperCase("hello");
std.math.sqrt(16);

// Or individual imports
import { map, filter } from "std/array";
import { sqrt, PI } from "std/math";
```

---

## 🔗 Related Documentation

- [Compiler Pipeline](../COMPILER-PIPELINE.md)
- [API Workflow Guide](../getting-started/api-workflow.md)
- [Quick Reference](../QUICK-REFERENCE.md)

---

**Last Updated**: 2026-02-18
**Status**: Production Ready ✅
**Total Functions**: 280+ ✅
