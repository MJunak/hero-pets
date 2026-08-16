import Phaser from 'phaser';
import { clearSave, createDefaultSave, loadSave, writeSave } from '../save/SaveStore';
import { initGameState } from '../game/gameState';
import { createGameConfig } from '../game/GameConfig';
import { showScreen } from './screenUtils';
import { renderCreator } from './CreatorScreen';
import { renderChoiceIcons } from './choiceIcons';
import { renderTitleBanner } from './titleBanner';
import { sfxClick, sfxSelect, unlockAudio } from '../audio/Sfx';
import type { AnimalId, Role, SaveData } from '../types';

let draft: SaveData = createDefaultSave();
let game: Phaser.Game | null = null;

const btnNewGame = document.getElementById('btn-new-game')!;
const btnContinue = document.getElementById('btn-continue')!;
const btnReset = document.getElementById('btn-reset')!;

export function startApp(): void {
  renderChoiceIcons();
  renderTitleBanner();
  wireStartScreen();
  wireRoleScreen();
  wireAnimalScreen();
  wireCreatorScreen();
  document.addEventListener('heropets:quit-to-menu', handleQuitToMenu);
  refreshStartScreen();
  showScreen('screen-start');
}

function refreshStartScreen(): void {
  const existing = loadSave();
  if (existing) {
    btnContinue.removeAttribute('hidden');
    btnReset.removeAttribute('hidden');
  } else {
    btnContinue.setAttribute('hidden', '');
    btnReset.setAttribute('hidden', '');
  }
}

function wireStartScreen(): void {
  btnNewGame.addEventListener('click', () => {
    unlockAudio();
    sfxClick();
    draft = createDefaultSave();
    showScreen('screen-role');
  });

  btnContinue.addEventListener('click', () => {
    unlockAudio();
    sfxClick();
    const existing = loadSave();
    if (!existing) {
      refreshStartScreen();
      return;
    }
    launchGame(existing);
  });

  btnReset.addEventListener('click', () => {
    sfxClick();
    if (window.confirm('Spielstand wirklich löschen? Das kann nicht rückgängig gemacht werden.')) {
      clearSave();
      refreshStartScreen();
    }
  });
}

function wireRoleScreen(): void {
  const cards = document.querySelectorAll<HTMLButtonElement>('#screen-role [data-role]');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      sfxSelect();
      draft.role = card.dataset.role as Role;
      showScreen('screen-animal');
    });
  });
  wireBackButtons('#screen-role', 'screen-start');
}

function wireAnimalScreen(): void {
  const cards = document.querySelectorAll<HTMLButtonElement>('#screen-animal [data-animal]');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      sfxSelect();
      const animal = card.dataset.animal as AnimalId;
      if (animal !== draft.animal) {
        draft.animal = animal;
        draft.petName = '';
      }
      showScreen('screen-creator');
      renderCreator(draft);
    });
  });
  wireBackButtons('#screen-animal', 'screen-role');
}

function wireCreatorScreen(): void {
  wireBackButtons('#screen-creator', 'screen-animal');

  const startBtn = document.getElementById('btn-start-game')!;
  startBtn.addEventListener('click', () => {
    if (!draft.petName.trim()) {
      draft.petName = draft.animal === 'horse' ? 'Donner' : 'Frost';
    }
    unlockAudio();
    sfxClick();
    writeSave(draft);
    launchGame(draft);
  });
}

function wireBackButtons(scopeSelector: string, target: Parameters<typeof showScreen>[0]): void {
  document.querySelectorAll<HTMLButtonElement>(`${scopeSelector} [data-back]`).forEach((btn) => {
    btn.addEventListener('click', () => {
      sfxClick();
      showScreen(target);
    });
  });
}

function launchGame(save: SaveData): void {
  initGameState(save);
  showScreen('screen-game');
  if (game) {
    game.destroy(true);
    game = null;
  }
  game = new Phaser.Game(createGameConfig());
}

function handleQuitToMenu(): void {
  if (game) {
    game.destroy(true);
    game = null;
  }
  refreshStartScreen();
  showScreen('screen-start');
}
