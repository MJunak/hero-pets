import { composeFlatCanvas, composePet, visiblePartsFor } from '../pixelart/compose';
import { heroIconCanvas, jumpIconCanvas, pawIconCanvas, sparkleIconCanvas } from '../pixelart/scenery';
import type { PetAppearance } from '../types';

const PREVIEW_APPEARANCE: PetAppearance = {
  furColor: 'chestnut',
  eyeColor: 'brown',
  pattern: 'plain',
  accentColor: 'red',
  accessories: { mask: false, cape: false, bandana: false, symbol: false }
};

const FOX_PREVIEW_APPEARANCE: PetAppearance = { ...PREVIEW_APPEARANCE, furColor: 'snow', accentColor: 'blue' };

function fitInto(source: HTMLCanvasElement, box: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = box;
  canvas.height = box;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  const scale = Math.min(box / source.width, box / source.height) * 0.95;
  const dw = source.width * scale;
  const dh = source.height * scale;
  ctx.drawImage(source, (box - dw) / 2, (box - dh) / 2, dw, dh);
  return canvas;
}

/** Rendert die Pixel-Art-Icons in Rollen-/Tierauswahl (statt Emojis, die nicht überall verfügbar sind). */
export function renderChoiceIcons(): void {
  const icons: Record<string, () => HTMLCanvasElement> = {
    hero: () => heroIconCanvas(64),
    paw: () => pawIconCanvas(64),
    horse: () => fitInto(composeFlatCanvas(composePet('horse', PREVIEW_APPEARANCE), visiblePartsFor(PREVIEW_APPEARANCE)), 64),
    fox: () => fitInto(composeFlatCanvas(composePet('fox', FOX_PREVIEW_APPEARANCE), visiblePartsFor(FOX_PREVIEW_APPEARANCE)), 64)
  };

  document.querySelectorAll<HTMLElement>('[data-icon]').forEach((el) => {
    const kind = el.dataset.icon;
    const build = kind ? icons[kind] : undefined;
    if (!build) return;
    el.innerHTML = '';
    el.appendChild(build());
  });

  const skillBtn = document.getElementById('touch-skill-btn');
  if (skillBtn && !skillBtn.querySelector('canvas')) {
    skillBtn.appendChild(sparkleIconCanvas(44));
  }

  const jumpBtn = document.getElementById('touch-jump-btn');
  if (jumpBtn && !jumpBtn.querySelector('canvas')) {
    jumpBtn.appendChild(jumpIconCanvas(40));
  }
}
