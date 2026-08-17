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

/**
 * Abstand zwischen dem Container-Ursprung einer Figur (oben links im Raster)
 * und ihren Füßen in Weltkoordinaten. Einzige Quelle der Wahrheit dafür –
 * Bodenkollision, Spawn-Position und Staub-Partikel müssen alle denselben
 * Wert benutzen, sonst driften sie auseinander.
 */
export const FEET_OFFSET = GROUND_Y * PIXEL_SIZE;

export interface Pivot {
  x: number;
  y: number;
}
