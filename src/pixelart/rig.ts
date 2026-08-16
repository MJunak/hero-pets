/**
 * Alle Körperteile eines Charakters werden auf demselben virtuellen Raster
 * gezeichnet (gleiche Breite/Höhe). Dadurch landet jedes Teil automatisch an
 * der richtigen Stelle, wenn es später als eigenes Bild in einem Phaser-
 * Container übereinandergelegt wird – ganz ohne manuelles Offset-Rechnen.
 */
export const CHAR_W = 46;
export const CHAR_H = 40;
export const GROUND_Y = 34;
export const PIXEL_SIZE = 4;

export interface Pivot {
  x: number;
  y: number;
}
