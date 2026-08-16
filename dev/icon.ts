import { fillEllipse, gridToCanvas, makeGrid, addOutline } from '../src/pixelart/grid';

const size = Number(new URLSearchParams(location.search).get('size') ?? 512);
const canvas = document.getElementById('c') as HTMLCanvasElement;
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d')!;

// Hintergrund: abgerundetes Quadrat mit Farbverlauf im Marken-Blauton.
const r = size * 0.1875;
const w = size;
const h = size;
ctx.imageSmoothingEnabled = true;
const grad = ctx.createLinearGradient(0, 0, 0, h);
grad.addColorStop(0, '#5aa8e0');
grad.addColorStop(1, '#2b3a67');
ctx.fillStyle = grad;
ctx.beginPath();
ctx.moveTo(r, 0);
ctx.arcTo(w, 0, w, h, r);
ctx.arcTo(w, h, 0, h, r);
ctx.arcTo(0, h, 0, 0, r);
ctx.arcTo(0, 0, w, 0, r);
ctx.closePath();
ctx.fill();

// Pfoten-Abzeichen im Pixel-Art-Stil, mittig platziert.
const O = '#1c2440';
const P = '#ffffff';
const A = '#ffd23f';

const grid = makeGrid(28, 28);
fillEllipse(grid, 14, 17, 8.5, 7, P);
fillEllipse(grid, 6, 8, 3, 3.4, P);
fillEllipse(grid, 12, 4.5, 3, 3.6, P);
fillEllipse(grid, 18, 4.5, 3, 3.6, P);
fillEllipse(grid, 23, 8.5, 2.8, 3.2, P);
fillEllipse(grid, 14, 17, 3.6, 3, A);
addOutline(grid, O);

const badge = gridToCanvas(grid, {}, (size / 512) * 14);
ctx.imageSmoothingEnabled = false;
const bw = badge.width;
const bh = badge.height;
ctx.drawImage(badge, (w - bw) / 2, (h - bh) / 2 + 6);

(window as unknown as { __ready: boolean }).__ready = true;
