import { addOutline, fillCapsule, fillEllipse, makeGrid } from '../grid';
import { CHAR_H, CHAR_W } from '../rig';
import type { Grid } from '../grid';
import type { PetPalette } from './types';

/** Gemeinsame Paletten-Slots, die alle Tier-Rigs verwenden. */
export const F = 'f'; // Fell (Grundton)
export const S = 's'; // Fell (Schatten)
export const L = 'l'; // Fell (Licht)
export const E = 'e'; // Auge
export const O = 'o'; // Umriss
export const A = 'a'; // Akzentfarbe (Mähne/Accessoires)
export const AS = 'x'; // Akzentfarbe Schatten
export const H = 'h'; // Huf / Pfote

export function petPaletteFromSlots(p: PetPalette): Record<string, string> {
  return { [F]: p.fur, [S]: p.furShade, [L]: p.furLight, [E]: p.eye, [O]: p.outline, [A]: p.accent, [AS]: p.accentShade, [H]: p.outline };
}

export function buildLeg(hipX: number, hipY: number, groundY: number): Grid {
  const grid = makeGrid(CHAR_W, CHAR_H);
  fillCapsule(grid, hipX, hipY, hipX, groundY, 2.6, S);
  fillCapsule(grid, hipX, hipY, hipX, groundY - 1, 2.3, F);
  fillEllipse(grid, hipX, groundY, 2.6, 1.6, H);
  // Der obere Rand (Hüftansatz) bekommt bewusst keinen Umriss, damit das Bein
  // optisch nahtlos unter dem Rumpf hervorkommt statt eine Trennlinie zu zeigen.
  addOutline(grid, O, hipY + 3);
  return grid;
}
