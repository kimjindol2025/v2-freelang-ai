# Tutorial 4: Bulk File Processing

## Overview

Learn how to process large batches of files efficiently, including CSV parsing, JSON transformation, and batch operations.

**Time**: 30 minutes
**Difficulty**: Intermediate
**Skills**: File I/O, data parsing, batch processing, progress tracking

---

## Step 1: Project Setup

```bash
mkdir file-processor
cd file-processor
freelang build --init

mkdir -p src/{processors,formatters,utils}
mkdir -p data/{input,output}
```

---

## Step 2: CSV Parser

**`src/processors/csv-parser.free`**

```freelang
fn parseCSV(content) {
  const lines = content.split("\n")
  const headers = lines[0].split(",").map(h => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue

    const values = lines[i].split(",")
    const row = {}

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ? values[j].trim() : ""
    }

    rows.push(row)
  }

  return { headers, rows, count: rows.length }
}

fn parseCSVFile(filePath) {
  try {
    const content = file.read(filePath)
    return parseCSV(content)
  } catch (err) {
    return { error: `Failed to read ${filePath}: ${err.message}` }
  }
}

export { parseCSV, parseCSVFile }
```

---

## Step 3: Data Formatters

**`src/formatters/json-formatter.free`**

```freelang
fn toJSON(data) {
  return json.stringify(data, null, 2)
}

fn toJSONLines(rows) {
  return rows.map(row => json.stringify(row)).join("\n")
}

fn toCSV(headers, rows) {
  const header = headers.join(",")
  const lines = rows.map(row => {
    return headers.map(h => {
      const value = row[h]
      // Escape quotes
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(",")
  })

  return [header, ...lines].join("\n")
}

export { toJSON, toJSONLines, toCSV }
```

---

## Step 4: Batch Processor

**`src/processors/batch-processor.free`**

```freelang
struct ProcessingStats {
  total: number,
  processed: number,
  failed: number,
  startTime: string,
  endTime: string,
  duration: number,
  errors: object[]
}

fn processBatch(files, processFn, options) {
  const stats = {
    total: files.length,
    processed: 0,
    failed: 0,
    startTime: now(),
    duration: 0,
    errors: []
  }

  const verbose = options && options.verbose
  const parallel = options && options.parallel

  for (const file of files) {
    if (verbose) {
      console.log(`Processing: ${file}`)
    }

    try {
      const result = processFn(file)

      if (result.success) {
        stats.processed++
        if (verbose) {
          console.log(`  ✓ Completed`)
        }
      } else {
        stats.failed++
        stats.errors.push({
          file: file,
          error: result.error
        })
        if (verbose) {
          console.error(`  ✗ Failed: ${result.error}`)
        }
      }
    } catch (err) {
      stats.failed++
      stats.errors.push({
        file: file,
        error: err.message
      })
      if (verbose) {
        console.error(`  ✗ Error: ${err.message}`)
      }
    }

    // Progress
    if (verbose) {
      const percent = ((stats.processed + stats.failed) / stats.total * 100).toFixed(1)
      console.log(`Progress: ${percent}%`)
    }
  }

  stats.endTime = now()
  stats.duration = 0  // Could calculate from timestamps

  return stats
}

export { processBatch }
```

---

## Step 5: Example: CSV to JSON Converter

**`src/converters/csv-to-json.free`**

```freelang
import { parseCSVFile } from "../processors/csv-parser.free"
import { toJSON } from "../formatters/json-formatter.free"
import { processBatch } from "../processors/batch-processor.free"

fn convertCSVToJSON(csvFile, jsonFile) {
  try {
    const parsed = parseCSVFile(csvFile)

    if (parsed.error) {
      return { success: false, error: parsed.error }
    }

    const json = toJSON(parsed.rows)
    file.write(jsonFile, json)

    return {
      success: true,
      inputFile: csvFile,
      outputFile: jsonFile,
      rowsConverted: parsed.count
    }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

fn batchConvertCSVToJSON(csvDir, jsonDir) {
  // Get all CSV files
  const csvFiles = listFilesWithExt(csvDir, ".csv")

  const processor = fn(csvFile) {
    const jsonFile = jsonDir + "/" + getFileName(csvFile) + ".json"
    return convertCSVToJSON(csvFile, jsonFile)
  }

  return processBatch(csvFiles, processor, { verbose: true })
}

fn listFilesWithExt(dir, ext) {
  // Simple implementation - use your file system library
  return []
}

fn getFileName(path) {
  const parts = path.split("/")
  const name = parts[parts.length - 1]
  return name.substring(0, name.lastIndexOf("."))
}

export { convertCSVToJSON, batchConvertCSVToJSON }
```

---

## Step 6: Data Cleaning

**`src/processors/data-cleaner.free`**

