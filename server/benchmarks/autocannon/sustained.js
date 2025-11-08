const autocannon = require('autocannon');
const chalk = require('chalk');

const target = process.env.HOST || 'http://localhost:5000';
const url = `${target}/api/auth/login`;

const instance = autocannon({
  url,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user1@example.com',
    password: 'password123',
  }),
  connections: 50,
  duration: 120,
  title: 'Sustained Load Test',
}, (err, result) => {
  if (err) {
    console.error(chalk.red('Autocannon error:'), err);
    return;
  }
  console.log(chalk.green('Sustained load test complete. Results:'));
  console.log(result);
});

process.once('SIGINT', () => {
  instance.stop();
});

autocannon.track(instance, { renderProgressBar: true });
