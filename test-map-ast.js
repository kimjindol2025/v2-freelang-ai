const { Lexer } = require('./dist/src/script-runner/lexer');
const { Parser } = require('./dist/src/script-runner/parser');

const code = `let arr = [1, 2, 3];
arr.map(fn(x) { x * 2 });`;

try {
  const lexer = new Lexer(code);
  const { tokens } = lexer.tokenize();

  const parser = new Parser(tokens);
  const { program } = parser.parse();

  const mapCall = program.stmts[1].expr;
  console.log('Map call structure:');
  console.log(JSON.stringify(mapCall, null, 2));

} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}
