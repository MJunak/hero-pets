import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:5173/hero-pets/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('[console:error]', msg.text());
});
page.on('pageerror', (err) => console.log('[pageerror]', err.stack ?? err.message));

async function shot(name) {
  await page.screenshot({ path: `/tmp/beats-${name}.png` });
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

async function getBeatIndex() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')).mission.beatIndex);
}
async function getStage() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')).mission.stage);
}

// Hält eine Taste für `ms`, räumt dabei laufend auftauchende Dialoge weg.
async function holdKey(key, ms) {
  await page.keyboard.down(key);
  const step = 300;
  let elapsed = 0;
  while (elapsed < ms) {
    await page.waitForTimeout(step);
    elapsed += step;
    const box = page.locator('#dialogue-box');
    if (await box.isVisible()) await page.click('#dialogue-next');
  }
  await page.keyboard.up(key);
  await drainDialogue();
}

async function walkAndClearBeat(label, legMs) {
  const before = await getBeatIndex();
  for (let attempt = 0; attempt < 3; attempt++) {
    await holdKey('ArrowRight', legMs);
    await page.keyboard.press('Space');
    await page.waitForTimeout(1600);
    await drainDialogue();
    const after = await getBeatIndex();
    if (after > before) break;
  }
  await shot(label);
  console.log(label, 'beatIndex now:', await getBeatIndex());
}

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('#btn-new-game');
await page.click('[data-role="pet"]');
await page.click('[data-animal="horse"]');
await page.waitForTimeout(200);
await page.fill('#pet-name-input', 'Sternenlaeufer');
await page.click('#btn-start-game');
await page.waitForTimeout(700);
await drainDialogue();

await walkAndClearBeat('beat1-cleared', 15000);
await walkAndClearBeat('beat2-cleared', 15000);
await walkAndClearBeat('beat3-cleared', 15000);

// Zum Kätzchen laufen
for (let attempt = 0; attempt < 3; attempt++) {
  await holdKey('ArrowRight', 15000);
  if ((await getStage()) === 'completed') break;
}
await shot('near-kitten');
const rewardVisible = await page.locator('#reward-overlay').isVisible();
console.log('reward overlay visible:', rewardVisible);
if (rewardVisible) await page.click('#btn-reward-continue');
await page.waitForTimeout(300);
await shot('after-reward');

const state = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')));
console.log('mission stage:', state.mission.stage);
console.log('beatIndex:', state.mission.beatIndex);
console.log('stars collected:', state.mission.starsCollected.length, state.mission.starsCollected);
console.log('unlocked:', state.unlockedAccessories);

const starHud = await page.evaluate(() => document.getElementById('hud-star-count')?.textContent);
console.log('star HUD:', starHud);

await page.reload({ waitUntil: 'networkidle' });
await page.click('#btn-continue');
await page.waitForTimeout(1200);
await shot('after-reload');
const state2 = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')));
console.log(
  'after reload - stage:',
  state2.mission.stage,
  'beatIndex:',
  state2.mission.beatIndex,
  'stars:',
  state2.mission.starsCollected.length
);
const starHud2 = await page.evaluate(() => document.getElementById('hud-star-count')?.textContent);
console.log('star HUD after reload:', starHud2);

await browser.close();
console.log('done');
