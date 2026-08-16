# Hero Pets – MVP 1

Ein charmantes Pixel-Art-Spiel für Kinder: Held oder Hero-Tier wählen, das eigene Pferd oder den Polarfuchs gestalten und gemeinsam die erste Mission meistern.

Siehe [GAMEDESIGN.md](./GAMEDESIGN.md) für das vollständige Konzept. Dieses Dokument beschreibt den technischen Aufbau und die konkreten Entscheidungen aus Abschnitt 18.

## Entwicklung

```bash
npm install
npm run dev       # Dev-Server, http://localhost:5173/hero-pets/
npm run typecheck
npm run build      # Produktions-Build nach dist/
npm run preview    # Baut nicht neu, dient nur zum lokalen Testen von dist/
```

## Architektur

- **TypeScript, Vite, Phaser 3** – wie im Game-Design-Dokument vorgegeben.
- **Menüs & Character Creator** sind reines HTML/CSS/TS (`index.html`, `src/style.css`, `src/ui/*`) – kein UI-Framework. Das eigentliche Spiel läuft in einer einzigen Phaser-Szene (`src/game/scenes/WorldScene.ts`).
- **Pixel-Art ohne Bilddateien:** Alle Figuren und die Deko werden zur Laufzeit aus kleinen, palettenbasierten Pixel-Rastern erzeugt (`src/pixelart/`). Farben sind Paletten-*Slots*, keine fest gebackenen Pixel – Fell-, Augen- und Akzentfarben lassen sich dadurch verlustfrei tauschen. Das hält alle Assets als lesbaren TypeScript-Code (LLM-freundlich, keine Binär-Blobs) und macht Recolor/Zubehör „billig".
- **Figuren-Rig:** Jede Figur (Held, Pferd, Polarfuchs) besteht aus einzelnen Körperteil-Bildern (Rumpf, Beine, Schwanz, Mähne, Cape, …), die in einem Phaser-Container übereinandergelegt werden (`src/game/actors/RiggedActor.ts`). Lauf-, Idle- und Fähigkeits-Animationen werden **prozedural** berechnet (Sinus-Schwingungen für Beine/Schwanz/Cape, Squash&Stretch für die Fähigkeit) statt über handgezeichnete Frame-Sequenzen – spart Dutzende Sprite-Frames pro Tier bei trotzdem lebendiger Bewegung.
- **Speicherstand:** `localStorage`, ein einziges JSON-Objekt mit `version`-Feld (`src/save/SaveStore.ts`, `src/types.ts`).
- **PWA:** `vite-plugin-pwa`, `base: '/hero-pets/'` (passend zum GitHub-Pages-Repo-Namen). Automatisches Deployment über `.github/workflows/deploy.yml`.

## Entscheidungen aus Abschnitt 18

