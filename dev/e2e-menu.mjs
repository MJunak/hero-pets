import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:5173/hero-pets/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', (err) => console.log('[pageerror]', err.stack ?? err.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('[console:error]', msg.text());
});

async function shot(name) {
  await page.screenshot({ path: `/tmp/menu-${name}.png` });
  console.log('shot', name);
}

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('#btn-new-game');
await page.click('[data-role="hero"]');
await page.click('[data-animal="fox"]');
await page.waitForTimeout(200);
await page.fill('#pet-name-input', 'Pausentest');
await page.click('#btn-start-game');
await page.waitForTimeout(1200);

// open pause menu
await page.click('#hud-menu-btn');
await page.waitForTimeout(300);
await shot('01-pause-open');
const pauseVisible = await page.locator('#pause-overlay').isVisible();
console.log('pause overlay visible:', pauseVisible);

// resume
await page.click('#btn-resume');
await page.waitForTimeout(200);
const pauseHiddenAfterResume = await page.locator('#pause-overlay').isHidden();
console.log('pause hidden after resume:', pauseHiddenAfterResume);

// open again and quit to menu
await page.click('#hud-menu-btn');
await page.waitForTimeout(200);
await page.click('#btn-quit-to-menu');
await page.waitForTimeout(400);
await shot('02-back-at-start');
const startVisible = await page.locator('#screen-start').isVisible();
const gameVisible = await page.locator('#screen-game').isVisible();
console.log('start screen visible:', startVisible, '| game screen visible:', gameVisible);
const continueVisible = await page.locator('#btn-continue').isVisible();
console.log('continue visible (progress kept):', continueVisible);

// reset save
page.once('dialog', async (dialog) => {
  console.log('confirm dialog:', dialog.message());
  await dialog.accept();
});
await page.click('#btn-reset');
await page.waitForTimeout(300);
const continueVisibleAfterReset = await page.locator('#btn-continue').isVisible();
console.log('continue visible after reset (should be false):', continueVisibleAfterReset);
const saveAfterReset = await page.evaluate(() => localStorage.getItem('hero-pets:save'));
console.log('save in localStorage after reset (should be null):', saveAfterReset);
await shot('03-after-reset');

await browser.close();
console.log('done');
