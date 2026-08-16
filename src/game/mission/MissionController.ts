import Phaser from 'phaser';
import { showDialogue } from '../../ui/dialogue';
import { sfxAbility, sfxObstacleBreak, sfxSuccess } from '../../audio/Sfx';
import { getSaveData, persist } from '../gameState';
import type { MissionStage, Role } from '../../types';
import type { RiggedActor } from '../actors/RiggedActor';
import type { Companion } from '../actors/Companion';
import { OBSTACLE_X, GROUND_TOP } from '../world/WorldLayout';
import { SCENERY_KEYS } from '../world/buildScenery';

const OBSTACLE_TRIGGER_RANGE = 150;
const OBSTACLE_USE_RANGE = 180;
const TARGET_TRIGGER_RANGE = 110;

export interface MissionControllerOptions {
  scene: Phaser.Scene;
  role: Role;
  playerActor: RiggedActor;
  companion: Companion;
  rock: Phaser.GameObjects.Image;
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
  private rock: Phaser.GameObjects.Image;
  private kitten: Phaser.GameObjects.Image;
  private onHudTextChange: (text: string) => void;
  private onRewardEarned: (text: string) => void;
  private setPlayerLocked: (locked: boolean) => void;
  private busy = false;

  constructor(opts: MissionControllerOptions) {
    this.scene = opts.scene;
    this.role = opts.role;
    this.playerActor = opts.playerActor;
    this.companion = opts.companion;
    this.rock = opts.rock;
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
            'Willkommen bei den Hero Pets! Ein kleines Kätzchen steckt im Wald fest und braucht eure Hilfe.',
            'Folgt dem Weg durch den Wald bis zur Brücke!'
          ],
          () => {
            this.setStage('accepted');
            this.busy = false;
            this.setPlayerLocked(false);
          }
        );
      });
    }
  }

  update(playerX: number, _playerY: number): void {
    if (this.busy) return;
    const stage = getSaveData().mission.stage;

    if (stage === 'accepted' && Math.abs(playerX - OBSTACLE_X) < OBSTACLE_TRIGGER_RANGE) {
      this.busy = true;
      this.setPlayerLocked(true);
      showDialogue(
        [
          'Ein riesiger Felsen blockiert die Brücke!',
          'Hört ihr das? Auf der anderen Seite miaut jemand um Hilfe!',
          'Setzt eure Hero-Pet-Kraft ein, um den Weg frei zu machen!'
        ],
        () => {
          this.setStage('reached_obstacle');
          this.busy = false;
          this.setPlayerLocked(false);
        }
      );
    }

    if (stage === 'obstacle_cleared' && Math.abs(playerX - this.kitten.x) < TARGET_TRIGGER_RANGE) {
      this.completeMission();
    }
  }

  /** Wird aufgerufen, wenn die Fähigkeits-Taste gedrückt wird. */
  tryUseAbility(playerX: number): void {
    if (this.busy) return;
    const stage = getSaveData().mission.stage;

    if (stage !== 'reached_obstacle') {
      // Freies Ausprobieren der Kraft außerhalb der Mission: Der Held "ruft"
      // das Hero Pet, welches seine Fähigkeit vorführt.
      const performer = this.role === 'pet' ? this.playerActor : this.companion.actor;
      if (!performer.isPlayingAbility) {
        performer.playAbility(500);
        sfxAbility();
      }
      return;
    }

    if (Math.abs(playerX - OBSTACLE_X) > OBSTACLE_USE_RANGE) {
      this.onHudTextChange('Geht näher zum Felsen, um eure Kraft einzusetzen!');
      return;
    }

    this.busy = true;
    this.setPlayerLocked(true);
    sfxAbility();

    if (this.role === 'pet') {
      this.playerActor.playAbility(600);
    } else {
      this.companion.commandMoveTo(OBSTACLE_X - 34, this.rock.y - 20, () => {
        this.companion.actor.playAbility(600);
      });
    }

    this.scene.time.delayedCall(650, () => this.breakRock());
  }

  private breakRock(): void {
    sfxObstacleBreak();
    this.spawnBurst(this.rock.x, this.rock.y - 40, 0x8a8a95);
    this.scene.cameras.main.shake(180, 0.006);
    this.scene.tweens.add({
      targets: this.rock,
      scale: 0,
      angle: 25,
      duration: 320,
      ease: 'Back.easeIn',
      onComplete: () => this.rock.setVisible(false)
    });

    this.scene.time.delayedCall(450, () => {
      this.setStage('obstacle_cleared');
      if (this.role === 'hero') this.companion.resumeFollowing();
      this.busy = false;
      this.setPlayerLocked(false);
      showDialogue('Super! Der Weg ist frei! Lauft über die Brücke zum Kätzchen!');
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
        this.setStage('completed');
        sfxSuccess();
        this.spawnBurst(this.kitten.x, this.kitten.y - 30, 0xffd23f);
        this.busy = false;
        this.setPlayerLocked(false);
        this.onRewardEarned(
          alreadyHadSymbol
            ? 'Ihr habt das Kätzchen gerettet! Es ist so glücklich wie ihr!'
            : 'Ihr habt das Kätzchen gerettet und euer Hero-Pets-Abzeichen freigeschaltet!'
        );
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

  private setStage(stage: MissionStage): void {
    getSaveData().mission.stage = stage;
    persist();
    this.refreshHud();
  }

  private refreshHud(): void {
    const stage = getSaveData().mission.stage;
    const texts: Record<MissionStage, string> = {
      not_started: 'Willkommen bei Hero Pets!',
      accepted: 'Folgt dem Weg durch den Wald zur Brücke.',
      reached_obstacle: 'Nutzt eure Kraft (Leertaste / ✨), um den Felsen zu entfernen!',
      obstacle_cleared: 'Rettet das Kätzchen auf der anderen Seite der Brücke!',
      completed: 'Mission erfüllt! Erkundet ruhig noch die Welt.'
    };
    this.onHudTextChange(texts[stage]);
  }
}
