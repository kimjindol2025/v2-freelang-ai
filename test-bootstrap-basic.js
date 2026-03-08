const fs = require('fs');
const { Lexer } = require('./dist/src/script-runner/lexer');
const { Parser } = require('./dist/src/script-runner/parser');
const { Compiler } = require('./dist/src/script-runner/compiler');
const { VM } = require('./dist/src/script-runner/vm');

const code = fs.readFileSync('./self-hosting/test_basic.fl', 'utf8');

console.log('Testing: test_basic.fl\n');

try {
  const lexer = new Lexer(code);
  const { tokens, errors: lexErrors } = lexer.tokenize();
  if (lexErrors.length > 0) throw new Error('Lex errors');

  const parser = new Parser(tokens);
  const { program, errors } = parser.parse();
  if (errors.length > 0) throw new Error('Parse errors');

  const compiler = new Compiler();
  const chunk = compiler.compile(program);

  const vm = new VM();
  const { output, error } = vm.run(chunk);

  if (error) throw new Error(error);

  console.log('Output:');
  output.forEach(line => console.log('  ' + line));
  console.log('\n✅ PASS');

} catch (error) {
  console.error('❌ FAIL:', error.message);
  process.exit(1);
}
