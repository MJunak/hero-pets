# Hero Pets – MVP 1 Game \& Tech Plan

## 1\. Vision

**Hero Pets** ist ein charmantes Superhelden-Spiel für Kinder, in dem der Spieler selbst entscheiden kann, ob er als **Superheld** oder als **Superhelden-Tier** spielen möchte.

Das Spiel soll bewusst klein starten, aber technisch so aufgebaut sein, dass später weitere Tiere, Missionen, Fähigkeiten, Welten und kosmetische Inhalte ergänzt werden können.

Der erste MVP soll bereits ein kleines, vollständiges Spielerlebnis bieten und nicht nur eine technische Demo sein.

\---

## 2\. Ziel des ersten MVP

Der erste MVP soll folgende Dinge vollständig enthalten:

* Auswahl: **Held oder Tier spielen**
* Zwei direkt spielbare Tiere:

  * **Pferd**
  * **Polarfuchs**
* Character Creator
* Vergabe eines eigenen Namens
* Anpassung des Aussehens
* Eine kleine spielbare Welt
* Eine erste Mission
* Eine einfache Superkraft-/Skill-Mechanik
* Tastatursteuerung auf Desktop
* Virtuelle Steuerung auf Tablet / Touch-Geräten
* Lokales Speichern des Spielfortschritts
* Installation als PWA
* Hosting über GitHub Pages

Der MVP soll bewusst klein bleiben. Ziel ist ein **spielbarer Vertical Slice**, der bereits Spaß macht und sich wie ein echtes kleines Spiel anfühlt.

\---

## 3\. Spielname

# Hero Pets

\---

## 4\. Spielbare Rollen

Zu Beginn entscheidet der Spieler:

### Möchtest du spielen als ...

* **Held**
* **Tier**

Beide Rollen erleben dieselbe Mission und dieselbe Spielwelt.

Wenn der Spieler das Tier steuert, begleitet ihn der Held.

Wenn der Spieler den Helden steuert, begleitet ihn sein Tier.

Die Begleiterlogik darf im MVP sehr einfach sein. Der Companion kann dem Spieler zunächst lediglich folgen und muss noch keine komplexe KI besitzen.

\---

## 5\. Tiere im MVP

Im ersten MVP werden bereits zwei Tiere vollständig unterstützt.

### Pferd

Das Pferd ist eines der beiden ersten Hero Pets.

Es soll:

* spielbar sein
* einen eigenen Namen bekommen können
* optisch angepasst werden können
* eigene Animationen besitzen
* mindestens eine Superkraft / Fähigkeit besitzen

### Polarfuchs

Der Polarfuchs ist ebenfalls bereits Teil des ersten MVP und nicht nur ein später angekündigtes Tier.

Er soll denselben grundlegenden Funktionsumfang wie das Pferd besitzen:

* spielbar
* eigener Name
* Character Customization
* eigene Animationen
* mindestens eine eigene Fähigkeit

Weitere Tiere wie **Katze** und **Drache** sind für spätere Versionen vorgesehen, gehören aber noch nicht zum MVP.

\---

## 6\. Character Creator

Der Character Creator ist ein zentraler Bestandteil des MVP.

Der Spieler soll sein Hero Pet möglichst früh als **eigene Figur** wahrnehmen.

### Ablauf

1. Rolle auswählen: Held oder Tier
2. Tier auswählen: Pferd oder Polarfuchs
3. Namen des Tiers eingeben
4. Aussehen anpassen
5. Spiel starten

### Namenseingabe

Der Spieler kann einen eigenen Namen über ein normales Texteingabefeld eingeben.

Auf Tablets soll automatisch die Bildschirmtastatur verwendet werden.

### Optische Anpassungen

Für den ersten MVP reichen wenige, klar sichtbare Optionen.

Mögliche Kategorien:

* Fellfarbe
* Augenfarbe
* Mähne beim Pferd
* unterschiedliche Fellvarianten beim Polarfuchs
* Maske
* Cape
* Halstuch
* Superhelden-Symbol
* weitere kleine Accessoires

Die Änderungen sollen im Character Creator **direkt sichtbar** sein.

Der Fokus liegt zunächst auf Spaß und Individualisierung, nicht auf einem komplexen Inventarsystem.

\---

## 7\. Grafischer Stil

Hero Pets soll einen charmanten **Pixel-Art-Look** bekommen.

Referenzrichtung:

* Stardew Valley
* Terraria
* Starbound

