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

export type MissionStage =
  | 'not_started'
  | 'accepted'
  | 'reached_obstacle'
  | 'obstacle_cleared'
  | 'completed';

export interface MissionProgress {
  stage: MissionStage;
}

export const SAVE_VERSION = 1;

export interface SaveDataV1 {
  version: 1;
  role: Role;
  animal: AnimalId;
  petName: string;
  appearance: PetAppearance;
  mission: MissionProgress;
  unlockedAccessories: string[];
  createdAt: number;
  updatedAt: number;
}

export type SaveData = SaveDataV1;
