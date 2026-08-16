import Phaser from 'phaser';

export interface MoveVector {
  x: number;
  y: number;
}

/**
 * Bündelt Tastatur- und Touch-Eingaben zu einem einzigen Bewegungsvektor plus
 * einer Fähigkeits-Taste. Die virtuelle Steuerung besteht aus normalen DOM-
 * Elementen (siehe index.html) statt einem Phaser-UI-Overlay, weil Touch-
 * Gesten auf einfachen HTML-Elementen zuverlässiger und leichter zu stylen
 * sind als in Canvas/WebGL.
 */
export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private skillKey: Phaser.Input.Keyboard.Key;

  private joystickVector: MoveVector = { x: 0, y: 0 };
  private joystickActive = false;
  private joystickPointerId: number | null = null;

  private skillPressedFlag = false;

  private joystickEl = document.getElementById('touch-joystick')!;
  private joystickStickEl = document.getElementById('touch-joystick-stick')!;
  private skillBtnEl = document.getElementById('touch-skill-btn')!;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = {
      up: keyboard.addKey('W'),
      down: keyboard.addKey('S'),
      left: keyboard.addKey('A'),
      right: keyboard.addKey('D')
    };
    this.skillKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.setupJoystick();
    this.setupSkillButton();
    this.detectTouch();
  }

  private detectTouch(): void {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!hasTouch) document.body.classList.add('no-touch');
  }

  private setupJoystick(): void {
    const radius = 46;

    const onDown = (ev: PointerEvent) => {
      this.joystickActive = true;
      this.joystickPointerId = ev.pointerId;
      this.joystickEl.setPointerCapture(ev.pointerId);
      updateFromEvent(ev);
    };
    const onMove = (ev: PointerEvent) => {
      if (!this.joystickActive || ev.pointerId !== this.joystickPointerId) return;
      updateFromEvent(ev);
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== this.joystickPointerId) return;
      this.joystickActive = false;
      this.joystickPointerId = null;
      this.joystickVector = { x: 0, y: 0 };
      this.joystickStickEl.style.transform = 'translate(-50%, -50%)';
    };

    const updateFromEvent = (ev: PointerEvent) => {
      const rect = this.joystickEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = ev.clientX - cx;
      let dy = ev.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        dx = (dx / dist) * radius;
        dy = (dy / dist) * radius;
      }
      this.joystickVector = { x: dx / radius, y: dy / radius };
      this.joystickStickEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    };

    this.joystickEl.addEventListener('pointerdown', onDown);
    this.joystickEl.addEventListener('pointermove', onMove);
    this.joystickEl.addEventListener('pointerup', onUp);
    this.joystickEl.addEventListener('pointercancel', onUp);
  }

  private setupSkillButton(): void {
    this.skillBtnEl.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      this.skillPressedFlag = true;
    });
  }

  getMoveVector(): MoveVector {
    let x = 0;
    let y = 0;
    if (this.cursors.left?.isDown || this.wasd.left.isDown) x -= 1;
    if (this.cursors.right?.isDown || this.wasd.right.isDown) x += 1;
    if (this.cursors.up?.isDown || this.wasd.up.isDown) y -= 1;
    if (this.cursors.down?.isDown || this.wasd.down.isDown) y += 1;

    if (x === 0 && y === 0 && this.joystickActive) {
      x = Math.abs(this.joystickVector.x) > 0.15 ? this.joystickVector.x : 0;
      y = Math.abs(this.joystickVector.y) > 0.15 ? this.joystickVector.y : 0;
    }

    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    return { x, y };
  }

  /** Liefert true genau einmal pro Tastendruck (Skill-Taste oder Touch-Button). */
  consumeSkillPressed(): boolean {
    const keyboardPressed = Phaser.Input.Keyboard.JustDown(this.skillKey);
    const pressed = keyboardPressed || this.skillPressedFlag;
    this.skillPressedFlag = false;
    return pressed;
  }
}
