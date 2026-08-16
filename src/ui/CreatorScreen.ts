import type { AccentColorId, AnimalId, EyeColorId, FurColorId, PatternId, SaveData } from '../types';
import { ACCENT_COLORS, EYE_COLORS, FUR_COLORS } from '../pixelart/palette';
import { composeFlatCanvas, composePet, visiblePartsFor } from '../pixelart/compose';
import { sfxSelect } from '../audio/Sfx';

const DEFAULT_NAMES: Record<AnimalId, string[]> = {
  horse: ['Donner', 'Blitz', 'Luna', 'Sternchen', 'Comet'],
  fox: ['Frost', 'Schnee', 'Polarina', 'Eisblitz', 'Flake']
};

const previewCanvas = document.getElementById('creator-canvas') as HTMLCanvasElement;
const previewCtx = previewCanvas.getContext('2d')!;
const optionsRoot = document.getElementById('creator-options')!;
const nameInput = document.getElementById('pet-name-input') as HTMLInputElement;

function renderPreview(save: SaveData): void {
  const actor = composePet(save.animal, save.appearance);
  const flat = composeFlatCanvas(actor, visiblePartsFor(save.appearance));
  previewCtx.imageSmoothingEnabled = false;
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  const scale = Math.min(previewCanvas.width / flat.width, previewCanvas.height / flat.height) * 0.92;
  const dw = flat.width * scale;
  const dh = flat.height * scale;
  previewCtx.drawImage(flat, (previewCanvas.width - dw) / 2, (previewCanvas.height - dh) / 2, dw, dh);
}

function swatchGroup(
  title: string,
  colors: Record<string, string>,
  selected: string,
  onPick: (id: string) => void
): HTMLDivElement {
  const group = document.createElement('div');
  group.className = 'option-group';
  const heading = document.createElement('div');
  heading.className = 'option-group__title';
  heading.textContent = title;
  group.appendChild(heading);

  const row = document.createElement('div');
  row.className = 'swatch-row';
  for (const [id, hex] of Object.entries(colors)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch' + (id === selected ? ' is-selected' : '');
    btn.style.background = hex;
    btn.setAttribute('aria-label', id);
    btn.addEventListener('click', () => {
      sfxSelect();
      onPick(id);
    });
    row.appendChild(btn);
  }
  group.appendChild(row);
  return group;
}

function toggleGroup(
  title: string,
  options: { id: string; label: string }[],
  selected: string,
  onPick: (id: string) => void
): HTMLDivElement {
  const group = document.createElement('div');
  group.className = 'option-group';
  const heading = document.createElement('div');
  heading.className = 'option-group__title';
  heading.textContent = title;
  group.appendChild(heading);

  const row = document.createElement('div');
  row.className = 'option-toggle-row';
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-toggle' + (opt.id === selected ? ' is-selected' : '');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      sfxSelect();
      onPick(opt.id);
    });
    row.appendChild(btn);
  }
  group.appendChild(row);
  return group;
}

export function renderCreator(save: SaveData): void {
  if (!save.petName) {
    const names = DEFAULT_NAMES[save.animal];
    save.petName = names[Math.floor(Math.random() * names.length)];
  }
  nameInput.value = save.petName;
  nameInput.oninput = () => {
    save.petName = nameInput.value.slice(0, 14);
  };

  const rerender = () => {
    optionsRoot.innerHTML = '';
    optionsRoot.appendChild(
      swatchGroup('Fellfarbe', FUR_COLORS, save.appearance.furColor, (id) => {
        save.appearance.furColor = id as FurColorId;
        renderPreview(save);
        rerender();
      })
    );
    optionsRoot.appendChild(
      swatchGroup('Augenfarbe', EYE_COLORS, save.appearance.eyeColor, (id) => {
        save.appearance.eyeColor = id as EyeColorId;
        renderPreview(save);
        rerender();
      })
    );
    optionsRoot.appendChild(
      swatchGroup('Akzentfarbe (Mähne, Accessoires)', ACCENT_COLORS, save.appearance.accentColor, (id) => {
        save.appearance.accentColor = id as AccentColorId;
        renderPreview(save);
        rerender();
      })
    );

    const patternLabel = save.animal === 'horse' ? 'Mähnenstil' : 'Fellvariante';
    const patternOptions =
      save.animal === 'horse'
        ? [
            { id: 'plain', label: 'Klassisch' },
            { id: 'patched', label: 'Wallend' }
          ]
        : [
            { id: 'plain', label: 'Einfarbig' },
            { id: 'patched', label: 'Zweifarbig' }
          ];
    optionsRoot.appendChild(
      toggleGroup(patternLabel, patternOptions, save.appearance.pattern, (id) => {
        save.appearance.pattern = id as PatternId;
        renderPreview(save);
        rerender();
      })
    );

    const accessoryOptions: { id: string; label: string }[] = [
      { id: 'mask', label: '🎭 Maske' },
      { id: 'cape', label: '🧣 Cape' },
      { id: 'bandana', label: '🎀 Halstuch' },
      { id: 'symbol', label: '⭐ Symbol' }
    ];
    const accGroup = document.createElement('div');
    accGroup.className = 'option-group';
    const accHeading = document.createElement('div');
    accHeading.className = 'option-group__title';
    accHeading.textContent = 'Accessoires';
    accGroup.appendChild(accHeading);
    const accRow = document.createElement('div');
    accRow.className = 'option-toggle-row';
    for (const opt of accessoryOptions) {
      const key = opt.id as keyof SaveData['appearance']['accessories'];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-toggle' + (save.appearance.accessories[key] ? ' is-selected' : '');
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        sfxSelect();
        save.appearance.accessories[key] = !save.appearance.accessories[key];
        renderPreview(save);
        rerender();
      });
      accRow.appendChild(btn);
    }
    accGroup.appendChild(accRow);
    optionsRoot.appendChild(accGroup);
  };

  rerender();
  renderPreview(save);
}
