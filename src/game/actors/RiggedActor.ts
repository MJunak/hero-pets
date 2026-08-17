import Phaser from 'phaser';
import { PART_Z_ORDER, type PartName } from '../../pixelart/compose';
import type { PetPartsBundle } from '../../pixelart/parts/types';
import { CHAR_H, CHAR_W, PIXEL_SIZE } from '../../pixelart/rig';

export interface RiggedActorOptions {
  bundle: PetPartsBundle;
  textureKeyPrefix: string;
  visibleParts: Set<PartName>;
}

/**
 * Ein Charakter (Held oder Tier), zusammengesetzt aus einzelnen Körperteil-
 * Bildern in einem Container. Die Animation (Laufen, Idle-Wippen, Fähigkeit)
 * wird jeden Frame prozedural berechnet statt über feste Sprite-Frames –
 * das spart Dutzende handgezeichneter Frames pro Tier.
 */
export class RiggedActor extends Phaser.GameObjects.Container {
  private images = new Map<PartName, Phaser.GameObjects.Image>();
  private facing: 1 | -1 = 1;
  private moving = false;
  private abilityUntil = 0;
  private abilityStart = 0;
  private abilityDuration = 0;
  private gaitPhase = Math.random() * Math.PI * 2;
  private airborne = false;
  private airborneVelocityY = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, opts: RiggedActorOptions) {
    super(scene, x, y);
    scene.add.existing(this);

    for (const name of PART_Z_ORDER) {
      const rigPart = opts.bundle[name];
      const key = `${opts.textureKeyPrefix}-${name}`;
      const img = scene.add.image(rigPart.pivot.x * PIXEL_SIZE, rigPart.pivot.y * PIXEL_SIZE, key);
      img.setOrigin(rigPart.pivot.x / CHAR_W, rigPart.pivot.y / CHAR_H);
      img.setVisible(opts.visibleParts.has(name));
      this.images.set(name, img);
      this.add(img);
    }

    this.setSize(CHAR_W * PIXEL_SIZE, CHAR_H * PIXEL_SIZE);
  }

  setPartVisible(name: PartName, visible: boolean): void {
    this.images.get(name)?.setVisible(visible);
  }

  setFacing(dir: 1 | -1): void {
    if (this.facing === dir) return;
    this.facing = dir;
    this.setScale(dir * Math.abs(this.scaleX), this.scaleY);
  }

  setMoving(moving: boolean): void {
    this.moving = moving;
  }

  /** Steuert die Sprung-Pose (Beine angezogen, Squash & Stretch nach Fallgeschwindigkeit). */
  setAirborne(airborne: boolean, velocityY: number): void {
    this.airborne = airborne;
    this.airborneVelocityY = velocityY;
  }

  get isPlayingAbility(): boolean {
    return this.scene.time.now < this.abilityUntil;
  }

  playAbility(durationMs: number): void {
    this.abilityStart = this.scene.time.now;
    this.abilityDuration = durationMs;
    this.abilityUntil = this.abilityStart + durationMs;
  }

  update(timeMs: number): void {
    const legFront = this.images.get('legFront')!;
    const legBack = this.images.get('legBack')!;
    const tail = this.images.get('tail')!;
    const mane = this.images.get('mane')!;
    const cape = this.images.get('cape')!;
    const body = this.images.get('body')!;
    const head = this.images.get('head')!;

    if (this.isPlayingAbility) {
      const t = (timeMs - this.abilityStart) / this.abilityDuration;
      this.renderAbilityPose(t, { legFront, legBack, tail, mane, cape, body, head });
      return;
    }

    if (this.airborne) {
      this.renderAirbornePose({ legFront, legBack, tail, mane, cape, body, head });
      return;
    }

    body.setScale(1, 1);
    head.setScale(1, 1);

    const speed = this.moving ? 9 : 2.4;
    const amp = this.moving ? 0.55 : 0.08;
    const phase = timeMs * 0.001 * speed + this.gaitPhase;
    const swing = Math.sin(phase) * amp;

    legFront.rotation = swing;
    legBack.rotation = -swing;

    const bodyBob = this.moving ? Math.abs(Math.sin(phase)) * 2.2 : Math.sin(timeMs * 0.0016) * 1;
    body.y = -bodyBob;
    head.y = -bodyBob;

    const tailSwing = Math.sin(timeMs * 0.0028 + this.gaitPhase) * (this.moving ? 0.32 : 0.16);
    tail.rotation = tailSwing;

    const maneSwing = Math.sin(timeMs * 0.0032 + this.gaitPhase + 1) * (this.moving ? 0.16 : 0.06);
    mane.rotation = maneSwing;

    const capeSwing = Math.sin(timeMs * 0.0026 + this.gaitPhase + 2) * (this.moving ? 0.22 : 0.08);
    cape.rotation = 0.12 + capeSwing;

    this.setScale(this.facing * 1, 1);
  }

  private renderAbilityPose(
    t: number,
    parts: {
      legFront: Phaser.GameObjects.Image;
      legBack: Phaser.GameObjects.Image;
      tail: Phaser.GameObjects.Image;
      mane: Phaser.GameObjects.Image;
      cape: Phaser.GameObjects.Image;
      body: Phaser.GameObjects.Image;
      head: Phaser.GameObjects.Image;
    }
  ): void {
    const crouchPhase = 0.28;
    const burstPhase = 0.62;
    let squash: number;
    let lift: number;
    let legSplay: number;

    if (t < crouchPhase) {
      const p = t / crouchPhase;
      squash = 1 - p * 0.22;
      lift = 0;
      legSplay = 0;
    } else if (t < burstPhase) {
      const p = (t - crouchPhase) / (burstPhase - crouchPhase);
      squash = 0.78 + p * 0.5;
      lift = Math.sin(p * Math.PI) * 10;
      legSplay = p;
    } else {
      const p = (t - burstPhase) / (1 - burstPhase);
      squash = 1.28 - p * 0.28;
      lift = Math.sin((1 - p) * Math.PI) * 4;
      legSplay = 1 - p;
    }

    parts.body.y = -lift;
    parts.head.y = -lift;
    parts.body.setScale(1 / squash, squash);
    parts.head.setScale(1 / squash, squash);
    parts.legFront.rotation = -0.75 * legSplay;
    parts.legBack.rotation = 0.75 * legSplay;
    parts.tail.rotation = Math.sin(t * Math.PI * 6) * 0.5;
    parts.mane.rotation = Math.sin(t * Math.PI * 6 + 1) * 0.3;
    parts.cape.rotation = 0.12 + Math.sin(t * Math.PI * 6 + 2) * 0.35;
  }

  private renderAirbornePose(parts: {
    legFront: Phaser.GameObjects.Image;
    legBack: Phaser.GameObjects.Image;
    tail: Phaser.GameObjects.Image;
    mane: Phaser.GameObjects.Image;
    cape: Phaser.GameObjects.Image;
    body: Phaser.GameObjects.Image;
    head: Phaser.GameObjects.Image;
  }): void {
    // Negative Geschwindigkeit = steigt (Streckung), positiv = fällt (Stauchung).
    const stretch = Phaser.Math.Clamp(-this.airborneVelocityY / 900, -0.18, 0.22);
    parts.body.setScale(1 - stretch * 0.5, 1 + stretch);
    parts.head.setScale(1, 1);
    parts.legFront.rotation = -0.55;
    parts.legBack.rotation = -0.35;
    parts.tail.rotation = 0.3;
    parts.mane.rotation = -0.15;
    parts.cape.rotation = 0.32;
    this.setScale(this.facing * 1, 1);
  }
}
