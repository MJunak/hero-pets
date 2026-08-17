import Phaser from 'phaser';

/**
 * Bündelt Tastatur- und Touch-Eingaben zu horizontaler Bewegung plus Sprung-
 * und Fähigkeits-Tasten. Die virtuelle Steuerung besteht aus normalen DOM-
 * Elementen (siehe index.html) statt einem Phaser-UI-Overlay, weil Touch-
 * Gesten auf einfachen HTML-Elementen zuverlässiger und leichter zu stylen
 * sind als in Canvas/WebGL.
 */
export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: Record<'up' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private jumpKey: Phaser.Input.Keyboard.Key;
  private abilityKey: Phaser.Input.Keyboard.Key;

  private joystickX = 0;
  private joystickActive = false;
  private joystickPointerId: number | null = null;

  private jumpPressedFlag = false;
  private skillPressedFlag = false;

  private joystickEl = document.getElementById('touch-joystick')!;
  private joystickStickEl = document.getElementById('touch-joystick-stick')!;
  private jumpBtnEl = document.getElementById('touch-jump-btn')!;
  private skillBtnEl = document.getElementById('touch-skill-btn')!;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = {
      up: keyboard.addKey('W'),
      left: keyboard.addKey('A'),
      right: keyboard.addKey('D')
    };
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.abilityKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    this.setupJoystick();
    this.setupJumpButton();
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
      this.joystickX = 0;
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
      this.joystickX = dx / radius;
      this.joystickStickEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    };

    this.joystickEl.addEventListener('pointerdown', onDown);
    this.joystickEl.addEventListener('pointermove', onMove);
    this.joystickEl.addEventListener('pointerup', onUp);
    this.joystickEl.addEventListener('pointercancel', onUp);
  }

  private setupJumpButton(): void {
    this.jumpBtnEl.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      this.jumpPressedFlag = true;
    });
  }

  private setupSkillButton(): void {
    this.skillBtnEl.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      this.skillPressedFlag = true;
    });
  }

  /** Horizontale Bewegung, -1 (links) bis 1 (rechts). Keine Vertikal-Steuerung mehr – das übernimmt der Sprung. */
  getMoveX(): number {
    let x = 0;
    if (this.cursors.left?.isDown || this.wasd.left.isDown) x -= 1;
    if (this.cursors.right?.isDown || this.wasd.right.isDown) x += 1;

    if (x === 0 && this.joystickActive && Math.abs(this.joystickX) > 0.15) {
      x = this.joystickX;
    }

    return Phaser.Math.Clamp(x, -1, 1);
  }

  /** Liefert true genau einmal pro Tastendruck (Sprung-Taste, Pfeil hoch/W oder Touch-Button). */
  consumeJumpPressed(): boolean {
    const keyboardPressed =
      Phaser.Input.Keyboard.JustDown(this.jumpKey) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
      (this.cursors.up ? Phaser.Input.Keyboard.JustDown(this.cursors.up) : false);
    const pressed = keyboardPressed || this.jumpPressedFlag;
    this.jumpPressedFlag = false;
    return pressed;
  }

  /** Liefert true genau einmal pro Tastendruck (Fähigkeits-Taste oder Touch-Button). */
  consumeSkillPressed(): boolean {
    const keyboardPressed = Phaser.Input.Keyboard.JustDown(this.abilityKey);
    const pressed = keyboardPressed || this.skillPressedFlag;
    this.skillPressedFlag = false;
    return pressed;
  }
}
