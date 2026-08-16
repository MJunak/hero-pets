# Dev-Tools

Hilfsskripte für die Entwicklung, kein Teil des ausgelieferten Spiels.

- `shot.mjs <url> <out.png> [width] [height]` – Screenshot einer beliebigen Seite (Dev-Server muss laufen).
- `e2e-mission.mjs` – Klickt den kompletten Ablauf durch: Creator → Mission → Belohnung → Reload-Persistenz.
- `e2e-touch.mjs` – Testet die virtuelle Touch-Steuerung (Joystick + Fähigkeits-Button) mit iPad-Emulation.
- `icon.html` / `icon.ts` – Erzeugt die PWA-Icons (`public/icons/`) im Pixel-Art-Stil neu, falls die Marke sich ändert. Aufruf: `dev/icon.html?size=512`.

Alle Skripte brauchen `npm run dev` in einem zweiten Terminal und Playwright (`npm install` installiert es als devDependency).
