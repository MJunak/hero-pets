import { composeFlatCanvas, composeHero, composePet, visiblePartsFor } from '../pixelart/compose';
import type { PetAppearance } from '../types';

const FEET_FRACTION = 34 / 40;

const HORSE_APPEARANCE: PetAppearance = {
  furColor: 'chestnut',
  eyeColor: 'brown',
  pattern: 'plain',
  accentColor: 'red',
  accessories: { mask: false, cape: true, bandana: false, symbol: true }
};

const FOX_APPEARANCE: PetAppearance = {
  furColor: 'snow',
  eyeColor: 'blue',
  pattern: 'patched',
  accentColor: 'purple',
  accessories: { mask: true, cape: false, bandana: true, symbol: false }
};

/** Illustriertes Titelbild für den Startbildschirm: Held zwischen Pferd und Polarfuchs. */
export function renderTitleBanner(): void {
  const el = document.getElementById('title-banner');
  if (!el || el.querySelector('canvas')) return;

  const width = 420;
  const height = 168;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#8fd3f4');
  sky.addColorStop(1, '#e8f7ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(70, 34, 26, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(330, 24, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const groundH = 34;
  ctx.fillStyle = '#5fae4f';
  ctx.fillRect(0, height - groundH, width, groundH);
  ctx.fillStyle = '#6fc25e';
  ctx.fillRect(0, height - groundH, width, 6);

  const heroImg = composeFlatCanvas(composeHero('gold'), visiblePartsFor(null));
  const horseImg = composeFlatCanvas(composePet('horse', HORSE_APPEARANCE), visiblePartsFor(HORSE_APPEARANCE));
  const foxImg = composeFlatCanvas(composePet('fox', FOX_APPEARANCE), visiblePartsFor(FOX_APPEARANCE));

  const footY = height - groundH + 18;
  const drawAt = (img: HTMLCanvasElement, cx: number, scale: number, flip: boolean) => {
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.save();
    if (flip) {
      ctx.translate(cx, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, -w / 2, footY - h * FEET_FRACTION, w, h);
    } else {
      ctx.drawImage(img, cx - w / 2, footY - h * FEET_FRACTION, w, h);
    }
    ctx.restore();
  };

  drawAt(horseImg, 90, 0.68, true);
  drawAt(heroImg, 214, 0.74, false);
  drawAt(foxImg, 330, 0.6, false);

  el.appendChild(canvas);
}
