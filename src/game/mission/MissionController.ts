import Phaser from 'phaser';
import { showDialogue } from '../../ui/dialogue';
import { sfxAbility, sfxObstacleBreak, sfxSuccess } from '../../audio/Sfx';
import { getSaveData, persist } from '../gameState';
import type { Role } from '../../types';
import type { RiggedActor } from '../actors/RiggedActor';
import type { Companion } from '../actors/Companion';
import { GROUND_TOP } from '../world/WorldLayout';
import { SCENERY_KEYS } from '../world/buildScenery';
import { MISSION_BEATS } from './beats';

const TARGET_TRIGGER_RANGE = 110;

export interface MissionControllerOptions {
  scene: Phaser.Scene;
  role: Role;
  playerActor: RiggedActor;
  companion: Companion;
  obstacles: Map<string, Phaser.GameObjects.Image>;
  kitten: Phaser.GameObjects.Image;
  onHudTextChange: (text: string) => void;
  onRewardEarned: (text: string) => void;
  setPlayerLocked: (locked: boolean) => void;
}

export class MissionController {
  private scene: Phaser.Scene;
  private role: Role;
  private playerActor: RiggedActor;
  private companion: Companion;
  private obstacles: Map<string, Phaser.GameObjects.Image>;
  private kitten: Phaser.GameObjects.Image;
  private onHudTextChange: (text: string) => void;
  private onRewardEarned: (text: string) => void;
  private setPlayerLocked: (locked: boolean) => void;
  private busy = false;
  private discoveredBeats = new Set<string>();

  constructor(opts: MissionControllerOptions) {
    this.scene = opts.scene;
    this.role = opts.role;
    this.playerActor = opts.playerActor;
    this.companion = opts.companion;
    this.obstacles = opts.obstacles;
    this.kitten = opts.kitten;
    this.onHudTextChange = opts.onHudTextChange;
    this.onRewardEarned = opts.onRewardEarned;
    this.setPlayerLocked = opts.setPlayerLocked;
    this.refreshHud();
  }

  get isBusy(): boolean {
    return this.busy;
  }

  start(): void {
    const stage = getSaveData().mission.stage;
    if (stage === 'not_started') {
      this.scene.time.delayedCall(500, () => {
        this.busy = true;
        this.setPlayerLocked(true);
        showDialogue(
          [
            'Willkommen bei den Hero Pets! Ein kleines Kätzchen hat sich weit im Wald verlaufen und braucht eure Hilfe.',
            'Der Weg dorthin ist versperrt – gleich mehrfach! Folgt dem Pfad und nutzt eure Hero-Pet-Kraft, sobald ihr auf ein Hindernis trefft.'
          ],
          () => {
            const save = getSaveData();
            save.mission.stage = 'in_progress';
            persist();
            this.busy = false;
            this.setPlayerLocked(false);
            this.refreshHud();
          }
        );
      });
    }
  }

  private currentBeat() {
    const { beatIndex } = getSaveData().mission;
    return MISSION_BEATS[beatIndex];
  }

  update(playerX: number, _playerY: number): void {
    if (this.busy) return;
    const mission = getSaveData().mission;
    if (mission.stage !== 'in_progress') return;

    const beat = this.currentBeat();
    if (beat) {
      if (!this.discoveredBeats.has(beat.id) && Math.abs(playerX - beat.obstacleX) < beat.triggerRange) {
        this.discoveredBeats.add(beat.id);
        this.busy = true;
        this.setPlayerLocked(true);
        showDialogue(beat.discoverDialogue, () => {
          this.busy = false;
          this.setPlayerLocked(false);
        });
      }
      return;
    }

    if (Math.abs(playerX - this.kitten.x) < TARGET_TRIGGER_RANGE) {
      this.completeMission();
    }
  }

