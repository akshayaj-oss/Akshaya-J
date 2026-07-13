import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictorySound } from '../lib/sounds';

interface PopupProps {
  isOpen: boolean;
  onContinue: () => void;
  badgeName: string;
}

export function CorrectPopup({ isOpen, onContinue, badgeName }: PopupProps) {
  useEffect(() => {
    if (isOpen) {
      playVictorySound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FACC15', '#FFFFFF']
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#001A3D]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white/5 border border-[#4CAF50]/30 rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl backdrop-blur-md flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-[#4CAF50]/20 text-[#4CAF50] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(76,175,80,0.3)]">
              <CheckCircle2 size={40} />
            </div>
            <div className="text-[10px] font-bold text-[#4CAF50] uppercase tracking-widest mb-2">BADGE UNLOCKED</div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">{badgeName}</h2>
            <div className="text-xl font-bold text-brand-gold mb-8">+25 Points</div>
            <button
              onClick={onContinue}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold text-lg py-4 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-[#4CAF50]/20"
            >
              Continue <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
