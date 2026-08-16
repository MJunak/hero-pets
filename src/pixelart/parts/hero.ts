import { addOutline, fillCapsule, fillEllipse, fillTriangle, makeGrid } from '../grid';
import { CHAR_H, CHAR_W } from '../rig';
import { HERO_HAIR, HERO_SKIN, HERO_SKIN_SHADE, OUTLINE } from '../palette';
import type { AccentColorId } from '../../types';
import { ACCENT_COLORS, ACCENT_COLORS_SHADE } from '../palette';
import type { PetPartsBundle, RigPart } from './types';
import { staticPart } from './types';

const SKIN = 'k';
const SKIN_SHADE = 'j';
const HAIR = 'r';
const ACCENT = 'a';
const ACCENT_SHADE = 'x';
const OUT = 'o';

export function heroPalette(accent: AccentColorId): Record<string, string> {
  return {
    [SKIN]: HERO_SKIN,
    [SKIN_SHADE]: HERO_SKIN_SHADE,
    [HAIR]: HERO_HAIR,
    [ACCENT]: ACCENT_COLORS[accent],
    [ACCENT_SHADE]: ACCENT_COLORS_SHADE[accent],
    [OUT]: OUTLINE
  };
}

function part(grid: string[][], pivot: { x: number; y: number }): RigPart {
  return { grid, pivot };
}

export function buildHeroParts(): PetPartsBundle {
  const body = makeGrid(CHAR_W, CHAR_H);
  // Beine werden separat animiert; Rumpf, Kopf, Arme, Haare & Maske sind statisch.
  fillCapsule(body, 30, 15, 29, 26, 5, ACCENT);
  fillCapsule(body, 29, 17, 26, 23, 2.3, SKIN);
  fillEllipse(body, 25, 23.5, 1.8, 1.6, SKIN_SHADE);
  fillEllipse(body, 32, 8, 5, 5, SKIN);
  fillTriangle(body, 27.5, 5, 36.5, 5, 32, 0.5, HAIR);
  fillTriangle(body, 27.5, 5, 30, 10, 26, 8, HAIR);
  fillCapsule(body, 34, 6.5, 36, 8, 1.6, SKIN);
  fillCapsule(body, 30, 6.5, 35, 7, 2.2, ACCENT);
  body[7][31] = OUT;
  body[7][34] = OUT;
  fillEllipse(body, 30, 20, 2.6, 2.6, ACCENT_SHADE);
  fillTriangle(body, 30, 17.7, 31.4, 20, 28.6, 20, ACCENT);
  fillTriangle(body, 28.6, 20, 31.4, 20, 30, 22.3, ACCENT);
  addOutline(body, OUT);

  const legFront = buildHeroLeg(31, 26, 34);
  const legBack = buildHeroLeg(27, 26, 34);

  const cape = makeGrid(CHAR_W, CHAR_H);
  fillTriangle(cape, 28, 14, 9, 18, 13, 32, ACCENT);
  fillTriangle(cape, 28, 14, 13, 32, 27, 24, ACCENT);
  fillTriangle(cape, 9, 18, 13, 32, 6, 25, ACCENT_SHADE);
  addOutline(cape, OUT);

  const blank = makeGrid(CHAR_W, CHAR_H);

  return {
    body: staticPart(body),
    head: staticPart(blank),
    mane: staticPart(blank),
    tail: staticPart(blank),
    legFront: part(legFront, { x: 31, y: 26 }),
    legBack: part(legBack, { x: 27, y: 26 }),
    cape: part(cape, { x: 28, y: 14 }),
    bandana: staticPart(blank),
    mask: staticPart(blank),
    symbol: staticPart(blank)
  };
}

function buildHeroLeg(hipX: number, hipY: number, groundY: number): string[][] {
  const grid = makeGrid(CHAR_W, CHAR_H);
  fillCapsule(grid, hipX, hipY, hipX, groundY - 1.5, 2, ACCENT_SHADE);
  fillCapsule(grid, hipX, hipY, hipX, groundY - 3, 1.8, ACCENT);
  fillEllipse(grid, hipX, groundY, 2.4, 1.6, OUT);
  addOutline(grid, OUT);
  return grid;
}
