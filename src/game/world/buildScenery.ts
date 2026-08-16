import Phaser from 'phaser';
import {
  bridgePlankCanvas,
  bushCanvas,
  cloudCanvas,
  flowerCanvas,
  groundTileCanvas,
  hqFlagCanvas,
  kittenCanvas,
  logCanvas,
  particleDotCanvas,
  pathTileCanvas,
  pineTreeCanvas,
  pondCanvas,
  rockCanvas,
  rockDecorCanvas,
  signCanvas,
  starCollectibleCanvas,
  thicketCanvas,
  treeCanvas
} from '../../pixelart/scenery';
import type { AccentColorId } from '../../types';
import { MISSION_BEATS } from '../mission/beats';
import {
  BRIDGE_END_X,
  BRIDGE_START_X,
  GROUND_BOTTOM,
  GROUND_TOP,
  HORIZON_Y,
  HQ_X,
  MISSION_TARGET_X,
  MISSION_TARGET_Y,
  WORLD_WIDTH
} from './WorldLayout';

const SCENERY_KEYS = {
  tree0: 'scenery-tree0',
  tree1: 'scenery-tree1',
  pine: 'scenery-pine',
  bush: 'scenery-bush',
  cloud: 'scenery-cloud',
  rock: 'scenery-rock',
  rockDecor: 'scenery-rock-decor',
  log: 'scenery-log',
  thicket: 'scenery-thicket',
  pond: 'scenery-pond',
  flowerRed: 'scenery-flower-red',
  flowerYellow: 'scenery-flower-yellow',
  flowerPurple: 'scenery-flower-purple',
  plank: 'scenery-plank',
  ground: 'scenery-ground',
  path: 'scenery-path',
  kitten: 'scenery-kitten',
  flag: 'scenery-flag',
  sign: 'scenery-sign',
  particle: 'scenery-particle',
  star: 'scenery-star'
} as const;

export { SCENERY_KEYS };

export function preloadSceneryTextures(scene: Phaser.Scene, accent: AccentColorId): void {
  const add = (key: string, canvas: HTMLCanvasElement) => {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, canvas);
  };
  add(SCENERY_KEYS.tree0, treeCanvas(0));
  add(SCENERY_KEYS.tree1, treeCanvas(1));
  add(SCENERY_KEYS.pine, pineTreeCanvas());
  add(SCENERY_KEYS.bush, bushCanvas());
  add(SCENERY_KEYS.cloud, cloudCanvas());
  add(SCENERY_KEYS.rock, rockCanvas());
  add(SCENERY_KEYS.rockDecor, rockDecorCanvas());
  add(SCENERY_KEYS.log, logCanvas());
  add(SCENERY_KEYS.thicket, thicketCanvas());
  add(SCENERY_KEYS.pond, pondCanvas());
  add(SCENERY_KEYS.flowerRed, flowerCanvas('red'));
  add(SCENERY_KEYS.flowerYellow, flowerCanvas('yellow'));
  add(SCENERY_KEYS.flowerPurple, flowerCanvas('purple'));
  add(SCENERY_KEYS.plank, bridgePlankCanvas());
  add(SCENERY_KEYS.ground, groundTileCanvas());
  add(SCENERY_KEYS.path, pathTileCanvas());
  add(SCENERY_KEYS.kitten, kittenCanvas());
  add(SCENERY_KEYS.flag, hqFlagCanvas(accent));
  add(SCENERY_KEYS.sign, signCanvas());
  add(SCENERY_KEYS.particle, particleDotCanvas());
  add(SCENERY_KEYS.star, starCollectibleCanvas());
}

export interface SceneryHandles {
  obstacles: Map<string, Phaser.GameObjects.Image>;
  kitten: Phaser.GameObjects.Image;
}

const BEAT_TEXTURE: Record<string, string> = {
  rock: SCENERY_KEYS.rock,
  log: SCENERY_KEYS.log,
  thicket: SCENERY_KEYS.thicket
};

function scatter(
  scene: Phaser.Scene,
  positions: { x: number; y: number; key: string }[]
): void {
  for (const { x, y, key } of positions) {
    scene.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
  }
}

