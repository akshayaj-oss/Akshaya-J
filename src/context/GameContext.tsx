import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Participant, GAME_ROUNDS } from '../types';

interface GameContextType {
  participant: Participant | null;
  setParticipant: (p: Participant | null) => void;
  currentRoundIndex: number;
  setCurrentRoundIndex: (index: number) => void;
  score: number;
  setScore: (score: number) => void;
  badgesUnlocked: number;
  setBadgesUnlocked: (val: number) => void;
  badgesMissed: number;
  setBadgesMissed: (val: number) => void;
  gameStartTime: number | null;
  setGameStartTime: (time: number | null) => void;
  roundStartTimes: number[];
  setRoundStartTimes: (times: number[]) => void;
  roundDurations: number[];
  setRoundDurations: (durations: number[]) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [badgesUnlocked, setBadgesUnlocked] = useState(0);
  const [badgesMissed, setBadgesMissed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [roundStartTimes, setRoundStartTimes] = useState<number[]>([]);
  const [roundDurations, setRoundDurations] = useState<number[]>([]);

  const resetGame = () => {
    setParticipant(null);
    setCurrentRoundIndex(0);
    setScore(0);
    setBadgesUnlocked(0);
    setBadgesMissed(0);
    setGameStartTime(null);
    setRoundStartTimes([]);
    setRoundDurations([]);
  };

  return (
    <GameContext.Provider value={{
      participant, setParticipant,
      currentRoundIndex, setCurrentRoundIndex,
      score, setScore,
      badgesUnlocked, setBadgesUnlocked,
      badgesMissed, setBadgesMissed,
      gameStartTime, setGameStartTime,
      roundStartTimes, setRoundStartTimes,
      roundDurations, setRoundDurations,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