  /** Wird aufgerufen, wenn die Fähigkeits-Taste gedrückt wird. */
  tryUseAbility(playerX: number): void {
    if (this.busy) return;
    const beat = this.currentBeat();

    if (!beat) {
      const performer = this.role === 'pet' ? this.playerActor : this.companion.actor;
      if (!performer.isPlayingAbility) {
        performer.playAbility(500);
        sfxAbility();
      }
      return;
    }

    if (Math.abs(playerX - beat.obstacleX) > beat.useRange) {
      this.onHudTextChange('Geht näher heran, um eure Kraft einzusetzen!');
      return;
    }

    this.busy = true;
    this.setPlayerLocked(true);
    sfxAbility();

    const obstacleImg = this.obstacles.get(beat.id);

    if (this.role === 'pet') {
      this.playerActor.playAbility(600);
    } else {
      const targetY = obstacleImg ? obstacleImg.y - 20 : beat.obstacleY - 20;
      this.companion.commandMoveTo(beat.obstacleX - 34, targetY, () => {
        this.companion.actor.playAbility(600);
      });
    }

    this.scene.time.delayedCall(650, () => this.clearBeat(beat.id));
  }

  private clearBeat(beatId: string): void {
    const beat = MISSION_BEATS.find((b) => b.id === beatId);
    if (!beat) return;
    const img = this.obstacles.get(beatId);

    sfxObstacleBreak();
    if (img) this.spawnBurst(img.x, img.y - 40, beat.breakColor);
    this.scene.cameras.main.shake(180, 0.006);
    if (img) {
      this.scene.tweens.add({
        targets: img,
        scale: 0,
        angle: 25,
        duration: 320,
        ease: 'Back.easeIn',
        onComplete: () => img.setVisible(false)
      });
    }

    this.scene.time.delayedCall(450, () => {
      const save = getSaveData();
      save.mission.beatIndex += 1;
      persist();
      if (this.role === 'hero') this.companion.resumeFollowing();
      this.busy = false;
      this.setPlayerLocked(false);
      showDialogue(beat.clearedDialogue, () => this.refreshHud());
      this.refreshHud();
    });
  }

  private completeMission(): void {
    this.busy = true;
    this.setPlayerLocked(true);
    showDialogue(
      ['Miau! Danke, dass ihr mich gerettet habt!', 'Hier, nehmt mein Geschenk – euer eigenes Hero-Pets-Abzeichen!'],
      () => {
        const save = getSaveData();
        const alreadyHadSymbol = save.appearance.accessories.symbol;
        save.appearance.accessories.symbol = true;
        if (!save.unlockedAccessories.includes('symbol')) save.unlockedAccessories.push('symbol');
        const pet = this.role === 'pet' ? this.playerActor : this.companion.actor;
        pet.setPartVisible('symbol', true);
        save.mission.stage = 'completed';
        persist();
        sfxSuccess();
        this.spawnBurst(this.kitten.x, this.kitten.y - 30, 0xffd23f);
        this.busy = false;
        this.setPlayerLocked(false);
        this.onRewardEarned(
          alreadyHadSymbol
            ? 'Ihr habt das Kätzchen gerettet! Es ist so glücklich wie ihr!'
            : 'Ihr habt das Kätzchen gerettet und euer Hero-Pets-Abzeichen freigeschaltet!'
        );
        this.refreshHud();
      }
    );
  }

  private spawnBurst(x: number, y: number, color: number): void {
    const particles = this.scene.add.particles(x, y, SCENERY_KEYS.particle, {
      speed: { min: 80, max: 220 },
      angle: { min: 220, max: 320 },
      gravityY: 420,
      lifespan: 600,
      scale: { start: 1.4, end: 0.2 },
      tint: color,
      quantity: 16,
      emitting: false
    });
    particles.setDepth(GROUND_TOP + 200);
    particles.explode(16);
    this.scene.time.delayedCall(700, () => particles.destroy());
  }

  refreshHud(): void {
    const mission = getSaveData().mission;
    if (mission.stage === 'not_started') {
      this.onHudTextChange('Willkommen bei Hero Pets!');
      return;
    }
    if (mission.stage === 'completed') {
      this.onHudTextChange('Mission erfüllt! Erkundet ruhig noch die Welt.');
      return;
    }
    const beat = MISSION_BEATS[mission.beatIndex];
    if (beat) {
      const step = mission.beatIndex + 1;
      this.onHudTextChange(
        `Hindernis ${step}/${MISSION_BEATS.length}: Folgt dem Weg und nutzt eure Kraft (Leertaste / ✨)!`
      );
    } else {
      this.onHudTextChange('Fast geschafft! Rettet das Kätzchen ganz in der Nähe!');
    }
  }
}
