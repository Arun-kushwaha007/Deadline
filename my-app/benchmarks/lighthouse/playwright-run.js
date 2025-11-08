import { chromium } from 'playwright';
import { playAudit } from 'playwright-lighthouse';
import { existsSync, mkdirSync } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The runner must provide this.
// If not provided, fail fast — don't guess and don't hardcode ports.
const SERVED_URL = process.env.SERVED_URL;
if (!SERVED_URL) {
  throw new Error("Missing SERVED_URL. run-lighthouse.sh must export SERVED_URL=<server-url>");
}

const URLS = [
  `${SERVED_URL}/login`,
  `${SERVED_URL}/register`,
  `${SERVED_URL}/`,
  `${SERVED_URL}/tasks`,
];

const REPORT_DIR = join(__dirname, '..', 'lighthouse-reports');

async function runLighthouseAudits() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--remote-debugging-port=9222',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
  });

  const context = await browser.newContext({
  storageState: join(__dirname, 'storageState.json'),
});


  if (!existsSync(REPORT_DIR)) {
    mkdirSync(REPORT_DIR, { recursive: true });
  }

  const port = 9222;

  for (const url of URLS) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    const reportName = `lighthouse${new URL(url).pathname.replace(/\//g, '-')}`;

    await playAudit({
      page,
      port,
      thresholds: {
        performance: 80,
        accessibility: 90,
      },
      reports: {
        formats: { json: true, html: true },
        name: reportName,
        directory: REPORT_DIR,
      },
    });

    console.log(`✅ Generated Lighthouse report for: ${url}`);
    await page.close();
  }

  await browser.close();
}

runLighthouseAudits().catch((err) => {
  console.error('❌ Benchmark failed:', err);
  process.exit(1);
});
