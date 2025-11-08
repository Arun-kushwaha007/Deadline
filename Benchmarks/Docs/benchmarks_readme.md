Critical: Our CI is blind to performance regressions; I need to implement the sample GitHub Actions workflow below to automatically catch latency spikes and error rate increases.

# Benchmarking CollabNest

Hello! This is the guide I've put together for running and maintaining our performance benchmarks. My goal is to make this process straightforward and repeatable so we can keep a close eye on performance over time.

## How to Reproduce Benchmarks Locally

Before running these, make sure you've installed dependencies for both the `server` and `my-app` directories (`npm install`). You'll also need to have Artillery and Autocannon installed globally (`npm install -g artillery autocannon`). The application servers should be running.

### 1. Backend API Load Test (Artillery)

This test measures the performance of our main REST API endpoints under sustained load.

```bash
# From the repository root
artillery run -e production server/benchmarks/artillery-baseline.yml -o server/benchmarks/reports/artillery-baseline.json
```

### 2. WebSocket Load Test (Artillery)

This test checks the stability of our WebSocket connections.

```bash
# From the repository root
artillery run -e production server/benchmarks/artillery-ws.yml -o server/benchmarks/reports/artillery-ws.json
```

### 3. Database Microbenchmark

This script directly measures the performance of our MongoDB instance.

```bash
# From the server/ directory
npm run bench:db
```

### 4. Frontend Lighthouse Audits (Playwright)

This runs Lighthouse audits on key pages to check for performance and accessibility issues.

```bash
# From the my-app/ directory
npm run bench:lighthouse
```

## How to Save and Commit Baselines

When we have a set of results that we consider a "good" baseline (e.g., after a major optimization or before a new feature release), we should save them to track regressions.

1.  **Run the Benchmark:** Execute the desired benchmark command as shown above (e.g., the Artillery REST API test).
2.  **Copy the Report:** Take the generated JSON report and copy it into the appropriate baseline directory. For example, for the REST API test:

    ```bash
    # From the repository root
    cp server/benchmarks/reports/artillery-baseline.json server/benchmarks/baselines/artillery-rest-baseline-YYYY-MM-DD.json
    ```
3.  **Commit the Baseline:** Commit the new baseline file to the repository with a descriptive message.

    ```bash
    git add server/benchmarks/baselines/artillery-rest-baseline-YYYY-MM-DD.json
    git commit -m "feat(bench): save new REST API baseline for Q4 2025"
    ```

## Sample GitHub Actions Workflow for CI

Here is a workflow snippet that I designed to run on every pull request. It runs the Artillery REST and Lighthouse tests, compares the results against a committed baseline, and fails the build if a performance regression is detected.

```yaml
name: 'Performance Regression Check'

on:
  pull_request:
    paths:
      - 'server/**'
      - 'my-app/**'

jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout code'
        uses: actions/checkout@v3

      - name: 'Setup Node.js'
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: 'Install server dependencies'
        run: npm install
        working-directory: ./server

      - name: 'Install frontend dependencies'
        run: npm install
        working-directory: ./my-app

      - name: 'Start application'
        run: |
          npm start > server.log &
          npm start -- --port 3001 > my-app.log &
        working-directory: ./server # Assuming server can start the app

      - name: 'Wait for servers to be ready'
        run: sleep 10 # Adjust as needed

      - name: 'Run Artillery REST API test'
        run: npx artillery run server/benchmarks/artillery-baseline.yml -o server/benchmarks/reports/artillery-pr-check.json

      - name: 'Run Lighthouse test'
        run: npm run bench:lighthouse
        working-directory: ./my-app

      - name: 'Compare results against baseline'
        run: |
          # A simple Node.js script to compare the new report with the baseline
          node << 'EOF'
          const fs = require('fs');
          const baseline = JSON.parse(fs.readFileSync('server/benchmarks/baselines/artillery-rest-baseline.json', 'utf8'));
          const current = JSON.parse(fs.readFileSync('server/benchmarks/reports/artillery-pr-check.json', 'utf8'));

          const baselineP95 = baseline.aggregate.summaries['http.response_time'].p95;
          const currentP95 = current.aggregate.summaries['http.response_time'].p95;
          
          const baselineErrors = baseline.aggregate.summaries['http.errors'] || 0;
          const currentErrors = current.aggregate.summaries['http.errors'] || 0;
          const errorRateIncrease = (currentErrors / current.aggregate.summaries['http.requests']) * 100 - (baselineErrors / baseline.aggregate.summaries['http.requests']) * 100;

          console.log(`Baseline p95: ${baselineP95}ms, Current p95: ${currentP95}ms`);
          console.log(`Error rate increase: ${errorRateIncrease.toFixed(2)}%`);

          if (currentP95 > baselineP95 * 1.10) {
            console.error('Error: p95 latency increased by more than 10%!');
            process.exit(1);
          }

          if (errorRateIncrease > 0.5) {
            console.error('Error: Error rate increased by more than 0.5%!');
            process.exit(1);
          }
          EOF'
```

## Report Locations

All generated reports from the benchmark runs are saved in the following directories:

*   **Artillery Reports:** `server/benchmarks/reports/`
*   **Lighthouse Reports:** `my-app/benchmarks/lighthouse-reports/`
*   **Database Benchmarks:** `server/benchmarks/reports/`

This documentation, along with other generated analysis, lives in `benchmarks/docs/`.
