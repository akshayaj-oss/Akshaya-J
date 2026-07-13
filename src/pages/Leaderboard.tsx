import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Participant } from '../types';
import { Trophy, Medal, Home, Users, Clock, Hash } from 'lucide-react';
import { formatTime, cn } from '../lib/utils';
import { motion } from 'motion/react';

export function Leaderboard() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, 'participants');

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data: Participant[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Participant);
      });
      
      // Sort in memory: Highest Score, Lowest Time, Earliest Completion Time
      data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken;
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      });
      
      setParticipants(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const top3 = participants.slice(0, 3);
  const others = participants.slice(3);

  const stats = {
    total: participants.length,
    highestScore: participants.length > 0 ? participants[0].score : 0,
    avgScore: participants.length > 0 
      ? Math.round(participants.reduce((acc, p) => acc + p.score, 0) / participants.length)
      : 0,
    fastest: participants.length > 0 
      ? Math.min(...participants.map(p => p.timeTaken))
      : 0
  };

  return (
    <div className="min-h-screen overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold uppercase tracking-widest mb-2 text-white">Live Leaderboard</h1>
            <p className="text-white/60">Badge Reveal Challenge</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 border border-white/30 hover:bg-white/10 px-6 py-3 rounded-xl font-bold transition-colors uppercase tracking-widest text-xs"
          >
            <Home size={16} />
            Home
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/60 uppercase tracking-widest text-sm">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white/5 border border-brand-gold/20 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2">
                  <Users size={14} className="text-white/50"/> Total Participants
                </div>
                <div className="text-3xl font-extrabold tabular-nums">{stats.total}</div>
              </div>
              <div className="bg-white/5 border border-brand-gold/20 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2">
                  <Trophy size={14} className="text-brand-gold"/> Highest Score
                </div>
                <div className="text-3xl font-extrabold tabular-nums">{stats.highestScore}</div>
              </div>
              <div className="bg-white/5 border border-brand-gold/20 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2">
                  <Clock size={14} className="text-white/50"/> Fastest Time
                </div>
                <div className="text-3xl font-extrabold tabular-nums font-mono">{formatTime(stats.fastest)}</div>
              </div>
              <div className="bg-white/5 border border-brand-gold/20 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2">
                  <Hash size={14} className="text-white/50"/> Average Score
                </div>
                <div className="text-3xl font-extrabold tabular-nums">{stats.avgScore}</div>
              </div>
            </div>

            {/* Top 3 */}
            {top3.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2 uppercase tracking-widest">
                  <Trophy className="text-brand-gold" size={20}/> Top 3 Players
                </h2>
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 h-full md:h-72 mt-12 md:mt-0">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="w-full md:w-1/3 bg-white/5 border border-white/20 text-white rounded-t-3xl rounded-b-xl p-6 shadow-xl flex flex-col items-center relative h-56 backdrop-blur-md"
                    >
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center absolute -top-6 shadow-md border-4 border-[#001A3D]">
                        <Medal size={24} className="text-gray-600"/>
                      </div>
                      <div className="mt-6 text-center font-bold text-[10px] uppercase tracking-widest text-gray-300 mb-2">2nd Place</div>
                      <div className="text-xl font-extrabold mb-1 text-center line-clamp-1">{top3[1].fullName.split(' ')[0]}</div>
                      <div className="text-xs text-white/60 text-center mb-4 uppercase tracking-widest">{top3[1].employeeId}</div>
                      <div className="flex gap-4 w-full mt-auto">
                        <div className="bg-black/30 border border-white/10 p-2 rounded-xl flex-1 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Score</div>
                          <div className="text-lg font-black tabular-nums">{top3[1].score}</div>
                        </div>
                        <div className="bg-black/30 border border-white/10 p-2 rounded-xl flex-1 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Time</div>
                          <div className="text-lg font-black font-mono tabular-nums">{formatTime(top3[1].timeTaken)}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full md:w-1/3 bg-brand-gold text-brand-blue rounded-t-3xl rounded-b-xl p-6 shadow-2xl flex flex-col items-center relative h-64 z-10"
                  >
                    <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center absolute -top-8 shadow-md border-4 border-[#001A3D]">
                      <Trophy size={32} className="text-yellow-900"/>
                    </div>
                    <div className="mt-8 text-center font-bold text-[10px] uppercase tracking-[2px] text-yellow-900 mb-2">1st Place</div>
                    <div className="text-2xl font-extrabold mb-1 text-center line-clamp-1 uppercase">{top3[0].fullName.split(' ')[0]}</div>
                    <div className="text-sm font-bold text-yellow-900/60 text-center mb-4 uppercase tracking-widest">{top3[0].employeeId}</div>
                    <div className="flex gap-4 w-full mt-auto">
                      <div className="bg-black/10 border border-black/10 p-2 rounded-xl flex-1 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-widest">Score</div>
                        <div className="text-xl font-black tabular-nums">{top3[0].score}</div>
                      </div>
                      <div className="bg-black/10 border border-black/10 p-2 rounded-xl flex-1 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-widest">Time</div>
                        <div className="text-xl font-black font-mono tabular-nums">{formatTime(top3[0].timeTaken)}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 3rd Place */}
                  {top3[2] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                      className="w-full md:w-1/3 bg-white/5 border border-orange-900/50 text-white rounded-t-3xl rounded-b-xl p-6 shadow-xl flex flex-col items-center relative h-48 backdrop-blur-md"
                    >
                      <div className="w-12 h-12 bg-orange-700 rounded-full flex items-center justify-center absolute -top-6 shadow-md border-4 border-[#001A3D]">
                        <Medal size={24} className="text-orange-200"/>
                      </div>
                      <div className="mt-4 text-center font-bold text-[10px] uppercase tracking-widest text-orange-300 mb-2">3rd Place</div>
                      <div className="text-xl font-extrabold mb-1 text-center line-clamp-1">{top3[2].fullName.split(' ')[0]}</div>
                      <div className="text-xs text-white/60 text-center mb-4 uppercase tracking-widest">{top3[2].employeeId}</div>
                      <div className="flex gap-4 w-full mt-auto">
                        <div className="bg-black/30 border border-white/10 p-2 rounded-xl flex-1 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Score</div>
                          <div className="text-lg font-black tabular-nums">{top3[2].score}</div>
                        </div>
                        <div className="bg-black/30 border border-white/10 p-2 rounded-xl flex-1 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Time</div>
                          <div className="text-lg font-black font-mono tabular-nums">{formatTime(top3[2].timeTaken)}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Rest of the list */}
            {others.length > 0 && (
              <div className="bg-white/5 border border-brand-gold/20 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="p-6 border-b border-brand-gold/20">
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">All Participants</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-brand-gold text-[10px] uppercase tracking-widest font-bold">
                        <th className="p-4 border-b border-white/10">Rank</th>
                        <th className="p-4 border-b border-white/10">Name</th>
                        <th className="p-4 border-b border-white/10 text-center">Score</th>
                        <th className="p-4 border-b border-white/10 text-center">Badges</th>
                        <th className="p-4 border-b border-white/10 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {others.map((p, index) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors border-b border-white/10 last:border-0">
                          <td className="p-4 font-bold text-white/50">#{index + 4}</td>
                          <td className="p-4">
                            <div className="font-bold">{p.fullName.split(' ')[0]}</div>
                            <div className="text-[10px] text-white/50">{p.employeeId}</div>
                          </td>
                          <td className="p-4 text-center font-black text-lg tabular-nums">{p.score}</td>
                          <td className="p-4 text-center font-medium text-white/50 tabular-nums">{p.badgesUnlocked}/4</td>
                          <td className="p-4 text-right font-mono font-bold text-white/70 tabular-nums">{formatTime(p.timeTaken)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
