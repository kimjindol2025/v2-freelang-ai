const { ScriptRunner } = require('./dist/src/script-runner/index');
const result = ScriptRunner.runFile('./test-match-simple.fl');
console.log('Output:', result.output.join('\n'));
if (result.error) console.error('Error:', result.error);
