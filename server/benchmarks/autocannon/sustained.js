const autocannon = require('autocannon');
const chalk = require('chalk').default;   // ✅ Fix Chalk import

const target = process.env.HOST || 'http://localhost:5000';
const url = `${target}/api/auth/login`;

const instance = autocannon({
  url,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'benchmark@demo.local',       // ✅ Same known working account
    password: 'benchmark123',
  }),
  connections: 50,   // Sustained load
  duration: 120,
  title: 'Sustained Load Test',
}, (err, result) => {
  if (err) {
    console.error(chalk.red('Autocannon error:'), err);
    return;
  }
  console.log(chalk.green('\nSustained load test complete. Results:'));
  console.log(result);
});

process.once('SIGINT', () => instance.stop());

autocannon.track(instance, { renderProgressBar: true });
