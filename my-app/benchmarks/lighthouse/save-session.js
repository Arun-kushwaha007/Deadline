import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVED_URL = process.env.SERVED_URL;
if (!SERVED_URL) throw new Error("Missing SERVED_URL");

const EMAIL = process.env.BENCH_EMAIL;
const PASSWORD = process.env.BENCH_PASSWORD;
if (!EMAIL || !PASSWORD) throw new Error("Missing BENCH_EMAIL or BENCH_PASSWORD");

async function saveSession() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🔐 Opening login page…");
  await page.goto(`${SERVED_URL}/login`, { waitUntil: 'networkidle' });

  // Fill inputs using correct selectors
  await page.fill('input[placeholder="Enter your email"]', EMAIL);
  await page.fill('input[placeholder="Enter your password"]', PASSWORD);
  await page.click('button:has-text("Sign In")');
  
  // Correct button selector
//   await page.click('button:has-text("Sign In")');

  // Ensure login succeeded
  try {
    await page.waitForURL(`${SERVED_URL}/`, { timeout: 15000 });
  } catch (err) {
    console.error("❌ Login failed — check BENCH_EMAIL and BENCH_PASSWORD");
    await browser.close();
    process.exit(1);
  }

  // Save session state
  const statePath = path.join(__dirname, 'storageState.json');
  await context.storageState({ path: statePath });

  console.log(`✅ Session saved → ${statePath}`);

  await browser.close();
}

saveSession();
