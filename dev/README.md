# Dev-Tools

Hilfsskripte für die Entwicklung, kein Teil des ausgelieferten Spiels.

- `shot.mjs <url> <out.png> [width] [height]` – Screenshot einer beliebigen Seite (Dev-Server muss laufen).
- `e2e-beats.mjs [baseUrl]` – Klickt den kompletten Ablauf durch: Creator → alle drei Missions-Hindernisse → Kätzchen retten → Belohnung → Reload-Persistenz (inkl. Sterne-Zähler).
- `e2e-menu.mjs [baseUrl]` – Testet Pause-Menü, "Zum Hauptmenü" und "Spielstand löschen".
- `e2e-touch.mjs [baseUrl]` – Testet die virtuelle Touch-Steuerung (Joystick + Fähigkeits-Button) mit iPad-Emulation.
- `icon.html` / `icon.ts` – Erzeugt die PWA-Icons (`public/icons/`) im Pixel-Art-Stil neu, falls die Marke sich ändert. Aufruf: `dev/icon.html?size=512`.

Alle Skripte brauchen einen laufenden Server (`npm run dev` oder `npm run preview`) und Playwright (`npm install` installiert es als devDependency). Ohne Argument zielen sie auf `http://localhost:5173/hero-pets/`.
