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

/** Nach-oben-Pfeil für den Touch-Sprung-Button (statt Emoji, das nicht überall verfügbar ist). */
export function jumpIconCanvas(size = 48): HTMLCanvasElement {
  const grid = makeGrid(20, 20);
  const W = '#ffffff';
  fillTriangle(grid, 10, 1, 2, 11, 18, 11, W);
  fillRect(grid, 7, 10, 6, 9, W);
  return gridToCanvas(grid, {}, size / 20);
}

export function particleDotCanvas(): HTMLCanvasElement {
  const grid = makeGrid(4, 4);
  fillRect(grid, 0, 0, 4, 4, '#ffffff');
  return gridToCanvas(grid, {}, 4);
}

export function pineTreeCanvas(): HTMLCanvasElement {
  const w = 22;
  const h = 36;
  const grid = makeGrid(w, h);
  const trunk = '#6b4423';
  const trunkShade = '#4f3119';
  const leafBase = '#2f6b45';
  const leafShade = '#20512f';
  const leafLight = '#458a5c';
  fillRect(grid, 9, 28, 4, 8, trunkShade);
  fillRect(grid, 10, 28, 2, 8, trunk);
  fillTriangle(grid, 11, 2, 2, 18, 20, 18, leafShade);
  fillTriangle(grid, 11, 4, 4, 17, 18, 17, leafBase);
  fillTriangle(grid, 11, 10, 3, 24, 19, 24, leafShade);
  fillTriangle(grid, 11, 12, 5, 23, 17, 23, leafBase);
  fillTriangle(grid, 11, 2, 9, 9, 13, 9, leafLight);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 6);
}

/** Umgestürzter Baumstamm – zweites Missionshindernis. */
export function logCanvas(): HTMLCanvasElement {
  const w = 38;
  const h = 18;
  const grid = makeGrid(w, h);
  const bark = '#7a5230';
  const barkShade = '#5a3a20';
  const ringOuter = '#c99a63';
  const ringInner = '#e8c48f';
  const moss = '#5fae4f';
  fillCapsule(grid, 6, 10, 32, 10, 7, barkShade);
  fillCapsule(grid, 6, 9, 32, 9, 6.2, bark);
  fillEllipse(grid, 33, 9, 4.2, 6.2, ringOuter);
  fillEllipse(grid, 33, 9, 2.6, 4, ringInner);
  fillEllipse(grid, 33, 9, 1.1, 2, ringOuter);
  fillEllipse(grid, 14, 4.5, 5, 2.4, moss);
  fillEllipse(grid, 22, 4, 3.6, 2, moss);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}

/** Dorniges Gestrüpp – drittes Missionshindernis. */
export function thicketCanvas(): HTMLCanvasElement {
  const w = 34;
  const h = 26;
  const grid = makeGrid(w, h);
  const vineDark = '#2f5e2a';
  const vineBase = '#3f7a38';
  const vineLight = '#5a9950';
  const thorn = '#22381f';
  const berry = '#c23b4e';
  fillEllipse(grid, 8, 16, 7, 9, vineDark);
  fillEllipse(grid, 17, 14, 8, 12, vineBase);
  fillEllipse(grid, 26, 17, 7, 8.5, vineDark);
  fillEllipse(grid, 12, 9, 6, 6, vineLight);
  fillEllipse(grid, 22, 8, 5.6, 5.6, vineLight);
  fillTriangle(grid, 4, 12, 6, 7, 8, 13, thorn);
  fillTriangle(grid, 28, 11, 31, 7, 30, 13, thorn);
  fillTriangle(grid, 16, 3, 20, 4, 18, 8, thorn);
  fillEllipse(grid, 10, 11, 1.4, 1.4, berry);
  fillEllipse(grid, 24, 12, 1.4, 1.4, berry);
  fillEllipse(grid, 18, 15, 1.4, 1.4, berry);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}

/** Kleiner Teich als Dekoration (nicht blockierend). */
export function pondCanvas(): HTMLCanvasElement {
  const w = 46;
  const h = 22;
  const grid = makeGrid(w, h);
  const waterDeep = '#2f7ea8';
  const water = '#4a9fc9';
  const shine = '#bfe6f5';
  const reed = '#3f8f52';
  fillEllipse(grid, 23, 12, 21, 8.5, waterDeep);
  fillEllipse(grid, 23, 11, 19, 7.2, water);
  fillEllipse(grid, 16, 8, 4, 1.6, shine);
  fillEllipse(grid, 30, 14, 3, 1.2, shine);
  fillCapsule(grid, 4, 20, 2, 5, 1, reed);
  fillCapsule(grid, 8, 21, 6, 7, 1, reed);
  fillCapsule(grid, 41, 20, 39, 5, 1, reed);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 6);
}

