import { sfxClick } from '../audio/Sfx';

const box = document.getElementById('dialogue-box')!;
const textEl = document.getElementById('dialogue-text')!;
const nextBtn = document.getElementById('dialogue-next')!;

let queue: string[] = [];
let onDone: (() => void) | null = null;

function showNext(): void {
  const line = queue.shift();
  if (line === undefined) {
    box.setAttribute('hidden', '');
    const done = onDone;
    onDone = null;
    done?.();
    return;
  }
  textEl.textContent = line;
}

nextBtn.addEventListener('click', () => {
  sfxClick();
  showNext();
});

export function showDialogue(lines: string | string[], done?: () => void): void {
  queue = Array.isArray(lines) ? [...lines] : [lines];
  onDone = done ?? null;
  box.removeAttribute('hidden');
  showNext();
}

export function isDialogueOpen(): boolean {
  return !box.hasAttribute('hidden');
}
