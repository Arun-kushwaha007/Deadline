const fs = require('fs');
const path = require('path');

const BASELINE_DIR = process.env.BASELINE_DIR || path.join(__dirname, '..', '..', 'benchmarks', 'baselines');
const REPORTS_DIR = path.join(__dirname, 'reports');
const LIGHTHOUSE_REPORTS_DIR = path.join(__dirname, '..', '..', 'my-app', 'lighthouse-reports');
const THRESHOLDS = {
  artillery: {
    'http.response_time.p95': { max: 500, tolerance: 0.1 },
    'vusers.errors.rate': { max: 0.01, tolerance: 0.005 },
  },
  db: {
    p95_latency_ms: { max: 200, tolerance: 0.1 },
    error_rate_percent: { max: 1, tolerance: 0.5 },
  },
  lighthouse: {
    'largest-contentful-paint': { max: 2500, tolerance: 0.1 },
    'first-contentful-paint': { max: 1000, tolerance: 0.1 },
    'server-response-time': { max: 600, tolerance: 0.1 },
  },
};

async function main() {
  const { default: chalk } = await import('chalk');
  let regressions = 0;

  // Compare Artillery reports
  regressions += compareArtilleryReports(chalk);

  // Compare DB reports
  regressions += compareDbReports(chalk);

  // Compare Lighthouse reports
  regressions += compareLighthouseReports(chalk);

  if (regressions > 0) {
    console.error(chalk.bold.red(`\n${regressions} performance regression(s) detected.`));
    process.exit(1);
  } else {
    console.log(chalk.bold.green('\nNo performance regressions detected.'));
  }
}

function compareArtilleryReports(chalk) {
  let regressions = 0;
  const baselineFiles = fs.readdirSync(BASELINE_DIR).filter(file => file.startsWith('artillery'));
  for (const file of baselineFiles) {
    const baseline = JSON.parse(fs.readFileSync(path.join(BASELINE_DIR, file))).summaries[0];
    const current = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, file))).summaries[0];
    const report = compare(baseline, current, THRESHOLDS.artillery);
    if (report.isRegression) {
      regressions++;
      console.error(chalk.red(`Regression detected in "${file}":`));
      report.details.forEach(detail => console.error(`  - ${detail}`));
    }
  }
  return regressions;
}

function compareDbReports(chalk) {
  let regressions = 0;
  const baseline = JSON.parse(fs.readFileSync(path.join(BASELINE_DIR, 'db-bench.json')));
  const current = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'db-bench.json')));
  for (const query in baseline) {
    const report = compare(baseline[query], current[query], THRESHOLDS.db);
    if (report.isRegression) {
      regressions++;
      console.error(chalk.red(`Regression detected in "${query}":`));
      report.details.forEach(detail => console.error(`  - ${detail}`));
    }
  }
  return regressions;
}

function compareLighthouseReports(chalk) {
  let regressions = 0;
  const baselineFiles = fs.readdirSync(BASELINE_DIR).filter(file => file.startsWith('lighthouse'));
  for (const file of baselineFiles) {
    const baseline = JSON.parse(fs.readFileSync(path.join(BASELINE_DIR, file))).audits;
    const current = JSON.parse(fs.readFileSync(path.join(LIGHTHOUSE_REPORTS_DIR, file))).audits;
    const report = compare(baseline, current, THRESHOLDS.lighthouse, 'numericValue');
    if (report.isRegression) {
      regressions++;
      console.error(chalk.red(`Regression detected in "${file}":`));
      report.details.forEach(detail => console.error(`  - ${detail}`));
    }
  }
  return regressions;
}

function compare(baseline, current, thresholds, valueKey = null) {
  const details = [];
  let isRegression = false;
  for (const metric in thresholds) {
    const baselineValue = valueKey ? baseline[metric][valueKey] : baseline[metric];
    const currentValue = valueKey ? current[metric][valueKey] : current[metric];
    const threshold = thresholds[metric];
    if (currentValue > baselineValue * (1 + threshold.tolerance)) {
      details.push(`${metric}: ${currentValue.toFixed(2)} > ${baselineValue.toFixed(2)} (tolerance: ${threshold.tolerance * 100}%)`);
      isRegression = true;
    }
    if (currentValue > threshold.max) {
      details.push(`${metric}: ${currentValue.toFixed(2)} > max value of ${threshold.max}`);
      isRegression = true;
    }
  }
  return { isRegression, details };
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { compare };
