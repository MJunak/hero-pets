import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:5173/hero-pets/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('[console:error]', msg.text());
});
page.on('pageerror', (err) => console.log('[pageerror]', err.stack ?? err.message));

async function shot(name) {
  await page.screenshot({ path: `/tmp/jump-${name}.png` });
  console.log('shot', name);
}

async function debug() {
  return page.evaluate(() => window.__hpDebug?.());
}

async function drainDialogue(maxMs = 5000) {
  const box = page.locator('#dialogue-box');
  const deadline = Date.now() + maxMs;
  let sawIt = false;
  while (Date.now() < deadline) {
    if (await box.isVisible()) {
      sawIt = true;
      await page.click('#dialogue-next');
      await page.waitForTimeout(150);
    } else if (sawIt) {
      return;
    } else {
      await page.waitForTimeout(100);
    }
  }
}

// Haelt eine Bewegungstaste, druesckt dabei regelmaessig Space (Sprung) und
// raeumt Dialoge weg. Das Test-Chromium hier laeuft deutlich langsamer als
// Echtzeit, daher grosszuegige Dauer und viele Sprungversuche.
async function holdRightAndJump(ms) {
  await page.keyboard.down('ArrowRight');
  const step = 250;
  let elapsed = 0;
  while (elapsed < ms) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(step);
    elapsed += step;
    const box = page.locator('#dialogue-box');
    if (await box.isVisible()) await page.click('#dialogue-next');
  }
  await page.keyboard.up('ArrowRight');
}

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('#btn-new-game');
await page.click('[data-role="pet"]');
await page.click('[data-animal="horse"]');
await page.waitForTimeout(200);
await page.fill('#pet-name-input', 'Sprungtest');
await page.click('#btn-start-game');
await drainDialogue();

await shot('01-idle');
console.log('spawn:', await debug());

// Richtung erste drei Huerden laufen und dabei ständig springen (Zone 1: x=420/600/780)
await holdRightAndJump(9000);
await shot('02-after-zone1-hurdles');
console.log('after zone1:', await debug());

const state = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')));
console.log('stars collected so far:', state.mission.starsCollected.length);

await browser.close();
console.log('done');
