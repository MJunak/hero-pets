import { MAX_JUMP_HEIGHT } from './jumpPhysics';
import { MISSION_BEATS } from '../mission/beats';

/** Einfaches Hindernis, das nur durch Springen überwunden werden kann (kein Kraft-Einsatz nötig). */
export interface Hurdle {
  x: number;
  halfWidth: number;
  height: number;
  textureKey: string;
}

/**
 * Höhen bewusst mit Sicherheitsabstand zu `MAX_JUMP_HEIGHT` gewählt: Wer
 * genau an der Kante springt (Normalfall, weil die Kante wie eine Wand
 * blockiert, bis man hoch genug ist), muss die volle Hindernisbreite noch
 * *während* der Zeitspanne überqueren, in der der Sprung hoch genug ist.
 * Bei zu wenig Abstand reicht dieses Zeitfenster nicht – siehe Commit-Historie
 * zur ersten (zu knappen) Version dieser Werte.
 */
export const HURDLE_HEIGHTS = { low: 50, mid: 75, high: 90 } as const;

const HALF_WIDTH = 20;

/**
 * Zwölf kleine Hindernisse über die ganze Welt verteilt, jeweils drei pro
 * Zone. Bewusst außerhalb der `useRange` der Missions-Hindernisse platziert
 * (siehe `assertHurdlesClearOfBeats`) – sonst könnte der Weg unlösbar werden.
 */
export const JUMP_OBSTACLES: Hurdle[] = [
  { x: 420, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.low, textureKey: 'scenery-hurdle-rock' },
  { x: 600, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.mid, textureKey: 'scenery-hurdle-stump' },
  { x: 780, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.high, textureKey: 'scenery-hurdle-crate' },

  { x: 1400, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.low, textureKey: 'scenery-hurdle-rock' },
  { x: 1750, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.mid, textureKey: 'scenery-hurdle-stump' },
  { x: 1880, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.high, textureKey: 'scenery-hurdle-crate' },

  { x: 2450, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.low, textureKey: 'scenery-hurdle-rock' },
  { x: 2620, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.mid, textureKey: 'scenery-hurdle-stump' },
  { x: 2870, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.high, textureKey: 'scenery-hurdle-crate' },

  { x: 3500, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.low, textureKey: 'scenery-hurdle-rock' },
  { x: 3680, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.mid, textureKey: 'scenery-hurdle-stump' },
  { x: 3980, halfWidth: HALF_WIDTH, height: HURDLE_HEIGHTS.high, textureKey: 'scenery-hurdle-crate' }
];

/**
 * Dev-Sicherheitsnetz: Wirft frühzeitig, wenn ein Hindernis zu hoch für den
 * maximalen Sprung ist oder in den `useRange` eines Missions-Beats hineinragt
 * – beides würde das Spiel unlösbar machen.
 */
export function assertHurdlesClearOfBeats(): void {
  for (const hurdle of JUMP_OBSTACLES) {
    if (hurdle.height >= MAX_JUMP_HEIGHT) {
      throw new Error(
        `Hindernis bei x=${hurdle.x} ist ${hurdle.height}px hoch, aber der Sprung erreicht nur ${MAX_JUMP_HEIGHT.toFixed(0)}px.`
      );
    }
    for (const beat of MISSION_BEATS) {
      const hurdleLeft = hurdle.x - hurdle.halfWidth;
      const hurdleRight = hurdle.x + hurdle.halfWidth;
      const beatLeft = beat.obstacleX - beat.useRange;
      const beatRight = beat.obstacleX + beat.useRange;
      const overlaps = hurdleLeft < beatRight && hurdleRight > beatLeft;
      if (overlaps) {
        throw new Error(
          `Hindernis bei x=${hurdle.x} überschneidet die useRange von Beat "${beat.id}" (x=${beat.obstacleX}) – das Spiel wäre unlösbar.`
        );
      }
    }
  }
}
