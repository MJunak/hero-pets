import { SAVE_VERSION, type SaveData } from '../types';

const STORAGE_KEY = 'hero-pets:save';

export function loadSave(): SaveData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed as SaveData;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData): void {
  data.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createDefaultSave(): SaveData {
  const now = Date.now();
  return {
    version: SAVE_VERSION,
    role: 'pet',
    animal: 'horse',
    petName: '',
    appearance: {
      furColor: 'chestnut',
      eyeColor: 'brown',
      pattern: 'plain',
      accentColor: 'red',
      accessories: {
        mask: false,
        cape: false,
        bandana: false,
        symbol: false
      }
    },
    mission: { stage: 'not_started', beatIndex: 0, starsCollected: [] },
    unlockedAccessories: [],
    createdAt: now,
    updatedAt: now
  };
}
