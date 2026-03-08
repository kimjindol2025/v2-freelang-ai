const fs = require('fs');
const { Lexer } = require('./dist/src/script-runner/lexer');
const { Parser } = require('./dist/src/script-runner/parser');
const { Compiler } = require('./dist/src/script-runner/compiler');
const { VM } = require('./dist/src/script-runner/vm');

const code = fs.readFileSync('./test-higher-order.fl', 'utf8');

console.log('═══════════════════════════════════════════');
console.log('  Higher-Order Functions Test (map/filter/reduce)');
console.log('═══════════════════════════════════════════\n');

try {
  // Step 1: Lex
  const lexer = new Lexer(code);
  const { tokens, errors: lexErrors } = lexer.tokenize();

  if (lexErrors.length > 0) {
    console.error('❌ Lexer errors:', lexErrors);
    process.exit(1);
  }

  console.log('✅ Lexing passed');

  // Step 2: Parse
  const parser = new Parser(tokens);
  const { program, errors } = parser.parse();

  if (errors.length > 0) {
    console.error('❌ Parser errors:', errors);
    process.exit(1);
  }

  console.log('✅ Parsing passed');

  // Step 3: Compile
  const compiler = new Compiler();
  const chunk = compiler.compile(program);

  console.log('✅ Compilation passed\n');

  // Step 4: Run
  const vm = new VM();
  const { output, error } = vm.run(chunk);

  if (error) {
    console.error('❌ Runtime error:', error);
    process.exit(1);
  }

  console.log('--- VM Output ---');
  output.forEach(line => console.log(line));
  console.log('\n✅ Execution completed');

} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.stack) console.error(error.stack);
  process.exit(1);
}
