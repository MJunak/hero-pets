import { writeSave } from '../save/SaveStore';
import type { SaveData } from '../types';

/**
 * Hält den aktiven Spielstand während einer Sitzung im Speicher. Wird von der
 * UI-Shell vor dem Start des Phaser-Spiels gesetzt und von den Szenen
 * gelesen/aktualisiert. Ein einzelner Modul-Singleton reicht, da pro
 * Seitenaufruf immer nur ein Spiel aktiv ist.
 */
let current: SaveData | null = null;

export function initGameState(save: SaveData): void {
  current = save;
}

export function getSaveData(): SaveData {
  if (!current) throw new Error('Game state wurde noch nicht initialisiert.');
  return current;
}

export function persist(): void {
  if (current) writeSave(current);
}
