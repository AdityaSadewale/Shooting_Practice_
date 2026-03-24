import { useState, useEffect } from 'react';
import { LogOut, LineChart, Target, Flame, Award, Apple, Globe, ExternalLink, Youtube, Crosshair } from 'lucide-react';
import { clearUser, getStreak } from '../lib/store';
import Timeline from '../components/Timeline';
import Analytics from '../components/Analytics';
import DietInfo from '../components/DietInfo';
import ShootingFinal from '../components/ShootingFinal';
import { motion, AnimatePresence } from 'framer-motion';

const shooter1 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzhvtnHo_DV7-AmiVihIdJPbZ6ioLh2zUCxQ&s';
const shooter2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzAf4QXhkdkpsE5bxeTJVQOeekVuDm5JdwIw&s';

export default function Dashboard({ user, onLogout }) {
  const [view, setView] = useState('timeline');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const handleLogout = () => {
    clearUser();
    onLogout();
  };

  const roadToGoldContent = (
    <>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-500">
        <Award size={20} /> Road to Gold
      </h2>
      <div className="space-y-6 text-sm">
        <div className="bg-accent/50 p-4 rounded-lg border border-border/50">
          <h3 className="font-semibold text-foreground mb-1">Breathing</h3>
          <p className="text-muted-foreground">Synchronizing the shot with the respiratory pause. Take 2-3 deep breaths, let the shot break in the natural pause.</p>
        </div>
        <div className="bg-accent/50 p-4 rounded-lg border border-border/50">
          <h3 className="font-semibold text-foreground mb-1">Trigger</h3>
          <p className="text-muted-foreground">Smooth, continuous pressure straight to the rear. Avoid snatching.</p>
        </div>
        <div className="bg-accent/50 p-4 rounded-lg border border-border/50">
          <h3 className="font-semibold text-foreground mb-1">Match Pressure</h3>
          <p className="text-muted-foreground">The 3-breath reset rule: After a bad shot, step out of position, take 3 deep breaths, rebuild your stance.</p>
        </div>
        {/* Featured Image */}
        <div className="mt-6 rounded-xl overflow-hidden border border-border/50 shadow-2xl relative h-48 group">
           <img src={shooter1} alt="Indian Olympic Shooter Aiming" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
             <p className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Trust the process.</p>
           </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans relative overflow-hidden">
      {/* Background Image Overlay for Sports Vibes */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 transition-opacity duration-1000" style={{ backgroundImage: `url(${shooter1})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }}></div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-md p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20 shrink-0 shadow-sm">
          <div className="min-w-0 pr-2 flex items-center gap-3">
            <h1 className="text-lg sm:text-2xl font-black tracking-tighter flex items-center gap-1 truncate text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 uppercase">
              <Crosshair className="text-blue-500 shrink-0" size={24} strokeWidth={3} /> 
              <span>HIT</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto hide-scrollbar">
            {/* Nav Tabs */}
            <div className="flex bg-background/60 backdrop-blur-xl p-1.5 rounded-full border border-border/60 shadow-inner">
              <button onClick={() => setView('timeline')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${view === 'timeline' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Target size={15} /> Training
              </button>
              <button onClick={() => setView('analytics')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${view === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <LineChart size={15} /> Analytics
              </button>
              <button onClick={() => setView('finals')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${view === 'finals' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Award size={15} /> Finals
              </button>
              <button onClick={() => setView('diet')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${view === 'diet' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Apple size={15} /> Diet
              </button>
            </div>

            {/* External Links */}
            <div className="hidden min-[1100px]:flex items-center gap-4 border-l-2 border-border/40 pl-5 ml-2">
              <a href="https://thenrai.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-500 text-xs font-bold uppercase tracking-wider transition-colors group">
                <Globe size={14} className="group-hover:scale-125 transition-transform origin-bottom" /> NRAI
              </a>
              <a href="https://www.maharifle.org/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-green-500 text-xs font-bold uppercase tracking-wider transition-colors group">
                <ExternalLink size={14} className="group-hover:scale-125 transition-transform origin-bottom" /> MRA
              </a>
              <a href="https://www.youtube.com/@satvicyoga" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-purple-500 text-xs font-bold uppercase tracking-wider transition-colors group">
                <Youtube size={14} className="group-hover:scale-125 transition-transform origin-bottom" /> Meditation
              </a>
            </div>

            <div className="hidden min-[900px]:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-500 rounded-full border border-orange-500/20 whitespace-nowrap ml-2 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Flame size={16} className={streak > 0 ? "fill-orange-500" : ""} />
              <span className="font-bold text-sm tracking-wide">{streak} Streak</span>
            </div>

            <button onClick={handleLogout} className="p-2 rounded-full border border-transparent hover:border-destructive/30 hover:bg-destructive/10 text-destructive transition-all ml-auto sm:ml-0">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto pb-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {view === 'timeline' && (
                  <>
                    <Timeline user={user} onSessionSaved={() => setStreak(getStreak())} />
                    <div className="md:hidden mt-10 p-5 bg-card border border-border rounded-xl shadow-lg">
                      {roadToGoldContent}
                    </div>
                  </>
                )}
                
                {view === 'analytics' && <Analytics />}
                
                {view === 'finals' && <ShootingFinal userName={user.name} />}
                
                {view === 'diet' && <DietInfo />}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <footer className="w-full text-center py-6 mt-12 border-t border-border/50 bg-background/50 backdrop-blur-sm z-20 relative">
            <p className="text-[11px] sm:text-sm text-muted-foreground font-medium flex items-center justify-center gap-1">
              Created by <span className="text-blue-500 hover:text-blue-400 font-semibold tracking-wide transition-colors">Aditya_Sadewale</span> ❤️
            </p>
          </footer>
        </main>
      </div>

      {/* Road to Gold Sidebar Desktop */}
      <aside className="shrink-0 w-full md:w-80 border-l border-border bg-card/80 backdrop-blur-md p-6 overflow-y-auto hidden md:block z-20 shadow-xl">
        {roadToGoldContent}
      </aside>
    </div>
  );
}
