const { Lexer } = require('./dist/src/script-runner/lexer');
const { Parser } = require('./dist/src/script-runner/parser');
const { Compiler } = require('./dist/src/script-runner/compiler');
const { VM } = require('./dist/src/script-runner/vm');

const code = `let arr = [1, 2];
let double = fn(x) { x * 2 };
let result = arr.map(double);
println(result);`;

console.log('Testing map with simple closure...\n');

try {
  const lexer = new Lexer(code);
  const { tokens } = lexer.tokenize();

  const parser = new Parser(tokens);
  const { program } = parser.parse();

  // Show the fn_lit structure
  const doubleDef = program.stmts[1];
  console.log('fn_lit structure:');
  console.log(JSON.stringify(doubleDef.init, null, 2));
  console.log('\n');

  const compiler = new Compiler();
  const chunk = compiler.compile(program);

  const vm = new VM();
  const { output, error } = vm.run(chunk);

  if (error) {
    console.error('Runtime error:', error);
  } else {
    console.log('Output:', output);
  }

} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}
