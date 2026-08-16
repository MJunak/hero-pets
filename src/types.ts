export type Role = 'hero' | 'pet';
export type AnimalId = 'horse' | 'fox';

export type FurColorId = 'chestnut' | 'cream' | 'charcoal' | 'snow' | 'sky' | 'blush';
export type EyeColorId = 'brown' | 'blue' | 'green' | 'amber' | 'violet';
export type AccentColorId = 'red' | 'blue' | 'gold' | 'purple' | 'green' | 'pink';
export type PatternId = 'plain' | 'patched';

export interface PetAppearance {
  furColor: FurColorId;
  eyeColor: EyeColorId;
  pattern: PatternId;
  accentColor: AccentColorId;
  accessories: {
    mask: boolean;
    cape: boolean;
    bandana: boolean;
    symbol: boolean;
  };
}

/** Gesamtfortschritt der Rettungsmission: eine Reihe von Hindernis-"Beats", danach das Finale. */
export type MissionStage = 'not_started' | 'in_progress' | 'completed';

export interface MissionProgress {
  stage: MissionStage;
  /** Index des nächsten noch nicht befreiten Hindernisses in `MISSION_BEATS`. */
  beatIndex: number;
  /** IDs bereits eingesammelter Sterne. */
  starsCollected: string[];
}

export const SAVE_VERSION = 2;

export interface SaveDataV2 {
  version: 2;
  role: Role;
  animal: AnimalId;
  petName: string;
  appearance: PetAppearance;
  mission: MissionProgress;
  unlockedAccessories: string[];
  createdAt: number;
  updatedAt: number;
}

export type SaveData = SaveDataV2;
