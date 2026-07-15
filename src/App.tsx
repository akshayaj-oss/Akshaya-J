/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Game } from './pages/Game';
import { Final } from './pages/Final';
import { Leaderboard } from './pages/Leaderboard';
import { Admin } from './pages/Admin';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

function ClosedPopup() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700" />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <XCircle size={24} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <XCircle size={32} className="text-red-500" />
              </div>
              
              <h2 className="text-2xl font-display font-semibold uppercase tracking-widest text-white mb-4">
                Responses Are Stopped
              </h2>
              
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Thank you for your interest! The Badge Reveal Challenge is now closed and we are no longer accepting new responses.
              </p>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl transition-colors uppercase tracking-wide border border-white/10"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <GameProvider>
      <ClosedPopup />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={<Game />} />
          <Route path="/final" element={<Final />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}
