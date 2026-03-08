const { ScriptRunner } = require('./dist/src/script-runner/index');
const result = ScriptRunner.runFile('./test-pattern-bind-v2.fl');
console.log('Output:\n', result.output.join('\n'));
if (result.error) {
  console.error('\nError:\n', result.error);
  process.exit(1);
}
console.log('\n✅ Pattern Binding Test Passed!');
