const { Lexer } = require('./dist/src/script-runner/lexer');
const { Parser } = require('./dist/src/script-runner/parser');
const { Compiler } = require('./dist/src/script-runner/compiler');

const code = `let arr = [1, 2, 3];
let double = fn(x) { x * 2 };
println(double);
println(arr);`;

try {
  const lexer = new Lexer(code);
  const { tokens } = lexer.tokenize();

  const parser = new Parser(tokens);
  const { program } = parser.parse();

  const compiler = new Compiler();
  const chunk = compiler.compile(program);

  console.log('AST:');
  console.log(JSON.stringify(program.stmts, null, 2));

} catch (error) {
  console.error('Error:', error.message);
}