export function buildScenery(scene: Phaser.Scene, beatIndexAlreadyCleared: number, missionCompleted: boolean): SceneryHandles {
  const sky = scene.add.graphics().setScrollFactor(0).setDepth(-200);
  const drawSky = () => {
    sky.clear();
    sky.fillGradientStyle(0x8fd3f4, 0x8fd3f4, 0xd7f0fb, 0xd7f0fb, 1);
    sky.fillRect(0, 0, scene.scale.width, scene.scale.height);
  };
  drawSky();
  scene.scale.on('resize', drawSky);
  scene.events.once('shutdown', () => scene.scale.off('resize', drawSky));

  const cloudCount = Math.round(WORLD_WIDTH / 420);
  for (let i = 0; i < cloudCount; i++) {
    const x = 120 + i * 420 + Phaser.Math.Between(-60, 60);
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

  // Zone 1: Wald (Start bis zur Brücke)
  scatter(scene, [
    { x: 340, y: GROUND_TOP - 6, key: SCENERY_KEYS.tree0 },
    { x: 470, y: GROUND_TOP + 8, key: SCENERY_KEYS.tree1 },
    { x: 610, y: GROUND_TOP - 4, key: SCENERY_KEYS.tree0 },
    { x: 750, y: GROUND_TOP + 10, key: SCENERY_KEYS.tree1 },
    { x: 890, y: GROUND_TOP - 8, key: SCENERY_KEYS.tree0 },
    { x: 480, y: GROUND_BOTTOM - 18, key: SCENERY_KEYS.bush },
    { x: 760, y: GROUND_BOTTOM - 24, key: SCENERY_KEYS.bush },
    { x: 900, y: GROUND_TOP + 40, key: SCENERY_KEYS.rockDecor }
  ]);

  // Zone 2: Wiese mit Teich (nach der Brücke)
  scatter(scene, [
    { x: 1230, y: GROUND_TOP + 6, key: SCENERY_KEYS.tree1 },
    { x: 1300, y: GROUND_BOTTOM - 30, key: SCENERY_KEYS.flowerRed },
    { x: 1360, y: GROUND_BOTTOM - 12, key: SCENERY_KEYS.flowerYellow },
    { x: 1440, y: GROUND_BOTTOM - 26, key: SCENERY_KEYS.flowerPurple },
    { x: 1700, y: GROUND_BOTTOM - 14, key: SCENERY_KEYS.flowerRed },
    { x: 1800, y: GROUND_BOTTOM - 28, key: SCENERY_KEYS.flowerYellow },
    { x: 1900, y: GROUND_BOTTOM - 16, key: SCENERY_KEYS.flowerPurple },
    { x: 1650, y: GROUND_TOP + 50, key: SCENERY_KEYS.rockDecor },
    { x: 1950, y: GROUND_TOP + 4, key: SCENERY_KEYS.tree0 }
  ]);
  scene.add.image(1560, GROUND_BOTTOM - 5, SCENERY_KEYS.pond).setOrigin(0.5, 1).setDepth(GROUND_TOP + 10);

  // Zone 3: Nadelwald (nach dem Baumstamm)
  scatter(scene, [
    { x: 2280, y: GROUND_TOP - 6, key: SCENERY_KEYS.pine },
    { x: 2420, y: GROUND_TOP + 10, key: SCENERY_KEYS.pine },
    { x: 2560, y: GROUND_TOP - 4, key: SCENERY_KEYS.pine },
    { x: 2700, y: GROUND_TOP + 8, key: SCENERY_KEYS.pine },
    { x: 2850, y: GROUND_TOP - 8, key: SCENERY_KEYS.pine },
    { x: 2980, y: GROUND_TOP + 6, key: SCENERY_KEYS.pine },
    { x: 2350, y: GROUND_BOTTOM - 20, key: SCENERY_KEYS.bush },
    { x: 2650, y: GROUND_BOTTOM - 22, key: SCENERY_KEYS.bush },
    { x: 2900, y: GROUND_BOTTOM - 16, key: SCENERY_KEYS.bush },
    { x: 2500, y: GROUND_TOP + 45, key: SCENERY_KEYS.rockDecor }
  ]);

  // Zone 4: Lichtung (Finale, nach dem Dickicht)
  scatter(scene, [
    { x: 3350, y: GROUND_TOP - 4, key: SCENERY_KEYS.tree1 },
    { x: 3550, y: GROUND_TOP + 8, key: SCENERY_KEYS.tree0 },
    { x: 3420, y: GROUND_BOTTOM - 24, key: SCENERY_KEYS.flowerYellow },
    { x: 3600, y: GROUND_BOTTOM - 14, key: SCENERY_KEYS.flowerRed },
    { x: 3800, y: GROUND_BOTTOM - 26, key: SCENERY_KEYS.flowerPurple },
    { x: 3950, y: GROUND_BOTTOM - 16, key: SCENERY_KEYS.flowerYellow },
    { x: 4100, y: GROUND_BOTTOM - 22, key: SCENERY_KEYS.flowerRed },
    { x: 4180, y: GROUND_TOP - 6, key: SCENERY_KEYS.tree1 },
    { x: 4380, y: GROUND_TOP + 4, key: SCENERY_KEYS.tree0 },
    { x: 3700, y: GROUND_TOP + 40, key: SCENERY_KEYS.rockDecor }
  ]);

  const obstacles = new Map<string, Phaser.GameObjects.Image>();
  MISSION_BEATS.forEach((beat, index) => {
    const img = scene.add.image(beat.obstacleX, beat.obstacleY, BEAT_TEXTURE[beat.id]).setOrigin(0.5, 1);
    img.setDepth(beat.obstacleY);
    if (index < beatIndexAlreadyCleared || missionCompleted) img.setVisible(false);
    obstacles.set(beat.id, img);
  });

  const kitten = scene.add.image(MISSION_TARGET_X, MISSION_TARGET_Y + 30, SCENERY_KEYS.kitten).setOrigin(0.5, 1);
  kitten.setDepth(MISSION_TARGET_Y + 30);

  return { obstacles, kitten };
}
