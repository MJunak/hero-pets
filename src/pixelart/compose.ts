import type { AccentColorId, AnimalId, PetAppearance } from '../types';
import { buildHorseParts, horsePetPalette } from './parts/horse';
import { buildFoxParts, foxPetPalette } from './parts/fox';
import { buildHeroParts, heroPalette } from './parts/hero';
import type { PetPartsBundle } from './parts/types';
import {
  ACCENT_COLORS,
  ACCENT_COLORS_SHADE,
  EYE_COLORS,
  FUR_COLORS,
  FUR_COLORS_LIGHT,
  FUR_COLORS_SHADE,
  OUTLINE
} from './palette';
import { gridToCanvas, makeGrid, stampOnto } from './grid';
import { CHAR_H, CHAR_W, PIXEL_SIZE } from './rig';

export interface ComposedActor {
  bundle: PetPartsBundle;
  palette: Record<string, string>;
}

/** Reihenfolge, in der Körperteile übereinandergezeichnet werden (hinten -> vorne). */
export const PART_Z_ORDER = [
  'cape',
  'tail',
  'legBack',
  'body',
  'legFront',
  'mane',
  'head',
  'bandana',
  'mask',
  'symbol'
] as const;

export type PartName = (typeof PART_Z_ORDER)[number];

export function composePet(animal: AnimalId, appearance: PetAppearance): ComposedActor {
  const palette = {
    fur: FUR_COLORS[appearance.furColor],
    furShade: FUR_COLORS_SHADE[appearance.furColor],
    furLight: FUR_COLORS_LIGHT[appearance.furColor],
    eye: EYE_COLORS[appearance.eyeColor],
    accent: ACCENT_COLORS[appearance.accentColor],
    accentShade: ACCENT_COLORS_SHADE[appearance.accentColor],
    outline: OUTLINE
  };
  if (animal === 'horse') {
    return {
      bundle: buildHorseParts(appearance.pattern === 'patched' ? 'patched' : 'plain'),
      palette: horsePetPalette(palette)
    };
  }
  return {
    bundle: buildFoxParts(appearance.pattern === 'patched' ? 'patched' : 'plain'),
    palette: foxPetPalette(palette)
  };
}

export function composeHero(accent: AccentColorId): ComposedActor {
  return { bundle: buildHeroParts(), palette: heroPalette(accent) };
}

export function visiblePartsFor(appearance: PetAppearance | null): Set<PartName> {
  const visible = new Set<PartName>(['body', 'head', 'mane', 'tail', 'legFront', 'legBack']);
  if (!appearance) {
    // Held: fixes Aussehen, Umhang gehört fest zum Kostüm.
    visible.add('cape');
    return visible;
  }
  if (appearance.accessories.cape) visible.add('cape');
  if (appearance.accessories.bandana) visible.add('bandana');
  if (appearance.accessories.mask) visible.add('mask');
  if (appearance.accessories.symbol) visible.add('symbol');
  return visible;
}

/** Baut ein einzelnes flaches Bild (für die Character-Creator-Vorschau). */
export function composeFlatCanvas(actor: ComposedActor, visible: Set<PartName>): HTMLCanvasElement {
  const merged = makeGrid(CHAR_W, CHAR_H);
  for (const name of PART_Z_ORDER) {
    if (!visible.has(name)) continue;
    stampOnto(merged, actor.bundle[name].grid, 0, 0);
  }
  return gridToCanvas(merged, actor.palette, PIXEL_SIZE);
}

/** Backt jedes Teil als eigene Canvas – für Phaser-Texturen, die einzeln animiert werden. */
export function bakePartCanvases(actor: ComposedActor): Record<PartName, HTMLCanvasElement> {
  const result = {} as Record<PartName, HTMLCanvasElement>;
  for (const name of PART_Z_ORDER) {
    result[name] = gridToCanvas(actor.bundle[name].grid, actor.palette, PIXEL_SIZE);
  }
  return result;
}
