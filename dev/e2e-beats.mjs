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

async function getBeatIndex() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')).mission.beatIndex);
}
async function getStage() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('hero-pets:save')).mission.stage);
}

/**
 * Haelt "nach rechts" (mit periodischen Space-Druecken fuer Huerden) bis sich
 * die Spielerposition ueber `stillMs` nicht mehr veraendert (= an einer Wand
 * angekommen) oder `maxMs` erreicht ist. Deutlich robuster als eine feste
 * Wartezeit, weil dieses Test-Chromium unterschiedlich schnell laeuft.
 */
async function runRightUntilStuck(maxMs = 40000, stillMs = 900) {
  await page.keyboard.down('ArrowRight');
  const step = 200;
  let elapsed = 0;
  let lastX = null;
  let stillFor = 0;
  while (elapsed < maxMs) {
    if (await page.locator('#reward-overlay').isVisible()) break;
    await page.keyboard.press('Space');
    await page.waitForTimeout(step);
    elapsed += step;
    const box = page.locator('#dialogue-box');
    if (await box.isVisible()) {
      await page.click('#dialogue-next').catch(() => {});
      stillFor = 0;
      continue;
    }
    const d = await debug();
    if (d && lastX !== null && Math.abs(d.x - lastX) < 0.5) {
      stillFor += step;
      if (stillFor >= stillMs) break;
    } else {
      stillFor = 0;
    }
    lastX = d?.x ?? lastX;
  }
  await page.keyboard.up('ArrowRight');
  await drainDialogue();
}

async function clearCurrentBeat(label) {
  const before = await getBeatIndex();
  for (let attempt = 0; attempt < 4 && (await getBeatIndex()) === before; attempt++) {
    await runRightUntilStuck();
    await page.keyboard.press('Shift');
    await page.waitForTimeout(1500);
    await drainDialogue();
  }
  await shot(label);
  console.log(label, 'beatIndex now:', await getBeatIndex(), 'pos:', await debug());
}

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('#btn-new-game');
await page.click('[data-role="pet"]');
await page.click('[data-animal="horse"]');
await page.waitForTimeout(200);
await page.fill('#pet-name-input', 'Sternenlaeufer');
await page.click('#btn-start-game');
await drainDialogue();

await clearCurrentBeat('beat1-cleared');
await clearCurrentBeat('beat2-cleared');
await clearCurrentBeat('beat3-cleared');

// Zum Kätzchen laufen
for (let attempt = 0; attempt < 4 && (await getStage()) !== 'completed'; attempt++) {
  await runRightUntilStuck();
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
