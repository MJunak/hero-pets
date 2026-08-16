import Phaser from 'phaser';
import type { RiggedActor } from './RiggedActor';
import { GROUND_BOTTOM, GROUND_TOP } from '../world/WorldLayout';

export interface LeaderState {
  x: number;
  y: number;
  facing: 1 | -1;
}

type CompanionState = 'following' | 'moving_to_point' | 'holding';

/**
 * Der Begleiter (Tier oder Held, je nachdem wen der Spieler NICHT steuert)
 * folgt der Spielfigur mit etwas Abstand. Für die Fähigkeit kann er
 * kurzzeitig gezielt zu einem Punkt geschickt werden (z. B. zum Hindernis).
 */
export class Companion {
  readonly actor: RiggedActor;
  private state: CompanionState = 'following';
  private target: { x: number; y: number } | null = null;
  private onArrive: (() => void) | null = null;
  private followOffset = 78;
  private speed = 165;

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
      const desiredY = Phaser.Math.Clamp(leader.y, GROUND_TOP + 40, GROUND_BOTTOM - 30);
      const dist = Math.hypot(desiredX - this.actor.x, desiredY - this.actor.y);
      if (dist > 6) {
        moved = this.stepToward(desiredX, desiredY, deltaMs, dist > 140 ? 1.7 : 1);
      }
    }

    if (this.state !== 'moving_to_point' && this.actor.isPlayingAbility === false) {
      this.actor.setMoving(moved);
      if (moved) {
        const dx = this.target ? this.target.x - this.actor.x : leader.x - this.actor.x;
        if (Math.abs(dx) > 2) this.actor.setFacing(dx >= 0 ? 1 : -1);
      }
    }

    this.actor.setDepth(this.actor.y);
    this.actor.update(timeMs);
  }

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
