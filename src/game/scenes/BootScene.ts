import Phaser from 'phaser';
import { bakePartCanvases, composeHero, composePet } from '../../pixelart/compose';
import type { SaveData } from '../../types';
import { getSaveData } from '../gameState';

export const PET_TEX_PREFIX = 'actor-pet';
export const HERO_TEX_PREFIX = 'actor-hero';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    const save = getSaveData();
    this.bakeActorTextures(PET_TEX_PREFIX, composePet(save.animal, save.appearance));
    this.bakeActorTextures(HERO_TEX_PREFIX, composeHero(save.appearance.accentColor));
    this.scene.start('world');
  }

  private bakeActorTextures(prefix: string, actor: ReturnType<typeof composePet>): void {
    const canvases = bakePartCanvases(actor);
    for (const [name, canvas] of Object.entries(canvases)) {
      const key = `${prefix}-${name}`;
      if (this.textures.exists(key)) this.textures.remove(key);
      this.textures.addCanvas(key, canvas);
    }
  }
}

export function rebakeActor(scene: Phaser.Scene, prefix: string, save: SaveData): void {
  const actor = prefix === PET_TEX_PREFIX ? composePet(save.animal, save.appearance) : composeHero(save.appearance.accentColor);
  const canvases = bakePartCanvases(actor);
  for (const [name, canvas] of Object.entries(canvases)) {
    const key = `${prefix}-${name}`;
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, canvas);
  }
}
