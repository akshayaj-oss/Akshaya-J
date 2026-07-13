import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Trophy, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatTime } from '../lib/utils';
import { playVictorySound } from '../lib/sounds';

export function Final() {
  const navigate = useNavigate();
  const { 
    participant, score, badgesUnlocked, badgesMissed, 
    roundDurations, gameStartTime
  } = useGame();
  
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState(false);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!participant || !gameStartTime) {
      navigate('/');
      return;
    }

    if (badgesUnlocked === 4) {
      playVictorySound();
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FACC15', '#1E3A8A', '#FFFFFF']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FACC15', '#1E3A8A', '#FFFFFF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }

    const saveResult = async () => {
      if (hasSaved.current) return;
      hasSaved.current = true;

      try {
        const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
        
        await addDoc(collection(db, 'participants'), {
          fullName: participant.fullName,
          employeeId: participant.employeeId,
          score,
          badgesUnlocked,
          badgesMissed,
          timeTaken: totalTime,
          badge1Time: roundDurations[0] || 0,
          badge2Time: roundDurations[1] || 0,
          badge3Time: roundDurations[2] || 0,
          badge4Time: roundDurations[3] || 0,
          completedAt: new Date().toISOString()
        });
        
        setSaving(false);
      } catch (err) {
        console.error("Error saving participant data:", err);
        setError(true);
        setSaving(false);
        hasSaved.current = false;
      }
    };

    saveResult();
  }, []);

  const totalTime = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;

  if (saving) {
    return (
      <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-xl font-medium">Saving your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 rounded-2xl p-10 max-w-2xl w-full shadow-2xl border border-brand-gold/20 backdrop-blur-sm"
      >
        <div className="w-24 h-24 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-brand-gold/30">
          <Trophy size={48} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-semibold uppercase tracking-widest text-white mb-8">
          Challenge Complete
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2">Total Score</span>
            <span className="text-3xl font-extrabold text-white tabular-nums">{score}</span>
          </div>
          
          <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex flex-col items-center">
             <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2 flex items-center gap-1">
               <CheckCircle2 size={14} className="text-green-500"/> Unlocked
             </div>
             <span className="text-3xl font-extrabold text-white tabular-nums">{badgesUnlocked}</span>
          </div>

          <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex flex-col items-center">
             <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2 flex items-center gap-1">
               <XCircle size={14} className="text-red-500"/> Missed
             </div>
             <span className="text-3xl font-extrabold text-white tabular-nums">{badgesMissed}</span>
          </div>

          <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex flex-col items-center">
             <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2 flex items-center gap-1">
               <Clock size={14} className="text-blue-400"/> Total Time
             </div>
             <span className="text-3xl font-extrabold text-white font-mono tabular-nums">{formatTime(totalTime)}</span>
          </div>
        </div>

        {error && (
          <div className="text-red-100 mb-6 bg-red-500/20 border border-red-500 p-4 rounded-xl text-sm font-bold">
            There was an error saving your results to the leaderboard.
          </div>
        )}

        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full sm:w-auto py-4 px-10 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold text-lg rounded-xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2 mx-auto uppercase tracking-wide"
        >
          <Trophy size={20} />
          View Live Leaderboard
        </button>

      </motion.div>
    </div>
  );
}
