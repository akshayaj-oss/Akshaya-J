import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { GAME_ROUNDS } from '../types';
import { HangmanFigure } from '../components/HangmanFigure';
import { Keyboard } from '../components/Keyboard';
import { WordDisplay } from '../components/WordDisplay';
import { CorrectPopup } from '../components/CorrectPopup';
import { IncorrectPopup } from '../components/IncorrectPopup';
import { Timer, Heart, Shield } from 'lucide-react';
import { formatTime, cn } from '../lib/utils';
import { motion, useAnimation } from 'motion/react';
import { playCorrectSound, playIncorrectSound } from '../lib/sounds';

const MAX_LIVES = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function Game() {
  const navigate = useNavigate();
  const { 
    participant, 
    currentRoundIndex, setCurrentRoundIndex,
    score, setScore,
    badgesUnlocked, setBadgesUnlocked,
    badgesMissed, setBadgesMissed,
    roundDurations, setRoundDurations,
  } = useGame();

  const [guessedLetters, setGuessedLetters] = useState<string[]>(() => GAME_ROUNDS[currentRoundIndex]?.revealedLetters || []);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [roundTimeElapsed, setRoundTimeElapsed] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [popupType, setPopupType] = useState<'correct' | 'incorrect' | null>(null);

  const controls = useAnimation();

  const currentRound = GAME_ROUNDS[currentRoundIndex];

  useEffect(() => {
    if (!participant) {
      navigate('/');
      return;
    }
  }, [participant, navigate]);

  useEffect(() => {
    if (isRoundOver || !participant) return;
    const timer = setInterval(() => {
      setRoundTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRoundOver, participant]);

  const triggerShake = async () => {
    await controls.start({
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.4 }
    });
  };

  const handleLetterClick = (letter: string) => {
    if (isRoundOver || guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!currentRound.word.includes(letter)) {
      playIncorrectSound();
      triggerShake();
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= MAX_LIVES) {
        handleRoundEnd(false);
      }
    } else {
      playCorrectSound();
      // Check win condition
      const isWin = currentRound.word.split('').every(char => 
        char === ' ' || newGuessed.includes(char)
      );
      if (isWin) {
        handleRoundEnd(true);
      }
    }
  };

  const handleRoundEnd = (won: boolean) => {
    setIsRoundOver(true);
    setRoundDurations([...roundDurations, roundTimeElapsed]);
    
    if (won) {
      setScore(score + 25);
      setBadgesUnlocked(badgesUnlocked + 1);
      setPopupType('correct');
    } else {
      setBadgesMissed(badgesMissed + 1);
      setPopupType('incorrect');
    }
  };

  const nextRound = () => {
    if (currentRoundIndex + 1 < GAME_ROUNDS.length) {
      const nextIndex = currentRoundIndex + 1;
      setGuessedLetters(GAME_ROUNDS[nextIndex].revealedLetters);
      setWrongGuesses(0);
      setRoundTimeElapsed(0);
      setIsRoundOver(false);
      setPopupType(null);
      setCurrentRoundIndex(nextIndex);
    } else {
      navigate('/final');
    }
  };

  if (!participant) return null;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-20 shrink-0 border-b border-brand-gold/30 flex items-center justify-between px-4 md:px-10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="bg-brand-gold rounded-md flex items-center justify-center text-brand-blue font-bold px-2 py-1 text-sm">GL</div>
          <div className="text-xl tracking-widest font-semibold uppercase hidden sm:block">Badge Reveal Challenge</div>
        </div>
        
        <div className="flex gap-4 md:gap-8">
          <div className="text-center">
            <div className="text-[10px] uppercase text-brand-gold tracking-[1.5px] mb-[2px]">Round</div>
            <div className="text-lg md:text-[22px] font-bold tabular-nums leading-none">
              {String(currentRoundIndex + 1).padStart(2, '0')} <span className="text-sm opacity-50">/ {String(GAME_ROUNDS.length).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="text-center hidden sm:block">
            <div className="text-[10px] uppercase text-brand-gold tracking-[1.5px] mb-[2px]">Score</div>
            <div className="text-lg md:text-[22px] font-bold tabular-nums leading-none">{String(score).padStart(3, '0')}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase text-brand-gold tracking-[1.5px] mb-[2px]">Timer</div>
            <div className="text-lg md:text-[22px] font-bold tabular-nums leading-none">{formatTime(roundTimeElapsed)}</div>
          </div>
        </div>
      </header>

      <motion.main 
        animate={controls}
        className="flex-1 flex flex-col md:flex-row p-4 md:p-10 gap-6 md:gap-10 overflow-y-auto min-h-0 max-w-6xl mx-auto w-full items-center justify-center"
      >
        <div className="flex-1 bg-white/5 border border-brand-gold/20 rounded-2xl flex flex-col items-center justify-center relative p-8 shadow-xl">
          <HangmanFigure wrongGuesses={wrongGuesses} />
          <div className="mt-8 text-xs text-brand-gold uppercase tracking-widest font-bold">Attempt {wrongGuesses} of {MAX_LIVES}</div>
        </div>

        <div className="flex-[1.5] flex flex-col justify-between max-w-full">
          <div className="bg-brand-gold/10 border-l-4 border-brand-gold p-4 px-6 rounded-r-lg mb-8">
            <div className="text-[12px] uppercase text-brand-gold font-bold mb-1 tracking-widest">Hint</div>
            <div className="text-[18px] tracking-[0.5px] font-medium">{currentRound.hint}</div>
          </div>
          
          <WordDisplay word={currentRound.word} guessedLetters={guessedLetters} />

          <div className="mt-auto pt-8 pb-4 w-full">
            <Keyboard 
              word={currentRound.word}
              guessedLetters={guessedLetters} 
              onLetterClick={handleLetterClick} 
              disabled={isRoundOver} 
            />
          </div>
        </div>
      </motion.main>

      <footer className="h-20 shrink-0 px-4 md:px-10 flex items-center justify-between border-t border-brand-gold/20 bg-black/10">
        <div className="flex items-center gap-4">
          <div className="text-[10px] uppercase text-brand-gold tracking-[1.5px] hidden sm:block font-bold">Lives Remaining</div>
          <div className="flex gap-2">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <motion.div 
                key={i} 
                initial={false}
                animate={{
                  scale: i < (MAX_LIVES - wrongGuesses) ? 1 : 0.8,
                  opacity: i < (MAX_LIVES - wrongGuesses) ? 1 : 0.2,
                  rotate: i < (MAX_LIVES - wrongGuesses) ? 0 : 15,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "flex items-center justify-center", 
                  i < (MAX_LIVES - wrongGuesses) 
                    ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                    : "text-white/20"
                )}
              >
                <Heart size={20} className={cn("fill-current", i < (MAX_LIVES - wrongGuesses) ? "" : "grayscale")} />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-[10px] uppercase text-brand-gold tracking-[1.5px] hidden sm:block font-bold">Badges Unlocked</div>
          <div className="text-lg font-bold tabular-nums">{badgesUnlocked} / 4</div>
        </div>
      </footer>

      <CorrectPopup 
        isOpen={popupType === 'correct'} 
        onContinue={nextRound} 
        badgeName={currentRound.word}
      />
      
      <IncorrectPopup 
        isOpen={popupType === 'incorrect'} 
        onContinue={nextRound} 
      />
    </div>
  );
}

