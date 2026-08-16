import { addOutline, fillCapsule, fillEllipse, fillRect, fillTriangle, gridToCanvas, makeGrid } from './grid';
import type { AccentColorId } from '../types';
import { ACCENT_COLORS, ACCENT_COLORS_SHADE, OUTLINE } from './palette';

const O = OUTLINE;

export function treeCanvas(variant: 0 | 1 = 0): HTMLCanvasElement {
  const w = 26;
  const h = 34;
  const grid = makeGrid(w, h);
  const trunk = '#6b4423';
  const trunkShade = '#4f3119';
  const leafBase = variant === 0 ? '#3f8f52' : '#4a9d5e';
  const leafShade = variant === 0 ? '#2c6d3c' : '#357a48';
  const leafLight = variant === 0 ? '#63b876' : '#6fc282';

  fillRect(grid, 11, 22, 4, 11, trunkShade);
  fillRect(grid, 12, 22, 2, 11, trunk);

  fillEllipse(grid, 13, 16, 11, 9, leafShade);
  fillEllipse(grid, 12, 14, 9.5, 8, leafBase);
  fillEllipse(grid, 9, 11, 4.5, 3.6, leafLight);
  fillEllipse(grid, 13, 8, 7, 6, leafBase);
  fillEllipse(grid, 12, 6.5, 4, 3.2, leafLight);

  addOutline(grid, O);
  return gridToCanvas(grid, { [O]: O }, 6);
}

export function bushCanvas(): HTMLCanvasElement {
  const w = 18;
  const h = 11;
  const grid = makeGrid(w, h);
  fillEllipse(grid, 9, 7, 8, 4.2, '#2c6d3c');
  fillEllipse(grid, 6, 5.5, 4.5, 3.4, '#3f8f52');
  fillEllipse(grid, 12, 5.5, 4.5, 3.4, '#3f8f52');
  fillEllipse(grid, 9, 4.5, 3.6, 2.8, '#63b876');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 6);
}

export function cloudCanvas(): HTMLCanvasElement {
  const w = 30;
  const h = 14;
  const grid = makeGrid(w, h);
  fillEllipse(grid, 10, 8, 8, 5, '#ffffff');
  fillEllipse(grid, 18, 7, 9, 6, '#ffffff');
  fillEllipse(grid, 24, 9, 6, 4, '#ffffff');
  fillEllipse(grid, 14, 5, 6, 4, '#ffffff');
  return gridToCanvas(grid, {}, 6);
}

export function rockCanvas(): HTMLCanvasElement {
  const w = 24;
  const h = 20;
  const grid = makeGrid(w, h);
  const base = '#8a8a95';
  const shade = '#65656f';
  const light = '#aab0bb';
  fillTriangle(grid, 2, 18, 12, 3, 22, 18, shade);
  fillTriangle(grid, 4, 18, 12, 5, 12, 18, base);
  fillTriangle(grid, 12, 18, 12, 5, 20, 18, base);
  fillTriangle(grid, 6, 12, 11, 6, 13, 12, light);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}

export function bridgePlankCanvas(): HTMLCanvasElement {
  const w = 10;
  const h = 8;
  const grid = makeGrid(w, h);
  fillRect(grid, 0, 0, w, h, '#a9793f');
  fillRect(grid, 0, 0, w, 1, '#c79358');
  fillRect(grid, 0, h - 1, w, 1, '#7a521f');
  fillRect(grid, w - 1, 0, 1, h, '#7a521f');
  return gridToCanvas(grid, {}, 8);
}

export function groundTileCanvas(): HTMLCanvasElement {
  const w = 16;
  const h = 16;
  const grid = makeGrid(w, h);
  fillRect(grid, 0, 0, w, h, '#5fae4f');
  fillRect(grid, 0, 0, w, 3, '#6fc25e');
  const speckle = '#4f9a41';
  const spots: [number, number][] = [
    [2, 6],
    [9, 4],
    [13, 9],
    [5, 11],
    [11, 13],
    [3, 13]
  ];
  for (const [x, y] of spots) fillRect(grid, x, y, 2, 1, speckle);
  return gridToCanvas(grid, {}, 8);
}

export function pathTileCanvas(): HTMLCanvasElement {
  const w = 16;
  const h = 16;
  const grid = makeGrid(w, h);
  fillRect(grid, 0, 0, w, h, '#d8b878');
  const spots: [number, number][] = [
    [2, 3],
    [11, 6],
    [6, 10],
    [13, 13]
  ];
  for (const [x, y] of spots) fillRect(grid, x, y, 2, 2, '#c6a465');
  return gridToCanvas(grid, {}, 8);
}

