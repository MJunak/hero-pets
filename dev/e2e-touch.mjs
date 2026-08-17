import { chromium, devices } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:5173/hero-pets/';
const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['iPad (gen 7)'],
  hasTouch: true
});
const page = await context.newPage();
page.on('pageerror', (err) => console.log('[pageerror]', err.stack ?? err.message));

async function shot(name) {
  await page.screenshot({ path: `/tmp/touch-${name}.png` });
  console.log('shot', name);
}

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('#btn-new-game');
await page.click('[data-role="pet"]');
await page.click('[data-animal="horse"]');
await page.waitForTimeout(200);
await page.fill('#pet-name-input', 'Blitz');
await page.click('#btn-start-game');
await page.waitForTimeout(1500);

const bodyClass = await page.evaluate(() => document.body.className);
console.log('body class (should NOT contain no-touch):', bodyClass);

for (let i = 0; i < 6; i++) {
  const box = page.locator('#dialogue-box');
  if (await box.isHidden()) break;
  await page.click('#dialogue-next');
  await page.waitForTimeout(200);
}

await shot('01-game-with-touch-controls');

// drag the virtual joystick to the right
const joystick = await page.$('#touch-joystick');
const box = await joystick.boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2;

await page.touchscreen.tap(cx, cy);
const xBefore = await page.evaluate(() => window.scrollX);
void xBefore;

// Use pointer/touch events directly on the joystick element via dispatch
await page.evaluate(({ cx, cy }) => {
  const el = document.getElementById('touch-joystick');
  const target = document.getElementById('touch-joystick');
  const makeEvent = (type, x, y) =>
    new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, bubbles: true, cancelable: true });
  target.dispatchEvent(makeEvent('pointerdown', cx, cy));
  target.dispatchEvent(makeEvent('pointermove', cx + 40, cy));
  void el;
}, { cx, cy });

await page.waitForTimeout(1500);
await shot('02-after-joystick-drag');

const posAfterDrag = await page.evaluate(() => window.__hpDebug?.());
console.log('position after joystick drag (should have moved right from spawn x=140):', posAfterDrag);

// release joystick so movement stops before testing the jump button in isolation
await page.evaluate(({ cx, cy }) => {
  const target = document.getElementById('touch-joystick');
  target.dispatchEvent(new PointerEvent('pointerup', { clientX: cx, clientY: cy, pointerId: 1, bubbles: true, cancelable: true }));
}, { cx, cy });
await page.waitForTimeout(300);

// tap the jump button and sample position shortly after to confirm airborne motion
await page.evaluate(() => {
  const btn = document.getElementById('touch-jump-btn');
  btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 3 }));
});
await page.waitForTimeout(150);
const posMidJump = await page.evaluate(() => window.__hpDebug?.());
console.log('position ~150ms after tapping jump button (grounded should be false, jumpH > 0):', posMidJump);
await shot('03-after-jump-tap');

// tap the skill button
await page.evaluate(() => {
  const btn = document.getElementById('touch-skill-btn');
  btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 2 }));
});
await page.waitForTimeout(800);
await shot('04-after-skill-tap');

await browser.close();
console.log('done');
