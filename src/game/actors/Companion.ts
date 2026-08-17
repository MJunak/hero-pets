import type { RiggedActor } from './RiggedActor';
import { resolveHurdleX, wouldBeBlocked } from '../world/collision';
import { JUMP_OBSTACLES } from '../world/hurdles';
import { createVerticalState, JUMP_VELOCITY, jumpHeight, stepVertical, type VerticalState } from '../world/jumpPhysics';
import { FEET_OFFSET } from '../../pixelart/rig';
import { GROUND_LINE_Y } from '../world/WorldLayout';

export interface LeaderState {
  x: number;
  y: number;
  facing: 1 | -1;
}

type CompanionState = 'following' | 'moving_to_point' | 'holding';

const GROUNDED_Y = GROUND_LINE_Y - FEET_OFFSET;

/**
 * Der Begleiter (Tier oder Held, je nachdem wen der Spieler NICHT steuert)
 * folgt der Spielfigur mit etwas Abstand und hüpft dabei automatisch über
 * Hindernisse, die im Weg stehen. Für die Fähigkeit kann er kurzzeitig
 * gezielt zu einem Punkt geschickt werden (z. B. zum Missions-Hindernis) –
 * dieser Sonderfall ignoriert Sprungphysik bewusst, weil er nur in bereits
 * freigegebenen, hindernisfreien Zonen benutzt wird.
 */
export class Companion {
  readonly actor: RiggedActor;
  private state: CompanionState = 'following';
  private target: { x: number; y: number } | null = null;
  private onArrive: (() => void) | null = null;
  private followOffset = 78;
  private speed = 165;
  private vertical: VerticalState = createVerticalState();

  constructor(actor: RiggedActor, initialX: number, initialY: number) {
    this.actor = actor;
    this.actor.setPosition(initialX, initialY);
  }

  commandMoveTo(x: number, y: number, onArrive: () => void): void {
    this.state = 'moving_to_point';
    this.target = { x, y };
    this.onArrive = onArrive;
  }

  resumeFollowing(): void {
    this.state = 'following';
    this.target = null;
  }

  update(timeMs: number, deltaMs: number, leader: LeaderState): void {
    let moved = false;

    if (this.state === 'moving_to_point' && this.target) {
      moved = this.stepToward(this.target.x, this.target.y, deltaMs);
      if (!moved) {
        this.state = 'holding';
        const cb = this.onArrive;
        this.onArrive = null;
        cb?.();
      }
    } else if (this.state === 'following') {
      const desiredX = leader.x - leader.facing * this.followOffset;
      const dist = Math.abs(desiredX - this.actor.x);
      if (dist > 6) {
        moved = this.stepGroundToward(desiredX, deltaMs, dist > 140 ? 1.7 : 1);
      }
      this.actor.y = stepVertical(this.actor.y, this.vertical, deltaMs / 1000, GROUNDED_Y, false);
    }

    if (this.state !== 'moving_to_point' && this.actor.isPlayingAbility === false) {
      this.actor.setMoving(moved);
      if (moved) {
        const dx = this.target ? this.target.x - this.actor.x : leader.x - this.actor.x;
        if (Math.abs(dx) > 2) this.actor.setFacing(dx >= 0 ? 1 : -1);
      }
      this.actor.setAirborne(!this.vertical.grounded, this.vertical.velocityY);
    }

    this.actor.setDepth(1);
    this.actor.update(timeMs);
  }

  /** Horizontale Bewegung entlang des Bodens, hüpft automatisch über Hindernisse. */
  private stepGroundToward(x: number, deltaMs: number, speedMul = 1): boolean {
    const dx = x - this.actor.x;
    if (Math.abs(dx) < 3) return false;
    const step = (this.speed * speedMul * deltaMs) / 1000;
    const rawNextX = this.actor.x + Math.sign(dx) * Math.min(step, Math.abs(dx));

    const currentJumpHeight = jumpHeight(this.actor.y, GROUNDED_Y);
    if (this.vertical.grounded && wouldBeBlocked(this.actor.x, rawNextX, currentJumpHeight, JUMP_OBSTACLES)) {
      this.vertical.velocityY = JUMP_VELOCITY;
      this.vertical.grounded = false;
    }
    const clampedX = resolveHurdleX(this.actor.x, rawNextX, currentJumpHeight, JUMP_OBSTACLES);

    this.actor.x = clampedX;
    if (Math.abs(dx) > 1) this.actor.setFacing(dx >= 0 ? 1 : -1);
    return true;
  }

  /** Für den "zum Hindernis laufen"-Sonderfall der Fähigkeit: freie Diagonalbewegung, keine Sprungphysik. */
  private stepToward(x: number, y: number, deltaMs: number, speedMul = 1): boolean {
    const dx = x - this.actor.x;
    const dy = y - this.actor.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 3) return false;
    const step = (this.speed * speedMul * deltaMs) / 1000;
    const t = Math.min(1, step / dist);
    this.actor.x += dx * t;
    this.actor.y += dy * t;
    if (Math.abs(dx) > 1) this.actor.setFacing(dx >= 0 ? 1 : -1);
    return true;
  }
}