/** Kleiner Blumenbüschel für Wiesen-Deko. */
export function flowerCanvas(hue: 'red' | 'yellow' | 'purple' = 'red'): HTMLCanvasElement {
  const colors: Record<string, string> = { red: '#e8536b', yellow: '#ffd23f', purple: '#b07cd6' };
  const c = colors[hue];
  const w = 14;
  const h = 16;
  const grid = makeGrid(w, h);
  fillCapsule(grid, 4, 15, 4, 8, 0.8, '#3f8f52');
  fillCapsule(grid, 10, 15, 10, 9, 0.8, '#3f8f52');
  fillCapsule(grid, 7, 15, 7, 6, 0.9, '#3f8f52');
  fillEllipse(grid, 4, 7, 1.8, 1.8, c);
  fillEllipse(grid, 10, 8, 1.8, 1.8, c);
  fillEllipse(grid, 7, 4.5, 2.2, 2.2, c);
  fillEllipse(grid, 7, 4.5, 0.8, 0.8, '#ffd23f');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}

/** Kleiner, runder Deko-Fels (nicht das Missionshindernis). */
export function rockDecorCanvas(): HTMLCanvasElement {
  const w = 20;
  const h = 12;
  const grid = makeGrid(w, h);
  fillEllipse(grid, 10, 8, 9, 5, '#8a8a95');
  fillEllipse(grid, 7, 6, 4, 3, '#aab0bb');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 7);
}

/** Sammelbarer Stern. */
export function starCollectibleCanvas(): HTMLCanvasElement {
  const grid = makeGrid(16, 16);
  const gold = '#ffd23f';
  const light = '#fff3c4';
  fillTriangle(grid, 8, 0, 9.6, 6.4, 16, 8, gold);
  fillTriangle(grid, 8, 0, 16, 8, 6.4, 9.6, gold);
  fillTriangle(grid, 8, 16, 6.4, 9.6, 0, 8, gold);
  fillTriangle(grid, 8, 16, 0, 8, 9.6, 6.4, gold);
  fillEllipse(grid, 8, 8, 1.6, 1.6, light);
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 8);
}

/** Niedriges Sprung-Hindernis: kleiner Steinhaufen (~55px hoch in der Welt). */
export function hurdleRockCanvas(): HTMLCanvasElement {
  const w = 16;
  const h = 10;
  const grid = makeGrid(w, h);
  fillEllipse(grid, 8, 8, 7, 4, '#8a8a95');
  fillEllipse(grid, 5, 5, 4, 3.2, '#9a9aa5');
  fillEllipse(grid, 11, 4.5, 3.6, 3, '#aab0bb');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 6);
}

/** Mittleres Sprung-Hindernis: Baumstumpf (~70px hoch in der Welt). */
export function hurdleStumpCanvas(): HTMLCanvasElement {
  const w = 12;
  const h = 12;
  const grid = makeGrid(w, h);
  fillCapsule(grid, 6, 11, 6, 4, 5, '#7a5230');
  fillEllipse(grid, 6, 2.2, 5, 2.6, '#c99a63');
  fillEllipse(grid, 6, 2.2, 3, 1.5, '#e8c48f');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 6);
}

/** Hohes Sprung-Hindernis: zwei gestapelte Holzkisten (~88px hoch in der Welt). */
export function hurdleCrateCanvas(): HTMLCanvasElement {
  const w = 15;
  const h = 15;
  const grid = makeGrid(w, h);
  fillRect(grid, 1, 8, 13, 6, '#a9793f');
  fillRect(grid, 1, 8, 13, 1, '#c79358');
  fillRect(grid, 2, 8, 1, 6, '#7a521f');
  fillRect(grid, 12, 8, 1, 6, '#7a521f');
  fillRect(grid, 2, 1, 11, 7, '#c79358');
  fillRect(grid, 2, 1, 11, 1, '#e8b878');
  fillRect(grid, 3, 1, 1, 7, '#8a5a2b');
  fillRect(grid, 11, 1, 1, 7, '#8a5a2b');
  addOutline(grid, O);
  return gridToCanvas(grid, {}, 6);
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
