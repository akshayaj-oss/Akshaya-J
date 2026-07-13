import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, ArrowRight } from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  onContinue: () => void;
}

export function IncorrectPopup({ isOpen, onContinue }: PopupProps) {
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
            className="bg-white/5 border border-[#F44336]/30 rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl backdrop-blur-md flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-[#F44336]/20 text-[#F44336] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,67,54,0.3)]">
              <XCircle size={40} />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-widest">Out of Lives!</h2>
            <p className="text-white/70 mb-4 font-medium">Better luck on the next badge.</p>
            <div className="text-xl font-bold text-white/40 mb-8">+0 Points</div>
            <button
              onClick={onContinue}
              className="w-full bg-[#F44336] hover:bg-[#d32f2f] text-white font-bold text-lg py-4 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-[#F44336]/20"
            >
              Continue <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