1. **Perspektive:** 2D-Side-Scroller mit leichter 2,5D-Wirkung – Figuren bewegen sich frei in einem schmalen Y-Band, Tiefe entsteht durch Y-Sortierung (weiter „vorne" = größer im Depth-Stacking) und mehrstufiges Parallax-Scrolling (Himmel, Hügel, Boden).
2. **Fähigkeit Pferd:** „Kraft-Tritt" – zertrümmert den Felsen, der die Brücke blockiert.
3. **Fähigkeit Polarfuchs:** dieselbe Aktion, andere Erzählung/Farbe (Frost-Effekt) – technisch ein generischer, wiederverwendbarer „Power-Pose"-Animationsablauf (Squash → Sprung → Stoß), damit Held- und Tier-Rolle exakt denselben Missionsablauf unterstützen.
4. **Geschichte der ersten Mission:** Ein Kätzchen hat sich tief im Wald verlaufen. Der Weg dorthin ist **dreifach** blockiert – Felsen/Brücke, umgestürzter Baumstamm, dorniges Gestrüpp –, jedes Hindernis in einer eigenen, optisch unterschiedlichen Zone (Wald → Wiese mit Teich → Nadelwald → Lichtung). Ablauf: Intro-Dialog → Hindernis 1 entdecken → Kraft einsetzen → Hindernis 2 → Kraft einsetzen → Hindernis 3 → Kraft einsetzen → Kätzchen erreichen → Belohnung (Freischaltung des Superhelden-Symbols) → Fortschritt wird gespeichert. Die Mission ist als Beat-Liste modelliert (`src/game/mission/beats.ts`), sodass weitere Hindernisse später ohne Änderungen an der Steuerungslogik ergänzt werden können.
5. **Companion-Logik:** Steuert der Spieler den Helden, folgt ihm das Tier (und umgekehrt) mit Verzögerung. Beim Fähigkeits-Einsatz „ruft" der Held sein Tier, das kurz zum jeweiligen Hindernis läuft und dort seine Kraft einsetzt – so bleibt die Mission unabhängig von der gewählten Rolle lösbar.
6. **Hindernisse der ersten Mission:** Felsen auf der Brücke, Baumstamm, Dornengestrüpp (siehe oben).
7. **Optischer Stil:** Pferd und Polarfuchs sind bewusst unterschiedlich proportioniert (Fuchs: rundlicher Körper, große spitze Ohren, buschiger Schwanz, kürzere Beine) für klare Lesbarkeit auf einen Blick.
8. **Erste Customization-Items:** Fellfarbe, Augenfarbe, Akzentfarbe (färbt Mähne/Schweif und alle Accessoires), Mähnenstil bzw. Fellvariante, sowie vier Accessoires (Maske, Cape, Halstuch, Superhelden-Symbol). Der Held hat ein festes, dafür mit der Tierfarbe abgestimmtes Kostüm (kein eigener Creator-Schritt nötig, spart Umfang ohne Funktionsverlust).
9. **Assets:** vollständig prozedural generiert (siehe oben) statt handgezeichneter/generierter Bilddateien – reproduzierbar, editierbar, ohne Asset-Pipeline.
10. **Sound:** keine Audio-Dateien, sondern kurze WebAudio-Synth-Sounds (`src/audio/Sfx.ts`) für Auswahl, Fähigkeit, Erfolg etc. – ausreichend für kindgerechtes Feedback im MVP.

## Zusätzlicher Content über das MVP-Minimum hinaus

Nach erstem Feedback wurde bewusst mehr Umfang eingebaut, als §2 des Game-Design-Dokuments als Minimum verlangt:

- **16 sammelbare Sterne** über die ganze Welt verteilt (`src/game/mission/collectibles.ts`), mit HUD-Zähler und Speicherung. Wer alle 16 findet, schaltet die komplette Superhelden-Ausrüstung (Maske, Cape, Halstuch, Symbol) auf einmal frei.
- **Vier statt eine Zone** mit jeweils eigener Deko (Wald, Wiese mit Teich und Blumen, Nadelwald, finale Lichtung) – rund 1,8× breitere Welt als in der ursprünglichen MVP-Fassung.
- **Illustriertes Titelbild** auf dem Startbildschirm (Held zwischen Pferd und Polarfuchs) statt reinem Text-Logo.
- **Laufstaub-Partikel** unter den Füßen bei Bewegung für mehr spielerisches Feedback.

## Bekannte Grenzen dieser ersten Version

- Die Weltbreite/-höhe ist auf typische Desktop- und Tablet-Viewports (Querformat) ausgelegt; auf sehr schmalen Hochformat-Bildschirmen (Smartphones) bleibt am unteren Rand ungenutzter Himmel – laut Spezifikation nicht die primäre Zielplattform.
- Der GitHub-Actions-Workflow wurde nicht gegen ein echtes GitHub-Pages-Deployment verifiziert (kein Remote-Push in dieser Session).
- Touch-Steuerung wurde mit simulierten Touch-/Pointer-Events (Playwright, iPad-Emulation) getestet, nicht auf echter Tablet-Hardware.
