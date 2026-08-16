import { OBSTACLE_ANCHOR_Y } from '../world/WorldLayout';

export interface MissionBeat {
  id: string;
  obstacleX: number;
  obstacleY: number;
  triggerRange: number;
  useRange: number;
  textureKey: string;
  /** Dialog, sobald der Spieler das Hindernis zum ersten Mal erreicht. */
  discoverDialogue: string[];
  /** Dialog, nachdem die Fähigkeit erfolgreich eingesetzt wurde. */
  clearedDialogue: string;
  breakColor: number;
}

/**
 * Die Rettungsmission besteht aus mehreren Hindernissen hintereinander.
 * `WorldScene` blockiert den Weg immer nur am jeweils nächsten, noch nicht
 * befreiten Beat – so bleibt die Logik unabhängig von der Anzahl der Beats.
 */
export const MISSION_BEATS: MissionBeat[] = [
  {
    id: 'rock',
    obstacleX: 1090,
    obstacleY: OBSTACLE_ANCHOR_Y,
    triggerRange: 150,
    useRange: 190,
    textureKey: 'scenery-rock',
    discoverDialogue: [
      'Ein riesiger Felsen blockiert die Brücke!',
      'Setzt eure Hero-Pet-Kraft ein, um den Weg frei zu machen!'
    ],
    clearedDialogue: 'Super! Der Felsen ist weg – der Weg über die Brücke ist frei!',
    breakColor: 0x8a8a95
  },
  {
    id: 'log',
    obstacleX: 2150,
    obstacleY: OBSTACLE_ANCHOR_Y,
    triggerRange: 150,
    useRange: 190,
    textureKey: 'scenery-log',
    discoverDialogue: [
      'Ein umgestürzter Baumstamm versperrt den ganzen Weg!',
      'Noch mehr Arbeit für eure Kraft!'
    ],
    clearedDialogue: 'Geschafft! Der Baumstamm ist zur Seite geräumt.',
    breakColor: 0x7a5230
  },
  {
    id: 'thicket',
    obstacleX: 3200,
    obstacleY: OBSTACLE_ANCHOR_Y,
    triggerRange: 150,
    useRange: 190,
    textureKey: 'scenery-thicket',
    discoverDialogue: [
      'Ein dichtes Dornengestrüpp blockiert den Pfad!',
      'Das Kätzchen kann nicht mehr weit sein. Nutzt eure Kraft!'
    ],
    clearedDialogue: 'Der Weg ist frei! Das Kätzchen muss gleich hier in der Nähe sein.',
    breakColor: 0x3f7a38
  }
];
