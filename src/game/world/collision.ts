import type { Hurdle } from './hurdles';

const PLAYER_HALF_W = 22;

/**
 * Begrenzt eine horizontale Zielposition an Hindernissen, die noch nicht
 * übersprungen wurden. Springt die Figur hoch genug (`jumpHeightNow` über
 * der jeweiligen Hindernishöhe), lässt das Hindernis sie ungehindert durch.
 * Sonst wirkt die Kante wie eine Wand – man muss erst springen.
 */
export function resolveHurdleX(fromX: number, toX: number, jumpHeightNow: number, hurdles: Hurdle[]): number {
  let result = toX;
  for (const hurdle of hurdles) {
    if (jumpHeightNow >= hurdle.height) continue;
    const left = hurdle.x - hurdle.halfWidth - PLAYER_HALF_W;
    const right = hurdle.x + hurdle.halfWidth + PLAYER_HALF_W;
    if (result > left && result < right) {
      result = fromX <= left ? left : fromX >= right ? right : fromX;
    }
  }
  return result;
}

/** Ob eine Bewegung von `fromX` nach `toX` gerade an einem zu niedrigen Sprung scheitern würde. */
export function wouldBeBlocked(fromX: number, toX: number, jumpHeightNow: number, hurdles: Hurdle[]): boolean {
  return resolveHurdleX(fromX, toX, jumpHeightNow, hurdles) !== toX;
}
