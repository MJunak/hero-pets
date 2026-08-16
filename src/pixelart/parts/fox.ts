import { addOutline, fillCapsule, fillEllipse, fillTriangle, makeGrid } from '../grid';
import { CHAR_H, CHAR_W } from '../rig';
import { A, AS, E, F, L, O, S, buildLeg, petPaletteFromSlots } from './slots';
import type { PetPalette, PetPartsBundle, RigPart } from './types';
import { staticPart } from './types';

export type FoxFurVariant = 'plain' | 'patched';

export function foxPetPalette(p: PetPalette): Record<string, string> {
  return petPaletteFromSlots(p);
}

function part(grid: string[][], pivot: { x: number; y: number }): RigPart {
  return { grid, pivot };
}

export function buildFoxParts(furVariant: FoxFurVariant): PetPartsBundle {
  const body = makeGrid(CHAR_W, CHAR_H);
  fillEllipse(body, 20, 24, 10, 6.5, S);
  fillEllipse(body, 19, 23, 9, 5.8, F);
  fillEllipse(body, 25, 26, 4.2, 4, F);
  fillEllipse(body, 22, 20, 4, 2, L);
  fillCapsule(body, 27, 20, 30, 15, 3.4, F);
  addOutline(body, O);

  const head = makeGrid(CHAR_W, CHAR_H);
  fillTriangle(head, 26, 12, 31, 12, 27, 0, F);
  fillTriangle(head, 27, 12, 30, 12, 27.6, 4, S);
  fillTriangle(head, 32, 12, 37.5, 12, 36, 0, F);
  fillTriangle(head, 33, 12, 36.4, 12, 35.6, 3.5, S);
  fillEllipse(head, 32, 16, 5.6, 5, F);
  fillCapsule(head, 32, 17, 39, 19, 2.4, F);
  fillEllipse(head, 38, 19, 1.6, 1.2, S);
  head[15][33] = E;
  head[15][34] = E;
  head[16][33] = E;
  head[19][39] = O;
  addOutline(head, O);

  if (furVariant === 'patched') {
    head[2][29] = S;
    head[3][29] = S;
    head[3][30] = S;
  }

  const mane = makeGrid(CHAR_W, CHAR_H);
  fillEllipse(mane, 27, 18, 2.6, 2.2, A);
  fillEllipse(mane, 29, 20, 2.6, 2.2, A);
  fillEllipse(mane, 25, 21, 2.4, 2.2, A);
  addOutline(mane, O);

  const tail = makeGrid(CHAR_W, CHAR_H);
  fillEllipse(tail, 10, 24, 8.2, 7, S);
  fillEllipse(tail, 9, 23, 7.6, 6.4, F);
  fillEllipse(tail, 4, 15.5, 6, 6, S);
  fillEllipse(tail, 4.6, 15, 5.3, 5.3, F);
  fillEllipse(tail, 2.5, 7, 3.8, 4, furVariant === 'patched' ? L : S);
  addOutline(tail, O);

  const legFront = buildLeg(26, 29, 33);
  const legBack = buildLeg(14, 29, 33);

  const cape = makeGrid(CHAR_W, CHAR_H);
  fillTriangle(cape, 24, 17, 10, 20, 13, 30, A);
  fillTriangle(cape, 24, 17, 13, 30, 24, 24, A);
  fillTriangle(cape, 10, 20, 13, 30, 7, 26, AS);
  addOutline(cape, O);

  const bandana = makeGrid(CHAR_W, CHAR_H);
  fillTriangle(bandana, 28, 19, 32, 20, 29.5, 24, A);
  fillTriangle(bandana, 29, 21, 31.4, 21.5, 30, 23.4, AS);
  addOutline(bandana, O);

  const mask = makeGrid(CHAR_W, CHAR_H);
  fillCapsule(mask, 30, 15, 36, 15.5, 2.4, A);
  mask[15][33] = O;
  mask[15][34] = O;
  mask[16][33] = O;
  addOutline(mask, O);

  const symbol = makeGrid(CHAR_W, CHAR_H);
  fillEllipse(symbol, 19, 23, 3.2, 3.2, L);
  fillTriangle(symbol, 19, 20.4, 20.4, 23, 17.6, 23, A);
  fillTriangle(symbol, 17.6, 23, 20.4, 23, 19, 25.6, A);
  addOutline(symbol, O);

  return {
    body: staticPart(body),
    head: staticPart(head),
    mane: part(mane, { x: 27, y: 19 }),
    tail: part(tail, { x: 10, y: 23 }),
    legFront: part(legFront, { x: 26, y: 29 }),
    legBack: part(legBack, { x: 14, y: 29 }),
    cape: part(cape, { x: 24, y: 17 }),
    bandana: part(bandana, { x: 29, y: 19 }),
    mask: staticPart(mask),
    symbol: staticPart(symbol)
  };
}
