export interface Participant {
  id?: string;
  fullName: string;
  employeeId: string;
  score: number;
  badgesUnlocked: number;
  badgesMissed: number;
  timeTaken: number;
  badge1Time: number;
  badge2Time: number;
  badge3Time: number;
  badge4Time: number;
  completedAt: string;
}

export interface GameRound {
  id: number;
  word: string;
  hint: string;
  revealedLetters: string[];
}

export const GAME_ROUNDS: GameRound[] = [
  {
    id: 1,
    word: 'STANDARD SETTER',
    hint: 'Benchmark',
    revealedLetters: ['S'],
  },
  {
    id: 2,
    word: 'POWERHOUSE',
    hint: 'Energy',
    revealedLetters: ['E', 'R'],
  },
  {
    id: 3,
    word: 'BRIDGE BUILDER',
    hint: 'Connection',
    revealedLetters: ['B'],
  },
  {
    id: 4,
    word: 'LEVELED UP',
    hint: 'Growth',
    revealedLetters: ['L'],
  },
];
