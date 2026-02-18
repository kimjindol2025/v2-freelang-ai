# Tutorial 2: Building a CLI Tool

## Overview

Create a command-line tool for file processing and data analysis.

**Time**: 25 minutes
**Difficulty**: Beginner-Intermediate
**Skills**: CLI parsing, file I/O, data processing

---

## Step 1: Project Setup

```bash
mkdir my-cli-tool
cd my-cli-tool
freelang build --init

mkdir -p src/{commands,utils}
```

---

## Step 2: Create Utilities

**`src/utils/args-parser.free`**

```freelang
struct CommandConfig {
  name: string,
  description: string,
  args: string[],
  options: object
}

fn parseArgs(argv) {
  const config = {
    command: argv[0],
    args: [],
    options: {}
  }

  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith("--")) {
      const key = arg.substring(2)
      const value = i + 1 < argv.length ? argv[i + 1] : true
      config.options[key] = value
      if (value !== true) i++
    } else if (arg.startsWith("-")) {
      const key = arg.substring(1)
      config.options[key] = true
    } else {
      config.args.push(arg)
    }
  }

  return config
}
```

**`src/utils/file-utils.free`**

```freelang
fn readFile(path) {
  try {
    return file.read(path)
  } catch (err) {
    return { error: `Cannot read file: ${path}` }
  }
}

fn writeFile(path, content) {
  try {
    file.write(path, content)
    return { success: true }
  } catch (err) {
    return { error: `Cannot write file: ${path}` }
  }
}

fn listFiles(dir) {
  try {
    // Use file system utilities
    const files = fs.readdirSync(dir)
    return { success: true, files: files }
  } catch (err) {
    return { error: `Cannot list directory: ${dir}` }
  }
}
```

---

## Step 3: Create Commands

**`src/commands/count.free`**

```freelang
// Count words, lines, characters in files
fn countCommand(args, options) {
  if (args.length === 0) {
    console.log("Usage: my-cli count <files...>")
    return
  }

  let totalLines = 0
  let totalWords = 0
  let totalChars = 0

  for (const file of args) {
    const content = readFile(file)
    if (content.error) {
      console.error(content.error)
      continue
    }

    const lines = content.split("\n").length
    const words = content.split(/\s+/).length
    const chars = content.length

    totalLines += lines
    totalWords += words
    totalChars += chars

    console.log(`${file}: ${lines} lines, ${words} words, ${chars} chars`)
  }

  console.log("")
  console.log(`Total: ${totalLines} lines, ${totalWords} words, ${totalChars} chars`)
}
```

**`src/commands/transform.free`**

```freelang
// Transform file content (uppercase, lowercase, reverse)
fn transformCommand(args, options) {
  if (args.length === 0) {
    console.log("Usage: my-cli transform <file> --type [upper|lower|reverse]")
    return
  }

  const file = args[0]
  const type = options.type || "upper"
  const output = options.output || `${file}.transformed`

  const content = readFile(file)
  if (content.error) {
    console.error(content.error)
    return
  }

  let transformed = content
  if (type === "upper") {
    transformed = content.toUpperCase()
  } else if (type === "lower") {
    transformed = content.toLowerCase()
  } else if (type === "reverse") {
    transformed = content.split("").reverse().join("")
  }

  const result = writeFile(output, transformed)
  if (result.success) {
    console.log(`Transformed file written to: ${output}`)
  } else {
    console.error(result.error)
  }
}
```

**`src/commands/search.free`**

```freelang
// Search for patterns in files
fn searchCommand(args, options) {
  if (args.length < 2) {
    console.log("Usage: my-cli search <pattern> <files...>")
    return
  }

  const pattern = args[0]
  const files = args.slice(1)
  let matchCount = 0

  for (const file of files) {
    const content = readFile(file)
    if (content.error) {
      console.error(content.error)
      continue
    }

    const lines = content.split("\n")
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(pattern)) {
        matchCount++
        if (options.verbose) {
          console.log(`${file}:${i + 1}: ${lines[i]}`)
        }
      }
    }
  }

  console.log(`Found ${matchCount} matches for "${pattern}"`)
}
```

---

## Step 4: Create Router

**`src/router.free`**

```freelang
fn createRouter() {
  const router = {}

  router.commands = {
    count: countCommand,
    transform: transformCommand,
    search: searchCommand
  }

  router.execute = fn(args, options) {
    const command = args[0]

    if (!router.commands[command]) {
      console.log("Available commands:")
      console.log("  count      - Count lines, words, characters")
      console.log("  transform  - Transform file content")
      console.log("  search     - Search for patterns")
      console.log("")
      console.log(`Use: my-cli <command> --help`)
      return
    }

    const cmdArgs = args.slice(1)
    if (options.help) {
      showHelp(command)
    } else {
      router.commands[command](cmdArgs, options)
    }
  }

  return router
}

fn showHelp(command) {
  const helps = {
    count: "my-cli count <files...> - Count lines, words, chars in files",
    transform: "my-cli transform <file> --type [upper|lower|reverse] - Transform file",
    search: "my-cli search <pattern> <files...> - Search for patterns"
  }
  console.log(helps[command] || "Command not found")
}
```

---

## Step 5: Main Entry Point

**`src/main.free`**

```freelang
import { parseArgs } from "./utils/args-parser.free"
import { readFile, writeFile } from "./utils/file-utils.free"
import { createRouter } from "./router.free"

fn main() {
  // Get command-line arguments (skip executable and script)
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log("my-cli - File Processing Tool")
    console.log("")
    console.log("Usage: my-cli <command> [options]")
    console.log("")
    console.log("Commands:")
    console.log("  count     Count lines, words, chars")
    console.log("  transform Transform file content")
    console.log("  search    Search for patterns")
    console.log("")
    console.log("Options:")
    console.log("  --help    Show help")
    console.log("  --verbose Verbose output")
    return
  }

  const config = parseArgs(args)
  const router = createRouter()

  if (config.options.version) {
    console.log("my-cli v1.0.0")
    return
  }

  router.execute(config.command, config.args, config.options)
}

main()
```

---

## Step 6: Package Configuration

**`freelang.config.json`**

```json
{
  "name": "my-cli-tool",
  "version": "1.0.0",
  "description": "CLI tool for file processing",
  "bin": {
    "my-cli": "dist/main.free"
  },
  "scripts": {
    "build": "freelang build",
    "test": "freelang test"
  },
  "keywords": ["cli", "file", "processing"]
}
```

---

## Step 7: Usage Examples

```bash
# Build
freelang build

# Count words in files
freelang run src/main.free count file1.txt file2.txt

# Transform to uppercase
freelang run src/main.free transform data.txt --type upper --output data.upper.txt

# Search for pattern
freelang run src/main.free search "error" logs/*.txt --verbose

# Get help
freelang run src/main.free --help
```

---

## Step 8: Publish as Command

```bash
# Install globally
npm install -g .

# Now use anywhere
my-cli count file1.txt file2.txt
my-cli search "pattern" directory/*.txt
```

---

## Summary

You've created a professional CLI tool with:
- ✅ Command routing
- ✅ Argument parsing
- ✅ File I/O operations
- ✅ Pattern matching
- ✅ Global installation support
- ✅ Help system

**Next Steps:**
- Add configuration file support
- Implement progress bars
- Add colored output
- Create interactive prompts

