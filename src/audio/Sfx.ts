/**
 * Winzige WebAudio-Soundeffekte (kein Audio-Asset nötig). Reicht für
 * kindgerechtes akustisches Feedback bei Aktionen, Belohnungen & Fähigkeiten.
 */
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, startOffset: number, duration: number, type: OscillatorType, peakGain: number): void {
  const audio = getCtx();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = audio.currentTime + startOffset;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peakGain, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function unlockAudio(): void {
  getCtx();
}

export function sfxClick(): void {
  tone(520, 0, 0.08, 'square', 0.06);
}

export function sfxSelect(): void {
  tone(660, 0, 0.09, 'triangle', 0.07);
}

export function sfxAbility(): void {
  tone(220, 0, 0.14, 'sawtooth', 0.08);
  tone(440, 0.08, 0.18, 'square', 0.07);
  tone(660, 0.16, 0.22, 'triangle', 0.06);
}

export function sfxObstacleBreak(): void {
  tone(120, 0, 0.22, 'sawtooth', 0.1);
  tone(90, 0.05, 0.28, 'square', 0.08);
}

export function sfxSuccess(): void {
  tone(523, 0, 0.16, 'triangle', 0.08);
  tone(659, 0.12, 0.16, 'triangle', 0.08);
  tone(784, 0.24, 0.28, 'triangle', 0.09);
}

export function sfxStep(): void {
  tone(200 + Math.random() * 40, 0, 0.05, 'square', 0.02);
}
