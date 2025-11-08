# Benchmarking Summary

This document provides an overview of the benchmarking setup for the CollabNest application.

## Tooling

- **Backend HTTP Load Testing:** Artillery is used for scenario-driven load testing of the REST API. Autocannon is used for quick, local spike tests.
- **Backend WebSocket Testing:** Artillery is used to test the WebSocket connection and event handling.
- **Database Benchmarking:** A custom Node.js script (`db-bench.js`) is used to measure the performance of common database queries.
- **Frontend Performance:** Lighthouse CI, driven by Playwright, is used to audit the performance of the key frontend pages.

## Thresholds and Regression Rules

- **Backend API:**
  - 95th percentile latency must be under 500ms for read endpoints and under 800ms for write endpoints at baseline load (10–50 RPS).
  - Error rate must be < 1%.
- **Database Queries:**
  - p95 under 200ms for typical list or lookup queries under nominal load.
  - p99 under 500ms.
- **Frontend (Lighthouse):**
  - LCP < 2.5s
  - FCP < 1s
  - TTFB < 600ms
- **CI Regression:**
  - A CI job will fail if any key metric regresses by more than +10% relative to the stored baseline, or if the error rate increases by >0.5%.

## Running the Benchmarks

To run the benchmarks, use the following commands from the root of the repository:

- `cd server && npm run bench:artillery`
- `cd server && npm run bench:autocannon`
- `cd server && npm run bench:db`
- `cd my-app && npm run bench:lighthouse`

## Updating Baselines

The baseline files in the `benchmarks/baselines` directory are placeholder files. To generate real baselines, you must run the application and all the benchmark suites in a stable environment.

1.  Start the server: `cd server && npm start`
2.  In a separate terminal, start the frontend: `cd my-app && npm run dev`
3.  Run the benchmark suites:
    - `cd server && npm run bench:artillery`
    - `cd server && npm run bench:db`
    - `cd my-app && npm run bench:lighthouse`
4.  Copy the generated reports to the `benchmarks/baselines` directory:
    - `cp server/benchmarks/reports/artillery-baseline.json benchmarks/baselines/`
    - `cp server/benchmarks/reports/artillery-ws.json benchmarks/baselines/`
    - `cp server/benchmarks/reports/db-bench.json benchmarks/baselines/`
    - `cp my-app/benchmarks/lighthouse-reports/*.json benchmarks/baselines/`
5.  Commit the updated baseline files to the repository.
