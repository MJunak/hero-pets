/**
 * Einfache, selbstgebaute Schwerkraft statt eines Physik-Plugins – der
 * Spieler-Container hat kein sinnvolles Arcade-Body-Rechteck (Ursprung oben
 * links, Figur breiter als "sichtbar"), daher ist eine handgeschriebene
 * Vertikal-Bewegung hier einfacher als Arcade Physics an den Rig anzupassen.
 * Wird sowohl vom Spieler als auch vom Begleiter benutzt, damit beide exakt
 * gleich springen.
 */

export const GRAVITY = 2200;
export const JUMP_VELOCITY = -850;

/** Maximale Sprunghöhe in Pixeln – hilfreich, um Hindernishöhen zu kalibrieren. */
export const MAX_JUMP_HEIGHT = (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * GRAVITY);

export interface VerticalState {
  velocityY: number;
  grounded: boolean;
}

export function createVerticalState(): VerticalState {
  return { velocityY: 0, grounded: true };
}

/** Wie hoch (in Pixeln) die Figur gerade über dem Boden schwebt. 0 = auf dem Boden. */
export function jumpHeight(currentY: number, groundedY: number): number {
  return Math.max(0, groundedY - currentY);
}

/**
 * Wendet Schwerkraft/Sprung auf eine Y-Position an und gibt die neue Y-Position
 * zurück. `wantsJump` löst nur aus, wenn die Figur gerade auf dem Boden steht.
 */
export function stepVertical(
  currentY: number,
  state: VerticalState,
  dtSeconds: number,
  groundedY: number,
  wantsJump: boolean
): number {
  if (wantsJump && state.grounded) {
    state.velocityY = JUMP_VELOCITY;
    state.grounded = false;
  }

  state.velocityY += GRAVITY * dtSeconds;
  let nextY = currentY + state.velocityY * dtSeconds;

  if (nextY >= groundedY) {
    nextY = groundedY;
    state.velocityY = 0;
    state.grounded = true;
  }

  return nextY;
}
