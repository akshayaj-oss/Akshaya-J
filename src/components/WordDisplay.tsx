import React from 'react';
import { cn } from '../lib/utils';

interface WordDisplayProps {
  word: string;
  guessedLetters: string[];
}

export function WordDisplay({ word, guessedLetters }: WordDisplayProps) {
  const words = word.split(' ');

  return (
    <div className="flex flex-wrap justify-center gap-6 my-8">
      {words.map((w, wordIndex) => (
        <div key={wordIndex} className="flex gap-2">
          {w.split('').map((letter, letterIndex) => {
            const isRevealed = guessedLetters.includes(letter);
            return (
              <div
                key={letterIndex}
                className={cn(
                  "w-[45px] h-[60px] border-b-[3px] border-brand-gold flex items-center justify-center text-[32px] font-bold uppercase",
                  !isRevealed && "text-transparent"
                )}
              >
                {isRevealed ? letter : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
