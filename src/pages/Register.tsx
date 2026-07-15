import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-brand-gold/20 backdrop-blur-sm"
      >
        <h2 className="text-2xl md:text-3xl font-display font-semibold uppercase tracking-widest text-white mb-2 text-center">Registrations Closed</h2>
        <p className="text-white/60 text-center mb-8">Thank you for your interest. We are no longer accepting responses for this challenge.</p>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="w-full py-4 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold text-lg rounded-xl transition-colors flex items-center justify-center uppercase tracking-wide">
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