export function kittenCanvas(): HTMLCanvasElement {
  const w = 20;
  const h = 20;
  const grid = makeGrid(w, h);
  const fur = '#e8974d';
  const furShade = '#c97a34';
  const furLight = '#f6c48c';
  fillEllipse(grid, 10, 13, 6.5, 5.5, furShade);
  fillEllipse(grid, 10, 12.4, 6, 5, fur);
  fillEllipse(grid, 10, 15, 3.2, 2, furLight);
  fillEllipse(grid, 10, 6, 4.6, 4.4, fur);
  fillTriangle(grid, 6, 4, 9, 4, 6.5, -1 + 1, furShade);
  fillTriangle(grid, 11, 4, 14, 4, 13.5, 0, furShade);
  fillCapsule(grid, 15, 14, 18, 6, 1.6, fur);
  grid[5][8] = O;
  grid[5][11] = O;
  grid[6][8] = O;
  grid[6][11] = O;
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}

export function hqFlagCanvas(accent: AccentColorId): HTMLCanvasElement {
  const w = 18;
  const h = 30;
  const grid = makeGrid(w, h);
  fillRect(grid, 8, 2, 2, 26, '#8a5a2b');
  const accentColor = ACCENT_COLORS[accent];
  const accentShade = ACCENT_COLORS_SHADE[accent];
  fillTriangle(grid, 10, 3, 10, 13, 17, 8, accentColor);
  fillTriangle(grid, 10, 9, 17, 8, 10, 13, accentShade);
  fillEllipse(grid, 9, 2, 2, 2, '#ffd23f');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}

/** Pfoten-Abzeichen, genutzt fürs App-Icon und als UI-Symbol für "Tier". */
export function pawIconCanvas(size = 64): HTMLCanvasElement {
  const grid = makeGrid(28, 28);
  const P = '#ffffff';
  fillEllipse(grid, 14, 17, 8.5, 7, P);
  fillEllipse(grid, 6, 8, 3, 3.4, P);
  fillEllipse(grid, 12, 4.5, 3, 3.6, P);
  fillEllipse(grid, 18, 4.5, 3, 3.6, P);
  fillEllipse(grid, 23, 8.5, 2.8, 3.2, P);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, size / 28);
}

/** Einfache Held-Silhouette (Kopf + Cape), genutzt als UI-Symbol für "Held". */
export function heroIconCanvas(size = 64): HTMLCanvasElement {
  const grid = makeGrid(28, 28);
  const SKIN = '#f2c49b';
  const HAIR = '#3d2b1f';
  const CAPE = '#e63946';
  const CAPE_SHADE = '#a4212c';
  const MASK = '#e63946';
  fillTriangle(grid, 6, 8, 22, 8, 14, 26, CAPE);
  fillTriangle(grid, 6, 8, 14, 26, 4, 22, CAPE_SHADE);
  fillEllipse(grid, 14, 11, 7, 7, SKIN);
  fillTriangle(grid, 7, 7, 21, 7, 14, 0.5, HAIR);
  fillCapsule(grid, 8, 10, 20, 10.5, 2.6, MASK);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, size / 28);
}

/** Funken-Symbol für den Touch-Fähigkeits-Button (statt Emoji, das nicht überall verfügbar ist). */
export function sparkleIconCanvas(size = 48): HTMLCanvasElement {
  const grid = makeGrid(20, 20);
  const W = '#ffffff';
  fillTriangle(grid, 10, 1, 12, 8, 19, 10, W);
  fillTriangle(grid, 10, 1, 19, 10, 8, 12, W);
  fillTriangle(grid, 10, 19, 8, 12, 1, 10, W);
  fillTriangle(grid, 10, 19, 1, 10, 12, 8, W);
  return gridToCanvas(grid, {}, size / 20);
}

export function particleDotCanvas(): HTMLCanvasElement {
  const grid = makeGrid(4, 4);
  fillRect(grid, 0, 0, 4, 4, '#ffffff');
  return gridToCanvas(grid, {}, 4);
}

export function signCanvas(): HTMLCanvasElement {
  const w = 16;
  const h = 20;
  const grid = makeGrid(w, h);
  fillRect(grid, 7, 8, 2, 12, '#8a5a2b');
  fillRect(grid, 1, 1, 14, 9, '#e8c68a');
  fillRect(grid, 1, 1, 14, 2, '#f4dba8');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}
