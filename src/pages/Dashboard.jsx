import { useState, useEffect } from 'react';
import { LogOut, LineChart, Target, Flame, Award, Apple, Globe, ExternalLink, Youtube, Crosshair, Brain, BookOpen, Crown } from 'lucide-react';
import { clearUser, getStreak } from '../lib/store';
import Timeline from '../components/Timeline';
import Analytics from '../components/Analytics';
import DietInfo from '../components/DietInfo';
import ShootingFinal from '../components/ShootingFinal';
import InteractiveDrills from '../components/InteractiveDrills';
import TargetAnalysis from '../components/TargetAnalysis';
import MentalYoga from '../components/MentalYoga';
import PremiumFeatures from '../components/PremiumFeatures';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';

const shooter1 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzhvtnHo_DV7-AmiVihIdJPbZ6ioLh2zUCxQ&s';

export default function Dashboard({ user, onLogout }) {
  const [view, setView] = useState('timeline');
  const [streak, setStreak] = useState(() => getStreak());

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
        <header className="border-b border-border bg-card/80 backdrop-blur-md p-3 sm:p-4 flex items-center justify-between gap-4 z-20 shrink-0 shadow-sm w-full">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <h1 className="text-lg sm:text-2xl font-black tracking-tighter flex items-center gap-1.5 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 uppercase">
              <Crosshair className="text-blue-500 shrink-0" size={24} strokeWidth={3} /> 
              <span>HIT</span>
            </h1>
          </div>
          
          {/* Middle: Navigation Tabs (Scrolls inline on smaller screens) */}
          <div className="flex-1 overflow-x-auto hide-scrollbar mx-2 sm:mx-4">
            <div className="flex items-center gap-1 bg-background/60 backdrop-blur-xl p-1 rounded-full border border-border/60 shadow-inner w-max mx-auto">
              <button onClick={() => setView('timeline')} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${view === 'timeline' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Target size={14} /> Training
              </button>
              <button onClick={() => setView('analytics')} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${view === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <BookOpen size={14} /> Diary & Analytics
              </button>
              <button onClick={() => setView('finals')} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${view === 'finals' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Award size={14} /> Finals
              </button>
              <button onClick={() => setView('drills')} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${view === 'drills' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Brain size={14} /> Drills
              </button>
              <button onClick={() => setView('diet')} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${view === 'diet' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Apple size={14} /> Diet
              </button>
              <button onClick={() => setView('mental')} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${view === 'mental' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Brain size={14} /> Mental & Yoga
              </button>
              <button onClick={() => setView('premium')} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${view === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10'}`}>
                <Crown size={14} className={view !== 'premium' ? "animate-pulse" : ""} /> PRO
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* External Links */}
            <div className="hidden xl:flex items-center gap-4 mr-2">
              <a href="https://thenrai.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 text-xs font-bold uppercase tracking-wider transition-colors group">
                <Globe size={13} className="group-hover:scale-125 transition-transform origin-bottom" /> NRAI
              </a>
              <a href="https://www.maharifle.org/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-green-500 text-xs font-bold uppercase tracking-wider transition-colors group">
                <ExternalLink size={13} className="group-hover:scale-125 transition-transform origin-bottom" /> MRA
              </a>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-500 rounded-full border border-orange-500/20 whitespace-nowrap shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Flame size={14} className={streak > 0 ? "fill-orange-500 animate-pulse" : ""} />
              <span className="font-bold text-[10px] sm:text-sm tracking-wide">{streak} Streak</span>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="p-1.5 sm:p-2 rounded-full bg-destructive/5 border border-transparent hover:border-destructive/30 hover:bg-destructive/10 text-destructive transition-all" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto pb-8 relative z-10">
            <GlobalAudioPlayer />
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

                {view === 'drills' && (
                  <div className="space-y-8">
                    <InteractiveDrills />
                    <TargetAnalysis />
                  </div>
                )}
                
                {view === 'diet' && <DietInfo />}
                
                {view === 'mental' && <MentalYoga />}

                {view === 'premium' && <PremiumFeatures />}
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
