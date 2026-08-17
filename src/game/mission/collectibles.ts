import Phaser from 'phaser';
import { sfxStar } from '../../audio/Sfx';
import { getSaveData, persist } from '../gameState';
import { SCENERY_KEYS } from '../world/buildScenery';
import { GROUND_LINE_Y } from '../world/WorldLayout';

export interface StarDef {
  id: string;
  x: number;
  /** Höhe über der Bodenlinie in Pixeln – 0 liegt direkt am Boden. */
  height: number;
}

/**
 * Vier Höhen im Wechsel: manche Sterne liegen niedrig genug, um im Vorbeilaufen
 * mitgenommen zu werden, andere verlangen einen kleinen bis hohen Sprung
 * (max. Sprunghöhe ist ~111px, siehe `jumpPhysics.MAX_JUMP_HEIGHT`).
 */
const HEIGHT_CYCLE = [20, 70, 45, 85];

const STAR_X = [260, 560, 820, 1150, 1300, 1620, 1850, 2280, 2500, 2750, 2980, 3320, 3550, 3800, 4050, 4230];

export const STAR_POSITIONS: StarDef[] = STAR_X.map((x, i) => ({
  id: `star-${i}`,
  x,
  height: HEIGHT_CYCLE[i % HEIGHT_CYCLE.length]
}));

const PICKUP_RANGE = 50;

/** Verwaltet die sammelbaren Sterne: Spawnen, Wackel-Animation, Einsammeln, Speichern. */
export class CollectibleManager {
  private scene: Phaser.Scene;
  private stars = new Map<string, Phaser.GameObjects.Image>();
  private onCountChange: (collected: number, total: number) => void;
  private onAllCollected: () => void;

  constructor(
    scene: Phaser.Scene,
    onCountChange: (collected: number, total: number) => void,
    onAllCollected: () => void
  ) {
    this.scene = scene;
    this.onCountChange = onCountChange;
    this.onAllCollected = onAllCollected;

    const alreadyCollected = new Set(getSaveData().mission.starsCollected);
    for (const def of STAR_POSITIONS) {
      if (alreadyCollected.has(def.id)) continue;
      const y = GROUND_LINE_Y - def.height;
      const img = scene.add.image(def.x, y, SCENERY_KEYS.star);
      img.setDepth(9000);
      img.setScale(0.36);
      scene.tweens.add({
        targets: img,
        y: y - 10,
        duration: 900 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      scene.tweens.add({
        targets: img,
        angle: 12,
        duration: 1300 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.stars.set(def.id, img);
    }

    this.onCountChange(alreadyCollected.size, STAR_POSITIONS.length);
  }

  /** `playerX`/`playerY` sollten die Fußposition der Spielfigur sein (Weltkoordinaten). */
  update(playerX: number, playerY: number): void {
    for (const [id, img] of this.stars) {
      const dist = Phaser.Math.Distance.Between(playerX, playerY, img.x, img.y);
      if (dist < PICKUP_RANGE) this.collect(id, img);
    }
  }

  private collect(id: string, img: Phaser.GameObjects.Image): void {
    this.stars.delete(id);
    this.scene.tweens.add({
      targets: img,
      scale: 1.8,
      alpha: 0,
      duration: 260,
      ease: 'Cubic.easeOut',
      onComplete: () => img.destroy()
    });
    sfxStar();

    const save = getSaveData();
    if (!save.mission.starsCollected.includes(id)) save.mission.starsCollected.push(id);
    persist();

    const collected = save.mission.starsCollected.length;
    this.onCountChange(collected, STAR_POSITIONS.length);
    if (collected === STAR_POSITIONS.length) this.onAllCollected();
  }
}
