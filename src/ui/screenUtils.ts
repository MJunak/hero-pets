const SCREEN_IDS = ['screen-start', 'screen-role', 'screen-animal', 'screen-creator', 'screen-game'] as const;
export type ScreenId = (typeof SCREEN_IDS)[number];

export function showScreen(id: ScreenId): void {
  for (const screenId of SCREEN_IDS) {
    const el = document.getElementById(screenId);
    if (!el) continue;
    if (screenId === id) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  }
}
