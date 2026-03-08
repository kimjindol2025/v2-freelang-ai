const fs = require('fs');
const { Lexer } = require('./dist/src/script-runner/lexer');
const { Parser } = require('./dist/src/script-runner/parser');
const { Compiler } = require('./dist/src/script-runner/compiler');
const { VM } = require('./dist/src/script-runner/vm');

const code = fs.readFileSync('./self-hosting/lexer.fl', 'utf8');

console.log('═══════════════════════════════════════════');
console.log('  Testing: Bootstrap Lexer (lexer.fl)');
console.log('═══════════════════════════════════════════\n');

try {
  console.log('Step 1: Lexing...');
  const lexer = new Lexer(code);
  const { tokens, errors: lexErrors } = lexer.tokenize();
  if (lexErrors.length > 0) {
    console.error('❌ Lexer errors:', lexErrors.length);
    lexErrors.slice(0, 5).forEach(e => console.error('  -', e));
    process.exit(1);
  }
  console.log('✅ Lexing successful\n');

  console.log('Step 2: Parsing...');
  const parser = new Parser(tokens);
  const { program, errors } = parser.parse();
  if (errors.length > 0) {
    console.error('❌ Parser errors:', errors.length);
    errors.slice(0, 5).forEach(e => console.error('  -', e));
    process.exit(1);
  }
  console.log('✅ Parsing successful\n');

  console.log('Step 3: Compiling...');
  const compiler = new Compiler();
  const chunk = compiler.compile(program);
  console.log('✅ Compilation successful\n');

  console.log('Step 4: Running...');
  const vm = new VM();
  const { output, error } = vm.run(chunk);

  if (error) {
    console.error('❌ Runtime error:', error);
    process.exit(1);
  }

  console.log('✅ Execution successful\n');
  console.log('--- Output ---');
  output.forEach(line => console.log(line));

  console.log('\n✅ Bootstrap Lexer validation PASSED!');

} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.stack) console.error(error.stack.split('\n').slice(0, 10).join('\n'));
  process.exit(1);
}
