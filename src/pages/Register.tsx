import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useGame } from '../context/GameContext';
import { Loader2 } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { setParticipant, setGameStartTime, resetGame } = useGame();
  
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !employeeId.trim()) return;

    const normalizedEmpId = employeeId.trim().toUpperCase();
    
    if (!/^(GGN|NW)\/?\d+$/.test(normalizedEmpId)) {
      setError('Employee ID must start with "GGN" or "NW" followed by numbers (e.g., GGN/1234 or NW/1234).');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('Querying firestore for', normalizedEmpId);
      // Check if employee already played
      const q = query(collection(db, 'participants'), where('employeeId', '==', normalizedEmpId));
      console.log('Query created, calling getDocs');
      const querySnapshot = await getDocs(q);
      console.log('getDocs completed', querySnapshot.empty);

      if (!querySnapshot.empty) {
        setError('You have already completed this challenge.');
        setLoading(false);
        return;
      }

      resetGame();
      const newParticipant = {
        fullName: fullName.trim(),
        employeeId: normalizedEmpId,
        score: 0,
        badgesUnlocked: 0,
        badgesMissed: 0,
        timeTaken: 0,
        badge1Time: 0,
        badge2Time: 0,
        badge3Time: 0,
        badge4Time: 0,
        completedAt: ''
      };
      
      setParticipant(newParticipant);
      setGameStartTime(Date.now());
      navigate('/game');

    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-brand-gold/20 backdrop-blur-sm"
      >
        <h2 className="text-2xl md:text-3xl font-display font-semibold uppercase tracking-widest text-white mb-2 text-center">Registration</h2>
        <p className="text-white/60 text-center mb-8">Enter your details to begin the challenge. Each employee can play once.</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-xl mb-6 font-medium text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-brand-gold uppercase tracking-widest text-xs font-bold mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-black/20 text-white focus:border-brand-gold focus:ring-0 outline-none transition-colors text-lg placeholder-white/30"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-brand-gold uppercase tracking-widest text-xs font-bold mb-2">Employee ID</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-black/20 text-white focus:border-brand-gold focus:ring-0 outline-none transition-colors text-lg placeholder-white/30"
              placeholder="e.g. GGN/1234 or NW/1234"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!fullName.trim() || !employeeId.trim() || loading}
            className="w-full py-4 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold text-lg rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Begin Challenge'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-sm font-bold text-white/50 hover:text-white transition-colors">
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
