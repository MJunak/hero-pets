/**
 * Kleine Hilfsbibliothek für handgemachte, palettenbasierte Pixel-Art.
 * Jede "Grid"-Zelle enthält einen Paletten-Schlüssel (ein Zeichen) statt einer
 * fertigen Farbe – dadurch lassen sich Fell-, Augen- und Accessoire-Farben
 * per Farbtausch anpassen, ohne die Form neu zu zeichnen.
 */

export type Grid = string[][];
export const EMPTY = '.';

export function makeGrid(width: number, height: number): Grid {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => EMPTY));
}

export function gridSize(grid: Grid): { width: number; height: number } {
  return { width: grid[0]?.length ?? 0, height: grid.length };
}

export function setPixel(grid: Grid, x: number, y: number, key: string): void {
  const { width, height } = gridSize(grid);
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  grid[y][x] = key;
}

export function getPixel(grid: Grid, x: number, y: number): string {
  const { width, height } = gridSize(grid);
  if (x < 0 || y < 0 || x >= width || y >= height) return EMPTY;
  return grid[y][x];
}

export function fillRect(grid: Grid, x: number, y: number, w: number, h: number, key: string): void {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      setPixel(grid, xx, yy, key);
    }
  }
}

export function fillEllipse(
  grid: Grid,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  key: string
): void {
  const x0 = Math.floor(cx - rx);
  const x1 = Math.ceil(cx + rx);
  const y0 = Math.floor(cy - ry);
  const y1 = Math.ceil(cy + ry);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const nx = (x + 0.5 - cx) / rx;
      const ny = (y + 0.5 - cy) / ry;
      if (nx * nx + ny * ny <= 1) setPixel(grid, x, y, key);
    }
  }
}

/** Kapsel = Rechteck mit abgerundeten Enden. Praktisch für Beine, Schwänze, Arme. */
export function fillCapsule(
  grid: Grid,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  radius: number,
  key: string
): void {
  const minX = Math.floor(Math.min(x0, x1) - radius);
  const maxX = Math.ceil(Math.max(x0, x1) + radius);
  const minY = Math.floor(Math.min(y0, y1) - radius);
  const maxY = Math.ceil(Math.max(y0, y1) + radius);
  const dx = x1 - x0;
  const dy = y1 - y0;
  const lenSq = dx * dx + dy * dy || 1;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      let t = ((px - x0) * dx + (py - y0) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
      const cxp = x0 + t * dx;
      const cyp = y0 + t * dy;
      const distSq = (px - cxp) ** 2 + (py - cyp) ** 2;
      if (distSq <= radius * radius) setPixel(grid, x, y, key);
    }
  }
}

export function fillTriangle(
  grid: Grid,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  key: string
): void {
  const minX = Math.floor(Math.min(x0, x1, x2));
  const maxX = Math.ceil(Math.max(x0, x1, x2));
  const minY = Math.floor(Math.min(y0, y1, y2));
  const maxY = Math.ceil(Math.max(y0, y1, y2));
  const denom = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const a = ((y1 - y2) * (px - x2) + (x2 - x1) * (py - y2)) / denom;
      const b = ((y2 - y0) * (px - x2) + (x0 - x2) * (py - y2)) / denom;
      const c = 1 - a - b;
      if (a >= 0 && b >= 0 && c >= 0) setPixel(grid, x, y, key);
    }
  }
}

/**
 * Fügt einen 1px-Umriss um alle nicht-transparenten Bereiche hinzu (klassischer
 * Pixel-Art-Look). `skipAboveY` lässt den Rand oberhalb dieser Zeile aus – so
 * verschmilzt z. B. ein Bein nahtlos mit dem Rumpf, an den es angesetzt ist,
 * statt eine sichtbare Trennlinie zu erzeugen.
 */
export function addOutline(grid: Grid, outlineKey: string, skipAboveY = -Infinity): void {
  const { width, height } = gridSize(grid);
  const original = grid.map((row) => row.slice());
  const isFilled = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return false;
    return original[y][x] !== EMPTY;
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y < skipAboveY) continue;
      if (isFilled(x, y)) continue;
      if (isFilled(x - 1, y) || isFilled(x + 1, y) || isFilled(x, y - 1) || isFilled(x, y + 1)) {
        setPixel(grid, x, y, outlineKey);
      }
    }
  }
}

/** Kopiert `source` auf `target`, transparente Zellen werden übersprungen. */
export function stampOnto(target: Grid, source: Grid, offsetX: number, offsetY: number): void {
  const { width, height } = gridSize(source);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = source[y][x];
      if (key === EMPTY) continue;
      setPixel(target, x + offsetX, y + offsetY, key);
    }
  }
}

export function gridToCanvas(
  grid: Grid,
  palette: Record<string, string>,
  pixelSize: number
): HTMLCanvasElement {
  const { width, height } = gridSize(grid);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width * pixelSize);
  canvas.height = Math.max(1, height * pixelSize);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = grid[y][x];
      if (key === EMPTY) continue;
      // Slots ohne Paletteneintrag werden als direkte Farbe (z. B. "#8a8a95")
      // interpretiert – praktisch für Einweg-Deko-Assets ohne Recolor-Bedarf.
      const color = palette[key] ?? key;
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
  return canvas;
}
