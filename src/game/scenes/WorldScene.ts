import Phaser from 'phaser';
import { getSaveData, persist } from '../gameState';
import { HERO_TEX_PREFIX, PET_TEX_PREFIX } from './BootScene';
import { RiggedActor } from '../actors/RiggedActor';
import { Companion } from '../actors/Companion';
import { composeHero, composePet, visiblePartsFor } from '../../pixelart/compose';
import { starCollectibleCanvas } from '../../pixelart/scenery';
import { InputController } from '../../input/InputController';
import { MissionController } from '../mission/MissionController';
import { MISSION_BEATS } from '../mission/beats';
import { CollectibleManager } from '../mission/collectibles';
import { buildScenery, preloadSceneryTextures, SCENERY_KEYS } from '../world/buildScenery';
import { GROUND_BOTTOM, GROUND_TOP, SPAWN_X, SPAWN_Y, WORLD_WIDTH } from '../world/WorldLayout';
import { isDialogueOpen, showDialogue } from '../../ui/dialogue';
import { sfxSuccess } from '../../audio/Sfx';

const PLAYER_SPEED = 210;
const FOOT_OFFSET_Y = 132;
const DUST_INTERVAL_MS = 110;

export class WorldScene extends Phaser.Scene {
  private player!: RiggedActor;
  private companion!: Companion;
  private controls!: InputController;
  private mission!: MissionController;
  private collectibles!: CollectibleManager;
  private locked = false;
  private facing: 1 | -1 = 1;
  private role!: 'hero' | 'pet';
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private dustTimer = 0;

  constructor() {
    super('world');
  }

  create(): void {
    const save = getSaveData();
    this.role = save.role;
    preloadSceneryTextures(this, save.appearance.accentColor);

    const missionCompleted = save.mission.stage === 'completed';
    const { obstacles, kitten } = buildScenery(this, save.mission.beatIndex, missionCompleted);

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
      obstacles,
      kitten,
      onHudTextChange: (text) => this.updateHud(text),
      onRewardEarned: (text) => this.showReward(text),
      setPlayerLocked: (locked) => {
        this.locked = locked;
      }
    });
    this.mission.start();

    this.collectibles = new CollectibleManager(
      this,
      (collected, total) => this.updateStarCount(collected, total),
      () => this.onAllStarsCollected()
    );

    this.dustEmitter = this.add.particles(0, 0, SCENERY_KEYS.particle, {
      speed: { min: 15, max: 45 },
      angle: { min: 200, max: 340 },
      gravityY: 260,
      lifespan: 260,
      scale: { start: 0.7, end: 0 },
      tint: 0xcac37a,
      quantity: 1,
      emitting: false
    });
    this.dustEmitter.setDepth(50000);

    this.setupStarIcon();
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
      nextX = Math.min(nextX, this.wallX());

      const moving = Math.abs(nextX - this.player.x) > 0.05 || Math.abs(nextY - this.player.y) > 0.05;
      if (moving) {
        if (nextX - this.player.x > 0.01) this.facing = 1;
        else if (nextX - this.player.x < -0.01) this.facing = -1;
        this.player.setFacing(this.facing);
      }
      this.player.x = nextX;
      this.player.y = nextY;
      this.player.setMoving(moving);

      this.dustTimer -= delta;
      if (moving && this.dustTimer <= 0) {
        this.dustEmitter.emitParticleAt(this.player.x, this.player.y + FOOT_OFFSET_Y);
        this.dustTimer = DUST_INTERVAL_MS;
      }

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
    this.collectibles.update(this.player.x, this.player.y);
  }

  /** Der Weg ist immer nur am jeweils nächsten, noch nicht befreiten Hindernis blockiert. */
  private wallX(): number {
    const beat = MISSION_BEATS[getSaveData().mission.beatIndex];
    return beat ? beat.obstacleX - 30 : WORLD_WIDTH - 40;
  }

  private onAllStarsCollected(): void {
    const save = getSaveData();
    save.appearance.accessories.mask = true;
    save.appearance.accessories.cape = true;
    save.appearance.accessories.bandana = true;
    save.appearance.accessories.symbol = true;
    persist();
    const pet = this.role === 'pet' ? this.player : this.companion.actor;
    pet.setPartVisible('mask', true);
    pet.setPartVisible('cape', true);
    pet.setPartVisible('bandana', true);
    pet.setPartVisible('symbol', true);
    sfxSuccess();
    showDialogue('Alle Sterne gesammelt! Euer Hero Pet trägt jetzt die volle Superhelden-Ausrüstung!');
  }

  private updateHud(text: string): void {
    const el = document.getElementById('hud-mission');
    if (el) el.textContent = text;
  }

  private updateStarCount(collected: number, total: number): void {
    const el = document.getElementById('hud-star-count');
    if (el) el.textContent = `${collected}/${total}`;
  }

  private setupStarIcon(): void {
    const el = document.getElementById('hud-star-icon');
    if (el && !el.querySelector('canvas')) {
      el.appendChild(starCollectibleCanvas());
    }
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
