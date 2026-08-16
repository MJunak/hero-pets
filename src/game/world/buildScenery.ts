import Phaser from 'phaser';
import {
  bridgePlankCanvas,
  bushCanvas,
  cloudCanvas,
  groundTileCanvas,
  hqFlagCanvas,
  kittenCanvas,
  particleDotCanvas,
  pathTileCanvas,
  rockCanvas,
  signCanvas,
  treeCanvas
} from '../../pixelart/scenery';
import type { AccentColorId } from '../../types';
import {
  BRIDGE_END_X,
  BRIDGE_START_X,
  GROUND_BOTTOM,
  GROUND_TOP,
  HORIZON_Y,
  HQ_X,
  MISSION_TARGET_X,
  MISSION_TARGET_Y,
  OBSTACLE_X,
  WORLD_WIDTH
} from './WorldLayout';

const SCENERY_KEYS = {
  tree0: 'scenery-tree0',
  tree1: 'scenery-tree1',
  bush: 'scenery-bush',
  cloud: 'scenery-cloud',
  rock: 'scenery-rock',
  plank: 'scenery-plank',
  ground: 'scenery-ground',
  path: 'scenery-path',
  kitten: 'scenery-kitten',
  flag: 'scenery-flag',
  sign: 'scenery-sign',
  particle: 'scenery-particle'
} as const;

export { SCENERY_KEYS };

export function preloadSceneryTextures(scene: Phaser.Scene, accent: AccentColorId): void {
  const add = (key: string, canvas: HTMLCanvasElement) => {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, canvas);
  };
  add(SCENERY_KEYS.tree0, treeCanvas(0));
  add(SCENERY_KEYS.tree1, treeCanvas(1));
  add(SCENERY_KEYS.bush, bushCanvas());
  add(SCENERY_KEYS.cloud, cloudCanvas());
  add(SCENERY_KEYS.rock, rockCanvas());
  add(SCENERY_KEYS.plank, bridgePlankCanvas());
  add(SCENERY_KEYS.ground, groundTileCanvas());
  add(SCENERY_KEYS.path, pathTileCanvas());
  add(SCENERY_KEYS.kitten, kittenCanvas());
  add(SCENERY_KEYS.flag, hqFlagCanvas(accent));
  add(SCENERY_KEYS.sign, signCanvas());
  add(SCENERY_KEYS.particle, particleDotCanvas());
}

export interface SceneryHandles {
  rock: Phaser.GameObjects.Image;
  kitten: Phaser.GameObjects.Image;
}

export function buildScenery(scene: Phaser.Scene, obstacleAlreadyCleared: boolean): SceneryHandles {
  const sky = scene.add.graphics().setScrollFactor(0).setDepth(-200);
  const drawSky = () => {
    sky.clear();
    sky.fillGradientStyle(0x8fd3f4, 0x8fd3f4, 0xd7f0fb, 0xd7f0fb, 1);
    sky.fillRect(0, 0, scene.scale.width, scene.scale.height);
  };
  drawSky();
  scene.scale.on('resize', drawSky);
  scene.events.once('shutdown', () => scene.scale.off('resize', drawSky));

  for (let i = 0; i < 6; i++) {
    const x = 120 + i * 430 + Phaser.Math.Between(-60, 60);
    const y = 40 + Phaser.Math.Between(0, 70);
    scene.add.image(x, y, SCENERY_KEYS.cloud).setScrollFactor(0.15).setDepth(-150).setAlpha(0.9);
  }

  const farHills = scene.add.rectangle(WORLD_WIDTH / 2, HORIZON_Y + 40, WORLD_WIDTH + 1200, 160, 0x6fb98f);
  farHills.setScrollFactor(0.35).setDepth(-100);
  const nearHills = scene.add.rectangle(WORLD_WIDTH / 2, HORIZON_Y + 90, WORLD_WIDTH + 1200, 140, 0x59a97c);
  nearHills.setScrollFactor(0.55).setDepth(-90);

  const ground = scene.add.tileSprite(
    WORLD_WIDTH / 2,
    (GROUND_TOP + GROUND_BOTTOM + 60) / 2,
    WORLD_WIDTH,
    GROUND_BOTTOM - GROUND_TOP + 60,
    SCENERY_KEYS.ground
  );
  ground.setDepth(-20);

  const pathStrip = scene.add.tileSprite(WORLD_WIDTH / 2, (GROUND_TOP + GROUND_BOTTOM) / 2, WORLD_WIDTH, 70, SCENERY_KEYS.path);
  pathStrip.setDepth(-19);

  const plankStrip = scene.add.tileSprite(
    (BRIDGE_START_X + BRIDGE_END_X) / 2,
    (GROUND_TOP + GROUND_BOTTOM) / 2,
    BRIDGE_END_X - BRIDGE_START_X,
    70,
    SCENERY_KEYS.plank
  );
  plankStrip.setDepth(-18);

  scene.add.image(HQ_X, GROUND_TOP + 40, SCENERY_KEYS.flag).setOrigin(0.5, 1).setDepth(GROUND_TOP + 40);
  scene.add.image(HQ_X + 60, GROUND_TOP + 70, SCENERY_KEYS.sign).setOrigin(0.5, 1).setDepth(GROUND_TOP + 70);

  const treePositions = [340, 470, 640, 800, 970, 1130, 1760, 1930, 2100, 2260, 2400];
  treePositions.forEach((x, i) => {
    const y = GROUND_TOP - 10 + (i % 2 === 0 ? 0 : 12) + Phaser.Math.Between(-6, 6);
    const key = i % 2 === 0 ? SCENERY_KEYS.tree0 : SCENERY_KEYS.tree1;
    scene.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
  });

  const bushPositions = [480, 750, 1020, 1780, 2050, 2350];
  bushPositions.forEach((x) => {
    const y = GROUND_BOTTOM - 20 + Phaser.Math.Between(-8, 8);
    scene.add.image(x, y, SCENERY_KEYS.bush).setOrigin(0.5, 1).setDepth(y);
  });

  const rock = scene.add.image(OBSTACLE_X, GROUND_TOP + 95, SCENERY_KEYS.rock).setOrigin(0.5, 1);
  rock.setDepth(GROUND_TOP + 95);
  if (obstacleAlreadyCleared) {
    rock.setVisible(false);
  }

  const kitten = scene.add.image(MISSION_TARGET_X, MISSION_TARGET_Y + 30, SCENERY_KEYS.kitten).setOrigin(0.5, 1);
  kitten.setDepth(MISSION_TARGET_Y + 30);

  return { rock, kitten };
}
