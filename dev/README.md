# Dev-Tools

Hilfsskripte für die Entwicklung, kein Teil des ausgelieferten Spiels.

- `shot.mjs <url> <out.png> [width] [height]` – Screenshot einer beliebigen Seite (Dev-Server muss laufen).
- `e2e-beats.mjs [baseUrl]` – Klickt den kompletten Ablauf durch: Creator → alle drei Missions-Hindernisse (Sprung-Hürden + Kraft-Wand) → Kätzchen retten → Belohnung → Reload-Persistenz (inkl. Sterne-Zähler).
- `e2e-menu.mjs [baseUrl]` – Testet Pause-Menü, "Zum Hauptmenü" und "Spielstand löschen".
- `e2e-touch.mjs [baseUrl]` – Testet die virtuelle Touch-Steuerung (Joystick + Sprung-Button + Fähigkeits-Button) mit iPad-Emulation.
- `jump-check.mjs [baseUrl]` – Schneller Sanity-Check für die Sprungphysik: läuft durch Zone 1 (drei Sprung-Hürden) und prüft Position/Sterne über `window.__hpDebug()`.
- `icon.html` / `icon.ts` – Erzeugt die PWA-Icons (`public/icons/`) im Pixel-Art-Stil neu, falls die Marke sich ändert. Aufruf: `dev/icon.html?size=512`.

Alle Skripte brauchen einen laufenden Server (`npm run dev` oder `npm run preview`) und Playwright (`npm install` installiert es als devDependency). Ohne Argument zielen sie auf `http://localhost:5173/hero-pets/`.

**Wichtig für dieses Sandbox-Chromium:** Es läuft spürbar langsamer als Echtzeit (GPU-Stalls im Headless-Modus), oft 2–3× langsamer als die Spiel-Zeit. Feste kurze `waitForTimeout`s sind daher unzuverlässig – die Skripte pollen stattdessen auf Zustandsänderungen (`window.__hpDebug()`, `localStorage`) statt auf eine feste Wartezeit zu vertrauen. Neue Testskripte sollten demselben Muster folgen.

`window.__hpDebug()` (nur im laufenden Spiel verfügbar) liefert `{ x, y, grounded, velocityY, jumpH }` der Spielfigur – praktisch, um Sprung-/Kollisionslogik zu verifizieren, ohne Pixel auf Screenshots zu zählen.
