import { useState, useEffect } from 'react';
import { saveUser } from '../lib/store';
import { Target, Crosshair, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const MOTIVATIONS = [
  "Confidence is earned in the dry fire.",
  "Trust your hold. The ten will come naturally.",
  "Precision is not an act, but a daily habit.",
  "Every champion was once a contender who refused to give up."
];

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('');
  const [weapon, setWeapon] = useState('');
  const [error, setError] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setQuote(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your name.');
    if (!weapon) return setError('Please select your discipline.');

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      weapon,
    };
    saveUser(user);
    onComplete(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Abstract Background */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 z-0 bg-background/80 pointer-events-none"></div>

      {/* Animated Login Card */}
      <motion.div 
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
        className="max-w-md w-full bg-card/60 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl p-8 z-10 relative m-4"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <Target className="w-12 h-12 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </motion.div>
          <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 uppercase">10m Mastery</h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2 text-left"
          >
            <Quote className="text-blue-500 shrink-0 mt-0.5" size={14} />
            <p className="text-sm font-medium text-blue-400 italic tracking-wide">{quote}</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Shooter Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Event</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setWeapon('Air Pistol')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                  weapon === 'Air Pistol'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500 shadow-lg shadow-blue-500/10 scale-105'
                    : 'border-border/50 text-muted-foreground hover:bg-accent/50 hover:border-border'
                }`}
              >
                <Crosshair className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Air Pistol</span>
              </button>
              <button
                type="button"
                onClick={() => setWeapon('Air Rifle')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                  weapon === 'Air Rifle'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500 shadow-lg shadow-blue-500/10 scale-105'
                    : 'border-border/50 text-muted-foreground hover:bg-accent/50 hover:border-border'
                }`}
              >
                <Target className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Air Rifle</span>
              </button>
            </div>
          </div>

          <div className="min-h-[20px]">
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium text-center">{error}</motion.p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            Start Training
          </button>
        </form>
      </motion.div>
    </div>
  );
}
