export type Coord3 = [number, number, number];

export enum Face {
  U = 'U', // Up (White)
  D = 'D', // Down (Yellow)
  L = 'L', // Left (Orange)
  R = 'R', // Right (Red)
  F = 'F', // Front (Green)
  B = 'B', // Back (Blue)
}

export type Cubie = {
  id: number;
  position: Coord3; // Current logical position (x, y, z)
  rotation: Coord3; // Current visual rotation
  initialPosition: Coord3; // To track solved state
};

export enum GameMode {
  SPLASH = 'SPLASH',
  MENU = 'MENU',
  TUTORIAL = 'TUTORIAL',
  FREE_PLAY = 'FREE_PLAY',
  MATH_HUB = 'MATH_HUB',
  CAMPAIGN_SELECT = 'CAMPAIGN_SELECT', // Choose Operation
  LEVEL_SELECT = 'LEVEL_SELECT',       // Choose Level 1-10
  ARCADE_SELECT = 'ARCADE_SELECT',
  PLAYING = 'PLAYING',
  REPORT = 'REPORT'                    // End of game summary
}

export type MathOperation = 'ADD' | 'SUB' | 'MUL' | 'DIV';
export type ArcadeType = 'SCORE_ATTACK' | 'ENDLESS';

export interface GameConfig {
  mode: 'CAMPAIGN' | 'ARCADE' | 'FREE' | 'TUTORIAL';
  operation?: MathOperation | 'MIXED';
  arcadeType?: ArcadeType;
  selectedLevel?: number; // 1-10
}

export type MathTask = {
  id: number;
  question: string;
  type: 'move_count' | 'pattern' | 'logic';
  targetValue?: number | string;
  isComplete: boolean;
  hint?: string;
  requiredFace?: Face;
};

export type MoveHistoryItem = {
  face: Face;
  clockwise: boolean;
};

export interface GameResult {
  score: number;
  correctAnswers: number;
  totalQuestionsAttempted: number;
  maxCombo: number;
  timeTaken: number; // in seconds
  averageTimePerPuzzle: number;
  hintsUsed: number;
  tips: string[];
  rating: 1 | 2 | 3; // Stars
  title: string;
  mascotMood: 'happy' | 'excited' | 'confused' | 'proud' | 'neutral';
}

export interface TutorialStep {
  id: number;
  text: string;
  subText?: string;
  actionRequired?: 'ROTATE' | 'UNDO' | 'HINT' | 'NONE';
  targetFace?: Face;
}