```freelang
fn trimWhitespace(row) {
  const cleaned = {}
  for (const key of Object.keys(row)) {
    cleaned[key] = typeof row[key] === "string" ? row[key].trim() : row[key]
  }
  return cleaned
}

fn removeEmptyRows(rows) {
  return rows.filter(row => {
    for (const value of Object.values(row)) {
      if (value !== "") return true
    }
    return false
  })
}

fn deduplicateRows(rows, key) {
  const seen = {}
  return rows.filter(row => {
    const id = row[key]
    if (seen[id]) return false
    seen[id] = true
    return true
  })
}

fn normalizeData(rows) {
  return rows
    .map(trimWhitespace)
    .filter(row => removeEmptyRows([row]).length > 0)
}

export { trimWhitespace, removeEmptyRows, deduplicateRows, normalizeData }
```

---

## Step 7: Main Application

**`src/main.free`**

```freelang
import { parseCSVFile } from "./processors/csv-parser.free"
import { toJSON, toCSV } from "./formatters/json-formatter.free"
import { batchConvertCSVToJSON } from "./converters/csv-to-json.free"
import { normalizeData, deduplicateRows } from "./processors/data-cleaner.free"

fn main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === "convert") {
    const csvFile = args[1]
    const jsonFile = args[2] || csvFile.replace(".csv", ".json")

    const parsed = parseCSVFile(csvFile)
    if (parsed.error) {
      console.error(parsed.error)
      return
    }

    const json = toJSON(parsed.rows)
    file.write(jsonFile, json)
    console.log(`✓ Converted ${csvFile} → ${jsonFile}`)
    console.log(`  Rows: ${parsed.count}`)
  }

  else if (command === "clean") {
    const csvFile = args[1]
    const outputFile = args[2] || csvFile.replace(".csv", ".clean.csv")

    const parsed = parseCSVFile(csvFile)
    if (parsed.error) {
      console.error(parsed.error)
      return
    }

    const cleaned = normalizeData(parsed.rows)
    const deduped = deduplicateRows(cleaned, parsed.headers[0])
    const output = toCSV(parsed.headers, deduped)

    file.write(outputFile, output)
    console.log(`✓ Cleaned ${csvFile} → ${outputFile}`)
    console.log(`  Original rows: ${parsed.count}`)
    console.log(`  Cleaned rows: ${deduped.length}`)
  }

  else if (command === "batch") {
    const inputDir = args[1] || "./data/input"
    const outputDir = args[2] || "./data/output"

    const stats = batchConvertCSVToJSON(inputDir, outputDir)
    console.log(`\n=== Batch Processing Complete ===`)
    console.log(`Total files: ${stats.total}`)
    console.log(`Processed: ${stats.processed}`)
    console.log(`Failed: ${stats.failed}`)

    if (stats.errors.length > 0) {
      console.log(`\nErrors:`)
      for (const err of stats.errors) {
        console.error(`  ${err.file}: ${err.error}`)
      }
    }
  }

  else {
    console.log("File Processor - Usage:")
    console.log("")
    console.log("Commands:")
    console.log("  convert <csv> [json]        Convert CSV to JSON")
    console.log("  clean <csv> [output]        Clean and deduplicate CSV")
    console.log("  batch [input] [output]      Batch convert all CSV files")
  }
}

main()
```

---

## Step 8: Example Data

**`data/input/customers.csv`**

```csv
ID,Name,Email,Country,Score
1,Alice Johnson,alice@example.com,USA,95.5
2,Bob Smith,bob@example.com,UK,88.0
3,Charlie Brown,charlie@example.com,USA,92.3
4,Diana Prince,diana@example.com,Canada,91.0
5,Eve Wilson,eve@example.com,USA,87.5
```

---

## Step 9: Usage

```bash
# Build
freelang build

# Convert single CSV to JSON
freelang run src/main.free convert data/input/customers.csv data/output/customers.json

# Clean and deduplicate
freelang run src/main.free clean data/input/customers.csv data/output/customers.clean.csv

# Batch convert all CSVs
freelang run src/main.free batch data/input/ data/output/
```

---

## Step 10: Performance Tips

For large files (>1GB):

```freelang
fn processLargeFile(filePath, processFn) {
  const chunkSize = 1000  // Process 1000 rows at a time
  let processed = 0

  // Stream processing instead of loading entire file
  const stream = file.readStream(filePath)

  stream.on("data", fn(chunk) {
    const rows = parseCSV(chunk)
    rows.forEach(processFn)
    processed += rows.length
    console.log(`Processed: ${processed}`)
  })

  stream.on("end", fn() {
    console.log("✓ Completed")
  })
}
```

---

## Summary

You've built a file processing system with:
- ✅ CSV parsing
- ✅ Format conversion
- ✅ Data cleaning
- ✅ Batch processing
- ✅ Error handling
- ✅ Progress tracking

**Next Steps:**
- Add streaming for large files
- Implement compression
- Add scheduling with cron
- Set up cloud storage integration

