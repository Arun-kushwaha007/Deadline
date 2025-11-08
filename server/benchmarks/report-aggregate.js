const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, 'reports');
const LIGHTHOUSE_REPORTS_DIR = path.join(__dirname, '..', '..', 'my-app', 'lighthouse-reports');
const SUMMARY_FILE = path.join(__dirname, '..', '..', 'benchmarks', 'summary.md');

function aggregateReports() {
  let summary = '# Benchmark Summary\n\n';

  // Artillery
  summary += '## Backend API\n\n';
  summary += '| Scenario | p95 Latency (ms) | Error Rate |\n';
  summary += '|----------|------------------|------------|\n';
  const artilleryBaseline = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'artillery-baseline.json'))).summaries[0];
  summary += `| baseline | ${artilleryBaseline['http.response_time'].p95.toFixed(2)} | ${artilleryBaseline['vusers.errors'].rate * 100}% |\n`;
  const artilleryWs = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'artillery-ws.json'))).summaries[0];
  summary += `| websocket | ${artilleryWs['vusers.session_length'].p95.toFixed(2)} | ${artilleryWs['vusers.errors'].rate * 100}% |\n`;

  // DB
  summary += '\n## Database Queries\n\n';
  summary += '| Query | p95 Latency (ms) | Error Rate |\n';
  summary += '|-------|------------------|------------|\n';
  const dbReport = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'db-bench.json')));
  for (const query in dbReport) {
    summary += `| ${query} | ${dbReport[query].p95_latency_ms.toFixed(2)} | ${dbReport[query].error_rate_percent}% |\n`;
  }

  // Lighthouse
  summary += '\n## Frontend Performance\n\n';
  summary += '| Page | LCP (s) | FCP (s) | TTFB (ms) |\n';
  summary += '|------|---------|---------|-----------|\n';
  const lighthouseFiles = fs.readdirSync(LIGHTHOUSE_REPORTS_DIR).filter(file => file.endsWith('.json'));
  for (const file of lighthouseFiles) {
    const report = JSON.parse(fs.readFileSync(path.join(LIGHTHOUSE_REPORTS_DIR, file)));
    const page = file.replace('lighthouse-', '').replace('.json', '');
    const lcp = report.audits['largest-contentful-paint'].numericValue / 1000;
    const fcp = report.audits['first-contentful-paint'].numericValue / 1000;
    const ttfb = report.audits['server-response-time'].numericValue;
    summary += `| ${page} | ${lcp.toFixed(2)} | ${fcp.toFixed(2)} | ${ttfb.toFixed(2)} |\n`;
  }

  fs.writeFileSync(SUMMARY_FILE, summary);
  console.log(`Benchmark summary written to ${SUMMARY_FILE}`);
}

aggregateReports();
