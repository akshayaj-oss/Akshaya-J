import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Participant } from '../types';
import { formatTime } from '../lib/utils';
import { Download, Search, Home, Lock, Users, Trophy, Trash2 } from 'lucide-react';

export function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = collection(db, 'participants');

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data: Participant[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Participant);
      });
      
      data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken;
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      });
      
      setParticipants(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (password === adminPass) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const exportCSV = () => {
    const headers = ['Rank', 'Name', 'Employee ID', 'Score', 'Badges Unlocked', 'Total Time', 'Completion Date'];
    const rows = participants.map((p, index) => [
      index + 1,
      `"${p.fullName}"`,
      `"${p.employeeId}"`,
      p.score,
      p.badgesUnlocked,
      p.timeTaken,
      `"${new Date(p.completedAt).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "manager_challenge_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to completely reset the leaderboard? This action cannot be undone.')) {
      return;
    }
    
    setIsResetting(true);
    try {
      // Get all documents in the collection and delete them
      const snapshot = await getDocs(collection(db, 'participants'));
      const deletePromises = snapshot.docs.map(document => 
        deleteDoc(doc(db, 'participants', document.id))
      );
      await Promise.all(deletePromises);
      alert('Leaderboard has been successfully reset.');
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
      alert('Failed to reset leaderboard. Check console for details.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white/5 border border-brand-gold/20 p-8 rounded-2xl shadow-xl max-w-sm w-full text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-display font-semibold uppercase tracking-widest text-white mb-6">Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black/20 text-white focus:border-brand-gold focus:ring-0 outline-none mb-4"
              placeholder="Enter Admin Password"
            />
            <button
              type="submit"
              className="w-full bg-brand-gold text-brand-blue font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-yellow-500 transition-colors"
            >
              Login
            </button>
          </form>
          <button onClick={() => navigate('/')} className="mt-4 text-sm text-white/50 hover:text-white transition-colors">Return Home</button>
        </div>
      </div>
    );
  }

  const filteredParticipants = participants.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen overflow-y-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/5 p-6 rounded-2xl shadow-sm border border-brand-gold/20 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-white">Admin Dashboard</h1>
            <p className="text-white/60 text-sm">Badge Reveal Challenge</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-2 bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs tracking-widest font-bold uppercase transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              {isResetting ? 'Resetting...' : 'Reset'}
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg text-xs tracking-widest font-bold uppercase transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs tracking-widest font-bold uppercase transition-colors"
            >
              <Home size={16} />
              Home
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 p-6 rounded-2xl shadow-sm border border-brand-gold/20 flex items-center gap-4 backdrop-blur-sm">
            <div className="bg-black/20 p-4 rounded-full text-white/50 border border-white/10"><Users size={24}/></div>
            <div>
              <div className="text-[10px] tracking-widest text-brand-gold font-bold uppercase">Total Participants</div>
              <div className="text-3xl font-extrabold text-white tabular-nums">{participants.length}</div>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl shadow-sm border border-brand-gold/20 flex items-center gap-4 backdrop-blur-sm">
            <div className="bg-brand-gold/10 p-4 rounded-full text-brand-gold border border-brand-gold/30"><Trophy size={24}/></div>
            <div>
              <div className="text-[10px] tracking-widest text-brand-gold font-bold uppercase">Current Leader</div>
              <div className="text-xl font-extrabold text-white line-clamp-1 uppercase">
                {participants.length > 0 ? participants[0].fullName : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl shadow-sm border border-brand-gold/20 overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-brand-gold/20 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/10">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Participant Results</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-brand-gold placeholder-white/30"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-brand-gold text-[10px] uppercase tracking-widest font-bold">
                  <th className="p-4 border-b border-white/10">Rank</th>
                  <th className="p-4 border-b border-white/10">Name</th>
                  <th className="p-4 border-b border-white/10">Employee ID</th>
                  <th className="p-4 border-b border-white/10">Score</th>
                  <th className="p-4 border-b border-white/10">Badges</th>
                  <th className="p-4 border-b border-white/10">Total Time</th>
                  <th className="p-4 border-b border-white/10">Completion Date</th>
                </tr>
              </thead>
              <tbody className="text-white text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-white/50">Loading data...</td>
                  </tr>
                ) : filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-white/50">No participants found.</td>
                  </tr>
                ) : (
                  filteredParticipants.map((p, index) => (
                    <tr key={p.id} className="hover:bg-white/5 border-b border-white/10 last:border-0 transition-colors">
                      <td className="p-4 font-bold text-white/50">#{index + 1}</td>
                      <td className="p-4 font-medium">{p.fullName}</td>
                      <td className="p-4 font-mono text-xs bg-black/30 rounded border border-white/10 px-2 py-1 inline-block mt-3">{p.employeeId}</td>
                      <td className="p-4 font-bold tabular-nums">{p.score}</td>
                      <td className="p-4 tabular-nums">{p.badgesUnlocked}/4</td>
                      <td className="p-4 font-mono tabular-nums">{formatTime(p.timeTaken)}</td>
                      <td className="p-4 text-white/50 tabular-nums">{new Date(p.completedAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
