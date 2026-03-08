const { ScriptRunner } = require('./dist/src/script-runner/index');

// Create a simple test that avoids checker issues
const code = `let x = Ok(5);
match x {
  Ok(v) => println("matched"),
  Err(e) => println("error"),
}`;

const result = ScriptRunner.runCode(code);

console.log('Output:', result.output.join('\n'));
if (result.error) {
  console.error('Error:', result.error);
  process.exit(1);
}
console.log('✅ Test passed');