Es geht nicht darum, diese Spiele zu kopieren, sondern um die grundsätzliche Atmosphäre:

* freundlich
* bunt
* charmant
* klar lesbare Figuren
* ausdrucksstarke Animationen
* kindgerecht
* nicht fotorealistisch

Pixelgrafik ist ausdrücklich gewünscht und passt auch gut zum begrenzten Umfang des ersten Projekts.

\---

## 8\. Perspektive und Welt

Das Spiel wird **nicht als klassisches 2D-Top-Down-Spiel** umgesetzt.

Für den ersten Prototyp soll eine dieser Richtungen verwendet werden:

### Bevorzugt

**2D Side-Scroller mit leichter 2,5D-Wirkung**

oder

**seitliche / schräge Pixelwelt in Richtung Terraria, Starbound oder Stardew Valley**

Die endgültige Perspektive kann beim ersten technischen Prototyp festgelegt werden.

Wichtig ist:

* Figur bleibt gut sichtbar
* Bewegung fühlt sich direkt an
* Welt funktioniert auf Desktop und Tablet
* Pixel-Art-Assets bleiben relativ einfach erstellbar
* Animationen von Pferd und Polarfuchs funktionieren überzeugend

\---

## 9\. Gameplay-Grundidee

Der Spieler bewegt sich mit seinem Hero Pet bzw. Helden durch eine kleine Spielwelt.

Der MVP benötigt noch keine große offene Welt.

Eine kompakte Umgebung reicht aus, beispielsweise:

* kleiner Ausgangsbereich / Hauptquartier
* Weg oder Waldstück
* kleiner Bereich mit NPC
* Missionsbereich
* Ziel der ersten Mission

Die Welt soll klein genug sein, dass sie vollständig gestaltet werden kann, aber groß genug, dass Bewegung, Exploration und eine Mission sinnvoll wirken.

\---

## 10\. Erste Mission

Der MVP enthält zunächst **genau eine vollständige Mission**.

Die konkrete Geschichte wird noch gemeinsam festgelegt.

Die Mission sollte ungefähr diesem Ablauf folgen:

1. Mission erhalten
2. kurze Erkundung
3. mit einer Figur oder einem Objekt interagieren
4. Hinweis / Problem entdecken
5. Hero-Pet-Fähigkeit einsetzen
6. Missionsziel erreichen
7. Belohnung erhalten

Die Mission sollte idealerweise nur wenige Minuten dauern.

Das Ziel ist ein kompletter Gameplay-Loop:

**Start → Spielen → Fähigkeit einsetzen → Ziel erreichen → Belohnung → Fortschritt speichern**

\---

## 11\. Fähigkeiten / Skills

Pferd und Polarfuchs sollen jeweils mindestens eine eigene Fähigkeit besitzen.

Die genaue Ausgestaltung der Skills wird separat definiert.

Für den technischen Aufbau sollte bereits vorgesehen werden, dass:

* Tiere unterschiedliche Fähigkeiten haben können
* Fähigkeiten aktiviert werden können
* Fähigkeiten Cooldowns oder eine begrenzte Dauer besitzen können
* später weitere Fähigkeiten ergänzt werden können

Die konkrete Skill-Liste gehört noch **nicht** zu diesem Dokument.

\---

## 12\. Steuerung

Hero Pets muss von Anfang an sowohl auf Desktop als auch auf Tablets funktionieren.

### Desktop

Unterstützung für:

* Tastatur
* Pfeiltasten und/oder WASD
* zusätzliche Taste für Fähigkeit / Aktion

### Tablet / Touch

Unterstützung für:

* virtuellen Joystick
* großen Aktions-/Skill-Button
* touchfreundliche Menüs
* große Bedienelemente
* Bildschirmtastatur bei Texteingaben

Die Touch-Steuerung ist kein späteres Extra, sondern Bestandteil des MVP.

\---

## 13\. Technischer Stack

### Sprache

**TypeScript**

TypeScript soll im gesamten Projekt verwendet werden.

### Game Engine

**Phaser**

Phaser übernimmt insbesondere:

* Rendering
* Game Loop
* Szenen
* Sprites
* Animationen
* Kollisionen
* Eingaben
* Kamera
* Audio
* Touch- und Pointer-Eingaben

### Build Tool

**Vite**

Für:

* Development Server
* TypeScript-Build
* Asset-Bundling
* Production Build

### Benutzeroberfläche

Menüs und Character Creator können zunächst mit:

* HTML
* CSS
* TypeScript

