import React from 'react';
import { cn } from '../lib/utils';

interface KeyboardProps {
  word: string;
  guessedLetters: string[];
  onLetterClick: (letter: string) => void;
  disabled?: boolean;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function Keyboard({ word, guessedLetters, onLetterClick, disabled }: KeyboardProps) {
  return (
    <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 max-w-3xl mx-auto">
      {ALPHABET.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = isGuessed && word.includes(letter);
        const isWrong = isGuessed && !word.includes(letter);
        
        return (
          <button
            key={letter}
            onClick={() => onLetterClick(letter)}
            disabled={isGuessed || disabled}
            className={cn(
              "aspect-square border border-white/20 rounded-lg flex items-center justify-center text-lg font-semibold bg-white/5 transition-all",
              !isGuessed && !disabled && "hover:bg-brand-gold hover:text-brand-blue hover:border-brand-gold cursor-pointer",
              isGuessed && "opacity-30 cursor-not-allowed bg-white/5 border-transparent",
              isCorrect && "bg-[#4CAF50] text-white border-[#4CAF50] opacity-100",
              isWrong && "bg-[#F44336] text-white border-[#F44336] opacity-100"
            )}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
