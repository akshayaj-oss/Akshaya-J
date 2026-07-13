import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Play, Medal } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-2xl p-10 max-w-2xl w-full shadow-2xl border border-brand-gold/20 backdrop-blur-sm"
      >
        <div className="bg-brand-gold text-brand-blue rounded-xl flex items-center justify-center mx-auto mb-6 px-6 py-4 text-xl font-bold leading-none max-w-fit">
          <span className="mt-1 uppercase tracking-wider">Great Learning</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-display font-semibold uppercase tracking-widest text-white mb-4">
          Badge Reveal Challenge
        </h1>
        
        <p className="text-xl text-white/90 mb-2 font-medium">
          Can you uncover all four hidden Manager Recognition Badges?
        </p>
        <p className="text-white/60 mb-10">
          Guess the badge names one letter at a time.
        </p>

        <div className="flex flex-col items-center justify-center gap-2 text-brand-gold font-bold bg-brand-gold/10 border border-brand-gold/20 py-3 px-6 rounded-3xl mx-auto mb-10 text-sm tracking-widest uppercase max-w-fit">
          <Medal size={24} />
          <span className="text-center">4 Badges • 6 Lives Per Badge</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold text-lg py-4 px-8 rounded-xl transition-transform active:scale-95 shadow-lg shadow-brand-gold/20 uppercase tracking-wide"
          >
            <Play size={20} fill="currentColor" />
            Start Challenge
          </button>
          
          <button
            onClick={() => navigate('/leaderboard')}
            className="flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold text-xs py-4 px-8 rounded-xl transition-transform active:scale-95 uppercase tracking-widest"
          >
            <Trophy size={16} />
            View Leaderboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
