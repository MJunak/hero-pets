import Phaser from 'phaser';
import { sfxStar } from '../../audio/Sfx';
import { getSaveData, persist } from '../gameState';
import { SCENERY_KEYS } from '../world/buildScenery';
import { GROUND_BOTTOM, GROUND_TOP } from '../world/WorldLayout';

export interface StarDef {
  id: string;
  x: number;
  y: number;
}

const midY = (GROUND_TOP + GROUND_BOTTOM) / 2;

export const STAR_POSITIONS: StarDef[] = [
  { id: 'star-0', x: 260, y: GROUND_TOP + 30 },
  { id: 'star-1', x: 560, y: midY - 40 },
  { id: 'star-2', x: 820, y: GROUND_BOTTOM - 50 },
  { id: 'star-3', x: 1150, y: GROUND_TOP + 40 },
  { id: 'star-4', x: 1300, y: midY },
  { id: 'star-5', x: 1620, y: GROUND_TOP + 35 },
  { id: 'star-6', x: 1850, y: GROUND_BOTTOM - 45 },
  { id: 'star-7', x: 2280, y: midY - 30 },
  { id: 'star-8', x: 2500, y: GROUND_TOP + 40 },
  { id: 'star-9', x: 2750, y: GROUND_BOTTOM - 50 },
  { id: 'star-10', x: 2980, y: midY },
  { id: 'star-11', x: 3320, y: GROUND_TOP + 35 },
  { id: 'star-12', x: 3550, y: GROUND_BOTTOM - 45 },
  { id: 'star-13', x: 3800, y: midY - 35 },
  { id: 'star-14', x: 4050, y: GROUND_TOP + 40 },
  { id: 'star-15', x: 4230, y: GROUND_BOTTOM - 40 }
];

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
      const img = scene.add.image(def.x, def.y, SCENERY_KEYS.star);
      img.setDepth(9000);
      img.setScale(0.36);
      scene.tweens.add({
        targets: img,
        y: def.y - 10,
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
