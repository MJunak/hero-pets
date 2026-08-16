import { addOutline, fillCapsule, fillEllipse, fillTriangle, makeGrid } from '../grid';
import { CHAR_H, CHAR_W } from '../rig';
import { A, AS, E, F, L, O, S, buildLeg, petPaletteFromSlots } from './slots';
import type { PetPalette, PetPartsBundle, RigPart } from './types';
import { staticPart } from './types';

export type HorseManeStyle = 'plain' | 'patched';

export function horsePetPalette(p: PetPalette): Record<string, string> {
  return petPaletteFromSlots(p);
}

function part(grid: string[][], pivot: { x: number; y: number }): RigPart {
  return { grid, pivot };
}

export function buildHorseParts(maneStyle: HorseManeStyle): PetPartsBundle {
  // Rumpf, Hals, Kopf & Ohr werden in EINEM Grid gezeichnet, damit der
  // Umriss (addOutline) am Ende eine durchgehende Silhouette umfasst –
  // sonst entsteht an jedem Teile-Übergang eine sichtbare Nahtlinie.
  const body = makeGrid(CHAR_W, CHAR_H);
  fillEllipse(body, 21, 22, 13, 7.2, S);
  fillEllipse(body, 20, 21, 12, 6.4, F);
  fillEllipse(body, 12, 21, 6, 6, F);
  fillEllipse(body, 16, 18, 4.5, 2.2, L);
  fillCapsule(body, 28, 20, 35, 9, 4.3, F);
  fillEllipse(body, 37, 9, 5, 5, F);
  fillCapsule(body, 37, 10, 43, 12, 2.6, F);
  fillTriangle(body, 34, 5, 37.4, 4.6, 35.8, 0, F);
  body[11][42] = O;
  body[6][36] = O;
  body[6][37] = O;
  body[7][35] = O;
  body[7][38] = O;
  body[8][36] = O;
  body[8][37] = O;
  body[7][36] = E;
  body[7][37] = E;
  addOutline(body, O);

  const mane = makeGrid(CHAR_W, CHAR_H);
  fillCapsule(mane, 27, 17, 32, 4, 2.5, A);
  fillTriangle(mane, 30, 2, 33, 3.5, 30, 6, A);
  if (maneStyle === 'patched') {
    fillTriangle(mane, 29, 9, 24, 11, 29, 13, A);
    fillTriangle(mane, 30, 6, 25, 7, 30, 10, A);
  }
  addOutline(mane, O);

  const tail = makeGrid(CHAR_W, CHAR_H);
  fillCapsule(tail, 9, 17, 4, 27, 3, A);
  fillCapsule(tail, 4, 27, 2, 33, 2, A);
  if (maneStyle === 'patched') {
    fillTriangle(tail, 6, 20, 11, 21, 7, 25, A);
  }
  addOutline(tail, O);

  const legFront = buildLeg(29, 24, 34);
  const legBack = buildLeg(13, 24, 34);

  const cape = makeGrid(CHAR_W, CHAR_H);
  fillTriangle(cape, 26, 15, 9, 19, 13, 31, A);
  fillTriangle(cape, 26, 15, 13, 31, 26, 23, A);
  fillTriangle(cape, 9, 19, 13, 31, 6, 26, AS);
  addOutline(cape, O);

  const bandana = makeGrid(CHAR_W, CHAR_H);
  fillTriangle(bandana, 29, 17, 34, 18, 31, 23, A);
  fillTriangle(bandana, 30, 19, 33, 19.5, 31.5, 22, AS);
  addOutline(bandana, O);

  const mask = makeGrid(CHAR_W, CHAR_H);
  fillCapsule(mask, 34, 7, 40, 8, 2.6, A);
  mask[7][36] = O;
  mask[7][37] = O;
  mask[8][36] = O;
  addOutline(mask, O);

  const symbol = makeGrid(CHAR_W, CHAR_H);
  fillEllipse(symbol, 19, 21, 3.4, 3.4, L);
  fillTriangle(symbol, 19, 18.3, 20.4, 21, 17.6, 21, A);
  fillTriangle(symbol, 17.6, 21, 20.4, 21, 19, 23.7, A);
  addOutline(symbol, O);

  return {
    body: staticPart(body),
    head: staticPart(makeGrid(CHAR_W, CHAR_H)),
    mane: part(mane, { x: 30, y: 10 }),
    tail: part(tail, { x: 9, y: 18 }),
    legFront: part(legFront, { x: 29, y: 24 }),
    legBack: part(legBack, { x: 13, y: 24 }),
    cape: part(cape, { x: 26, y: 15 }),
    bandana: part(bandana, { x: 31, y: 18 }),
    mask: staticPart(mask),
    symbol: staticPart(symbol)
  };
}
