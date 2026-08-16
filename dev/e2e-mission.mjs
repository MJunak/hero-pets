import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:5173/hero-pets/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('[console:error]', msg.text());
});
page.on('pageerror', (err) => console.log('[pageerror]', err.stack ?? err.message));

async function shot(name) {
  await page.screenshot({ path: `/tmp/mission-${name}.png` });
  console.log('shot', name);
}

async function drainDialogue(maxMs = 4000) {
  const step = 200;
  let elapsed = 0;
  while (elapsed < maxMs) {
    const box = page.locator('#dialogue-box');
    if (await box.isVisible()) {
      await page.click('#dialogue-next');
      await page.waitForTimeout(step);
    } else {
      return;
    }
    elapsed += step;
  }
}

// Hält eine Taste, bis der HUD-Text den erwarteten Text enthält (oder ein Timeout erreicht ist),
// und räumt dabei laufend auftauchende Dialoge weg. Robuster als eine feste Wartezeit.
async function holdKeyUntilHud(key, expectedSubstring, maxMs) {
  await page.keyboard.down(key);
  const step = 300;
  let elapsed = 0;
  while (elapsed < maxMs) {
    await page.waitForTimeout(step);
    elapsed += step;
    const box = page.locator('#dialogue-box');
    if (await box.isVisible()) {
      await page.click('#dialogue-next');
    }
    const hud = await page.evaluate(() => document.getElementById('hud-mission')?.textContent ?? '');
    if (hud.includes(expectedSubstring)) break;
  }
  await page.keyboard.up(key);
  await drainDialogue();
}

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('#btn-new-game');
await page.click('[data-role="hero"]');
await page.click('[data-animal="horse"]');
await page.waitForTimeout(200);
await page.fill('#pet-name-input', 'Donnerhuf');
await page.click('#btn-start-game');
await page.waitForTimeout(600);

await drainDialogue();
await shot('01-intro-dismissed');

await holdKeyUntilHud('ArrowRight', 'Nutzt eure Kraft', 20000);
await shot('02-at-obstacle');

const hudText = await page.evaluate(() => document.getElementById('hud-mission')?.textContent);
console.log('hud after approach:', hudText);

await page.keyboard.press('Space');
await page.waitForTimeout(1600);
await shot('03-ability-used');
await drainDialogue();
await shot('04-obstacle-cleared');

await holdKeyUntilHud('ArrowRight', 'Mission erfüllt', 20000);
await shot('05-near-kitten');

await page.waitForTimeout(500);
const rewardVisible = await page.locator('#reward-overlay').isVisible();
console.log('reward overlay visible:', rewardVisible);
await shot('06-reward');
if (rewardVisible) {
  await page.click('#btn-reward-continue');
}
await page.waitForTimeout(300);
await shot('06b-badge-visible-same-session');

const stageAfterMission = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')).mission.stage);
console.log('mission stage after completion:', stageAfterMission);
const unlocked = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')).unlockedAccessories);
console.log('unlocked accessories:', unlocked);

await page.reload({ waitUntil: 'networkidle' });
await shot('07-after-reload-start-screen');
const continueVisible = await page.locator('#btn-continue').isVisible();
console.log('continue button visible after reload:', continueVisible);
await page.click('#btn-continue');
await page.waitForTimeout(1200);
await shot('08-continued-game');
const stageAfterReload = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')).mission.stage);
console.log('mission stage after reload/continue:', stageAfterReload);
const hudAfterReload = await page.evaluate(() => document.getElementById('hud-mission')?.textContent);
console.log('hud after reload:', hudAfterReload);

await browser.close();
console.log('done');
