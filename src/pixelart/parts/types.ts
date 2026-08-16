import type { Grid } from '../grid';
import type { Pivot } from '../rig';

export interface PetPalette {
  fur: string;
  furShade: string;
  furLight: string;
  eye: string;
  accent: string;
  accentShade: string;
  outline: string;
}

/** Ein Körperteil: das Pixel-Raster plus sein Drehpunkt (für Lauf-/Wedel-Animation). */
export interface RigPart {
  grid: Grid;
  pivot: Pivot;
}

export interface PetPartsBundle {
  body: RigPart;
  head: RigPart;
  mane: RigPart;
  tail: RigPart;
  legFront: RigPart;
  legBack: RigPart;
  cape: RigPart;
  bandana: RigPart;
  mask: RigPart;
  symbol: RigPart;
}

export function staticPart(grid: Grid): RigPart {
  return { grid, pivot: { x: 0, y: 0 } };
}
