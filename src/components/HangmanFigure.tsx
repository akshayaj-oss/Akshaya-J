import React from 'react';

interface HangmanFigureProps {
  wrongGuesses: number;
}

export function HangmanFigure({ wrongGuesses }: HangmanFigureProps) {
  return (
    <div className="relative w-[200px] h-[250px] mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 250" className="w-full h-full stroke-brand-gold stroke-[4px] fill-transparent stroke-linecap-round stroke-linejoin-round">
        {/* Stand */}
        <line x1="20" y1="230" x2="100" y2="230" />
        <line x1="60" y1="230" x2="60" y2="20" />
        <line x1="60" y1="20" x2="140" y2="20" />
        <line x1="140" y1="20" x2="140" y2="50" />

        {/* Full faint outline */}
        <circle cx="140" cy="75" r="25" className="stroke-white/10" />
        <line x1="140" y1="100" x2="140" y2="160" className="stroke-white/10" />
        <line x1="140" y1="120" x2="110" y2="150" className="stroke-white/10" />
        <line x1="140" y1="120" x2="170" y2="150" className="stroke-white/10" />
        <line x1="140" y1="160" x2="115" y2="210" className="stroke-white/10" />
        <line x1="140" y1="160" x2="165" y2="210" className="stroke-white/10" />

        {/* Actual drawing */}
        {/* Head */}
        {wrongGuesses >= 1 && <circle cx="140" cy="75" r="25" />}
        
        {/* Body */}
        {wrongGuesses >= 2 && <line x1="140" y1="100" x2="140" y2="160" />}
        
        {/* Left Arm */}
        {wrongGuesses >= 3 && <line x1="140" y1="120" x2="110" y2="150" />}
        
        {/* Right Arm */}
        {wrongGuesses >= 4 && <line x1="140" y1="120" x2="170" y2="150" />}
        
        {/* Left Leg */}
        {wrongGuesses >= 5 && <line x1="140" y1="160" x2="115" y2="210" />}
        
        {/* Right Leg */}
        {wrongGuesses >= 6 && <line x1="140" y1="160" x2="165" y2="210" />}
      </svg>
    </div>
  );
}
