import { chromium } from 'playwright';

const url = process.argv[2];
const outPath = process.argv[3] ?? '/tmp/shot.png';
const width = Number(process.argv[4] ?? 1400);
const height = Number(process.argv[5] ?? 900);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
page.on('console', (msg) => console.log(`[console:${msg.type()}]`, msg.text()));
page.on('pageerror', (err) => console.log('[pageerror]', err.stack ?? err.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log('saved', outPath);
