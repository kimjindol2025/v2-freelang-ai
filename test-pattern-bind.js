const { ScriptRunner } = require('./dist/src/script-runner/index');

const result = ScriptRunner.runFile('./test-pattern-bind.fl');

console.log('Output:');
console.log(result.output.join('\n'));

if (result.error) {
  console.error('\nError:');
  console.error(result.error);
  process.exit(1);
}

console.log('\n✅ Pattern Binding Test Complete!');