umgesetzt werden.

Ein zusätzliches UI-Framework wie React ist für den MVP nicht notwendig.

### PWA

Die Anwendung soll als **Progressive Web App** bereitgestellt werden.

Ziel:

* vom Tablet zum Home-Bildschirm hinzufügbar
* möglichst appähnliches Verhalten
* Assets nach erstem Laden möglichst offline verfügbar

### Persistenz

Für den MVP:

**localStorage**

Gespeichert werden beispielsweise:

* Rolle
* Tier
* Name
* Aussehen
* freigeschaltete Inhalte
* Missionsfortschritt
* Einstellungen

Eine Cloud-Synchronisierung oder ein Backend sind nicht Bestandteil des MVP.

### Hosting

**GitHub Pages**

Das komplette Spiel soll als statische Anwendung deploybar sein.

Deployment idealerweise automatisiert über GitHub Actions.

\---

## 14\. Plattformen

Der MVP soll primär auf folgenden Plattformen funktionieren:

* Desktop-Browser
* Tablet-Browser
* installierte PWA auf Tablets

Smartphones dürfen grundsätzlich funktionieren, sind für die erste Version aber nicht die primäre Zielplattform.

\---

## 15\. Bewusst nicht Bestandteil des MVP

Folgende Dinge werden zunächst ausdrücklich nicht gebaut:

* Multiplayer
* Benutzerkonten
* Server
* Cloud-Saves
* komplexe NPC-KI
* große Open World
* dutzende Missionen
* Katze
* Drache
* komplexes Kampf-System
* umfangreiche Wirtschaft
* Shop mit Echtgeld
* komplexes Crafting
* riesiges Inventarsystem

Diese Dinge können später ergänzt werden.

\---

## 16\. Definition of Done – MVP 1

Der erste MVP ist erfolgreich, wenn ein Spieler:

1. Hero Pets im Browser öffnen kann
2. zwischen Held und Tier wählen kann
3. zwischen Pferd und Polarfuchs wählen kann
4. seinem Tier einen eigenen Namen geben kann
5. das Aussehen seines Tiers verändern kann
6. das Spiel starten kann
7. sich durch die Pixelwelt bewegen kann
8. einen Companion bei sich hat
9. eine tierabhängige Fähigkeit verwenden kann
10. eine vollständige Mission spielen kann
11. eine Belohnung erhalten kann
12. den Browser schließen kann
13. später wiederkommen kann
14. seinen gespeicherten Charakter und Fortschritt wiederfindet
15. das Spiel auf einem Tablet mit Touch-Steuerung spielen kann

\---

## 17\. Entwicklungsprinzipien

### Klein anfangen

Zuerst ein funktionierendes Spiel, danach Erweiterungen.

### Spielbar vor perfekt

Ein kompletter kleiner Gameplay-Loop ist wertvoller als viele halbfertige Systeme.

### Kindgerechtes Feedback

Aktionen sollen unmittelbar sichtbar und verständlich sein:

* Animationen
* Sound
* kleine Effekte
* klare Buttons
* deutliche Belohnungen

### Erweiterbarkeit ohne Overengineering

Weitere Tiere und Missionen sollen später gut ergänzt werden können.

Es ist aber nicht notwendig, bereits im MVP eine komplexe universelle Game-Engine für alle zukünftigen Ideen zu entwickeln.

### LLM-freundliche Codebasis

Das Projekt soll gut mit Coding Agents wie Claude oder Codex weiterentwickelbar sein:

* kleine Dateien
* klare Verantwortlichkeiten
* TypeScript-Typen
* möglichst wenig Framework-Magie
* keine unnötigen Abstraktionen
* verständliche Namen
* kurze technische Dokumentation

\---

## 18\. Nächste Designentscheidungen

Die nächsten Punkte sollten gemeinsam definiert werden:

1. **Side-Scroller oder konkrete 2,5D-Perspektive**
2. Fähigkeiten des Pferdes
3. Fähigkeiten des Polarfuchses
4. Geschichte der ersten Mission
5. menschlicher Superheld / Companion
6. Gegner oder Problem der ersten Mission
7. optischer Stil der beiden Tiere
8. erste Customization Items
9. Arbeit mit selbst erzeugten bzw. generierten Pixel-Art-Assets
10. Sound und Musikstil

\---

**Projekt:** Hero Pets  
**Phase:** MVP 1 – Game Design \& Technical Direction  
**Stand:** 16.08.2026


