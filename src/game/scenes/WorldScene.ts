import Phaser from 'phaser';
import { getSaveData } from '../gameState';
import { HERO_TEX_PREFIX, PET_TEX_PREFIX } from './BootScene';
import { RiggedActor } from '../actors/RiggedActor';
import { Companion } from '../actors/Companion';
import { composeHero, composePet, visiblePartsFor } from '../../pixelart/compose';
import { InputController } from '../../input/InputController';
import { MissionController } from '../mission/MissionController';
import { buildScenery, preloadSceneryTextures } from '../world/buildScenery';
import { GROUND_BOTTOM, GROUND_TOP, OBSTACLE_X, SPAWN_X, SPAWN_Y, WORLD_WIDTH } from '../world/WorldLayout';
import { isDialogueOpen } from '../../ui/dialogue';

const PLAYER_SPEED = 210;

export class WorldScene extends Phaser.Scene {
  private player!: RiggedActor;
  private companion!: Companion;
  private controls!: InputController;
  private mission!: MissionController;
  private locked = false;
  private facing: 1 | -1 = 1;

  constructor() {
    super('world');
  }

  create(): void {
    const save = getSaveData();
    preloadSceneryTextures(this, save.appearance.accentColor);

    const obstacleCleared = save.mission.stage === 'obstacle_cleared' || save.mission.stage === 'completed';
    const { rock, kitten } = buildScenery(this, obstacleCleared);

    const petBundle = composePet(save.animal, save.appearance);
    const heroBundle = composeHero(save.appearance.accentColor);
    const petVisible = visiblePartsFor(save.appearance);
    const heroVisible = visiblePartsFor(null);

    const petActor = new RiggedActor(this, 0, 0, {
      bundle: petBundle.bundle,
      textureKeyPrefix: PET_TEX_PREFIX,
      visibleParts: petVisible
    });
    const heroActor = new RiggedActor(this, 0, 0, {
      bundle: heroBundle.bundle,
      textureKeyPrefix: HERO_TEX_PREFIX,
      visibleParts: heroVisible
    });

    if (save.role === 'pet') {
      this.player = petActor;
      this.companion = new Companion(heroActor, SPAWN_X - 80, SPAWN_Y);
    } else {
      this.player = heroActor;
      this.companion = new Companion(petActor, SPAWN_X - 80, SPAWN_Y);
    }
    this.player.setPosition(SPAWN_X, SPAWN_Y);

    const cam = this.cameras.main;
    const updateCamBounds = () => cam.setBounds(0, 0, WORLD_WIDTH, this.scale.height);
    updateCamBounds();
    cam.centerOn(this.player.x, this.player.y);
    cam.startFollow(this.player, true, 0.09, 0.09);
    cam.setDeadzone(120, 80);
    this.scale.on('resize', updateCamBounds);
    this.events.once('shutdown', () => this.scale.off('resize', updateCamBounds));

    this.controls = new InputController(this);

    this.mission = new MissionController({
      scene: this,
      role: save.role,
      playerActor: this.player,
      companion: this.companion,
      rock,
      kitten,
      onHudTextChange: (text) => this.updateHud(text),
      onRewardEarned: (text) => this.showReward(text),
      setPlayerLocked: (locked) => {
        this.locked = locked;
      }
    });
    this.mission.start();

    this.setupPauseMenu();
    this.setupRewardOverlay();

    this.events.on('shutdown', () => this.teardownDom());
  }

  update(time: number, delta: number): void {
    const dialogueOpen = isDialogueOpen();
    const canMove = !this.locked && !dialogueOpen && !this.player.isPlayingAbility;

    if (canMove) {
      const move = this.controls.getMoveVector();
      let nextX = this.player.x + move.x * PLAYER_SPEED * (delta / 1000);
      let nextY = this.player.y + move.y * PLAYER_SPEED * (delta / 1000);

      nextX = Phaser.Math.Clamp(nextX, 40, WORLD_WIDTH - 40);
      nextY = Phaser.Math.Clamp(nextY, GROUND_TOP + 50, GROUND_BOTTOM - 30);

      const stage = getSaveData().mission.stage;
      if (stage !== 'obstacle_cleared' && stage !== 'completed') {
        nextX = Math.min(nextX, OBSTACLE_X - 30);
      }

      const moving = Math.abs(nextX - this.player.x) > 0.05 || Math.abs(nextY - this.player.y) > 0.05;
      if (moving) {
        if (nextX - this.player.x > 0.01) this.facing = 1;
        else if (nextX - this.player.x < -0.01) this.facing = -1;
        this.player.setFacing(this.facing);
      }
      this.player.x = nextX;
      this.player.y = nextY;
      this.player.setMoving(moving);

      if (this.controls.consumeSkillPressed()) {
        this.mission.tryUseAbility(this.player.x);
      }
    } else {
      this.player.setMoving(false);
      if (!dialogueOpen && !this.locked) this.controls.consumeSkillPressed();
    }

    this.player.setDepth(this.player.y);
    this.player.update(time);

    this.companion.update(time, delta, {
      x: this.player.x,
      y: this.player.y,
      facing: this.facing
    });

    this.mission.update(this.player.x, this.player.y);
  }

  private updateHud(text: string): void {
    const el = document.getElementById('hud-mission');
    if (el) el.textContent = text;
  }

  private showReward(text: string): void {
    const overlay = document.getElementById('reward-overlay')!;
    const textEl = document.getElementById('reward-text')!;
    textEl.textContent = text;
    overlay.removeAttribute('hidden');
  }

  private setupRewardOverlay(): void {
    const btn = document.getElementById('btn-reward-continue')!;
    const overlay = document.getElementById('reward-overlay')!;
    const handler = () => overlay.setAttribute('hidden', '');
    btn.addEventListener('click', handler);
    this.events.once('shutdown', () => btn.removeEventListener('click', handler));
  }

  private setupPauseMenu(): void {
    const menuBtn = document.getElementById('hud-menu-btn')!;
    const overlay = document.getElementById('pause-overlay')!;
    const resumeBtn = document.getElementById('btn-resume')!;
    const quitBtn = document.getElementById('btn-quit-to-menu')!;

    const openPause = () => {
      overlay.removeAttribute('hidden');
      this.scene.pause();
    };
    const closePause = () => {
      overlay.setAttribute('hidden', '');
      this.scene.resume();
    };
    const quit = () => {
      overlay.setAttribute('hidden', '');
      this.scene.resume();
      document.dispatchEvent(new CustomEvent('heropets:quit-to-menu'));
    };

    menuBtn.addEventListener('click', openPause);
    resumeBtn.addEventListener('click', closePause);
    quitBtn.addEventListener('click', quit);

    this.events.once('shutdown', () => {
      menuBtn.removeEventListener('click', openPause);
      resumeBtn.removeEventListener('click', closePause);
      quitBtn.removeEventListener('click', quit);
    });
  }

  private teardownDom(): void {
    document.getElementById('pause-overlay')?.setAttribute('hidden', '');
    document.getElementById('reward-overlay')?.setAttribute('hidden', '');
    document.getElementById('dialogue-box')?.setAttribute('hidden', '');
  }
}
