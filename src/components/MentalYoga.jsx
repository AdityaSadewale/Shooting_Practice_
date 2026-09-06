import React, { useState } from 'react';
import { Brain, HeartPulse, Activity, Zap, Star, ShieldCheck, Crown, ArrowRight, Eye, Wind, Sun, Moon, Target, Gamepad2, Calendar, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function MentalYoga() {
  const [selectedDay, setSelectedDay] = useState(1);

  const scheduleDays = [
    {
      day: 1,
      title: "Jedi Mind Tricks (Focus)",
      morning: "15 mins Trataka (Staring Contest with a dot). Try not to blink until your eyes water like you just watched a sad movie. It actually sharpens your aim!",
      prePractice: "10 mins Nadi Shodhana (Breathing like Darth Vader). Inhale left, exhale right. Tells your heart to chill out before you hold that heavy rifle.",
      postPractice: "15 mins of 'Pretend you're a wet noodle' (Muscle Relaxation). Unclench that jaw, you're not chewing the target!",
      night: "5 mins Visualization. Replay your 10 best shots. Ignore the 8s, they never happened. Sweet 10.9 dreams!"
    },
    {
      day: 2,
      title: "Zen & The Art of Not Freaking Out",
      morning: "20 mins Mindfulness. Sit still. When your brain says 'What's for lunch?', say 'Not now, brain, I am being zen.'",
      prePractice: "5 mins '3-Breath Reset'. Step off the line, take 3 deep breaths, and pretend that last bad shot was shot by the person next to you.",
      postPractice: "Journaling: Write down 3 epic things you did, and 1 time you didn't throw your gun out the window.",
      night: "10 mins deep belly breathing in the dark. Like a sleeping bear, but a bear with Olympic dreams."
    },
    {
      day: 3,
      title: "Match Pressure Survival Guide",
      morning: "10 mins Surya Namaskar. Salute the sun, stretch those stiff shooter shoulders so you don't walk like a robot.",
      prePractice: "Visualization: Picture the crowd going wild. Picture the announcer saying your name. Now try not to get sweaty palms. Good luck!",
      postPractice: "15 mins of running around like a maniac, then immediately trying to hold completely still. Welcome to biathlon without the snow.",
      night: "Audio-guided Yoga Nidra (Nap time, but make it spiritual). Deep subconscious recovery for tired trigger fingers."
    },
    {
      day: 4,
      title: "Eagle Eyes & Ninja Balance",
      morning: "15 mins Tree Pose with your eyes closed. Try not to fall over and break the furniture. Great for your zero-point stance!",
      prePractice: "Eye tracking: Look near, look far, look near, look far. Basically, try to make yourself dizzy to train your eye muscles.",
      postPractice: "Palming: Rub your hands together and cover your eyes. Ahhh, darkness. The perfect escape from the glaring range lights.",
      night: "10 mins of stretching while thinking about how perfectly still you held the gun today. You are a statue. A very accurate statue."
    },
    {
      day: 5,
      title: "Beast Mode Activation",
      morning: "15 mins Box Breathing. Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat until you feel like a Navy SEAL ready to hit 10.9s.",
      prePractice: "Listen to your hype playlist. Nod your head. Tell the target it's about to get destroyed.",
      postPractice: "Cold shower. Yes, it's terrible. Yes, it resets your nervous system. Scream internally.",
      night: "Visualize the gold medal around your neck. Practice your victory wave. Don't hit your lamp while doing it."
    }
  ];
  

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Brain size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Brain className="text-purple-300" size={32} />
            Mental Strength & Yoga
          </h2>
          <p className="text-indigo-100 text-lg mb-6">
            Unlock your full potential. Discover the 5-day daily routines used by National and International shooters to build unshakable focus, emotional control, and peak physical conditioning.
          </p>
        </div>
      </div>

      {/* 5-Day Mental Conditioning Schedule */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-500" size={24} />
            <h3 className="text-xl font-bold text-foreground">5-Day Psychological Conditioning Schedule</h3>
          </div>
          <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pro Routine</span>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Following a strict mental schedule is just as important as dry firing. This 5-day rotation builds the psychological resilience required for international competitions.
        </p>

        {/* Day Selector */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
          {scheduleDays.map((s) => (
            <button 
              key={s.day}
              onClick={() => setSelectedDay(s.day)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedDay === s.day ? 'bg-blue-600 text-white shadow-md' : 'bg-accent/30 text-muted-foreground hover:bg-accent hover:text-foreground border border-border'}`}
            >
              Day {s.day}: {s.title.split(' ')[0]}
            </button>
          ))}
        </div>

        
        {/* Schedule Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedDay}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-black text-foreground border-b border-border pb-2 mb-4">
                {scheduleDays[selectedDay - 1].title}
              </h4>
              
              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <Sun className="text-yellow-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Morning Routine</p>
                  <p className="text-sm font-medium text-foreground">{scheduleDays[selectedDay - 1].morning}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <Target className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Before Practice</p>
                  <p className="text-sm font-medium text-foreground">{scheduleDays[selectedDay - 1].prePractice}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <Activity className="text-green-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">After Practice (Recovery)</p>
                  <p className="text-sm font-medium text-foreground">{scheduleDays[selectedDay - 1].postPractice}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <Moon className="text-indigo-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Night Routine</p>
                  <p className="text-sm font-medium text-foreground">{scheduleDays[selectedDay - 1].night}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dynamic Image Display based on selected day */}
          <div className="relative rounded-xl overflow-hidden border border-border shadow-md h-[300px] md:h-auto hidden sm:block">
            {selectedDay === 2 || selectedDay === 5 ? (
              <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8 text-center">
                <Target size={80} className="text-purple-400 mb-4 opacity-80" strokeWidth={1} />
                <h4 className="text-xl font-bold text-white mb-2">Mental Visualization Phase</h4>
                <p className="text-sm text-purple-200 opacity-80">Full equipment on. Sights aligned. Mind clear.</p>
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
              </div>
            ) : (
              <img 
                src={
                  selectedDay === 1 ? "/images/ind_shooter_meditation.png" : 
                  selectedDay === 3 ? "/images/ind_shooter_night.png" :
                  selectedDay === 4 ? "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop" :
                  "/images/ind_shooter_meditation.png"
                } 
                alt={`Indian Shooter mental training Day ${selectedDay}`} 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <p className="text-white font-bold">
                {selectedDay === 1 ? "Morning Meditation (Don't fall back asleep!)" : 
                 selectedDay === 2 ? "Pre-Shot Visualization (See the 10.9)" : 
                 selectedDay === 3 ? "Nightly Recovery (Chilling out)" :
                 selectedDay === 4 ? "Balance & Focus Training" :
                 "Peak State Activation (Beast Mode)"}
              </p>
              <p className="text-white/70 text-xs">Essential practices for international-level performance... with a smile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Focus Games Section */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Gamepad2 className="text-purple-500" size={24} />
          <h3 className="text-xl font-bold text-foreground">Mental Focus Games</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Play these games to build your mental stamina and train your brain to quickly snap into the "zone".
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-accent/20 border border-border p-4 rounded-lg text-center hover:bg-accent/40 transition-colors cursor-pointer group">
            <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Eye className="text-purple-500" />
            </div>
            <h4 className="font-bold mb-1">Schulte Table</h4>
            <p className="text-xs text-muted-foreground">Find numbers 1-25 as fast as possible to improve peripheral vision and attention span.</p>
          </div>
          
          <div className="bg-accent/20 border border-border p-4 rounded-lg text-center hover:bg-accent/40 transition-colors cursor-pointer group">
            <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Brain className="text-blue-500" />
            </div>
            <h4 className="font-bold mb-1">Dual N-Back</h4>
            <p className="text-xs text-muted-foreground">Enhance working memory and fluid intelligence. Essential for processing wind flags and timing.</p>
          </div>

          <div className="bg-accent/20 border border-border p-4 rounded-lg text-center hover:bg-accent/40 transition-colors cursor-pointer relative overflow-hidden group">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><Lock size={12}/> Premium</span>
             </div>
            <div className="bg-rose-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <HeartPulse className="text-rose-500" />
            </div>
            <h4 className="font-bold mb-1">Biofeedback Training</h4>
            <p className="text-xs text-muted-foreground">Sync your breathing to a visual pacer to actively lower heart rate on command.</p>
          </div>
        </div>
      </section>

      {/* Mental Strength & Yoga Basics Section */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="text-yellow-500" size={24} />
          <h3 className="text-xl font-bold text-foreground">Core Fundamentals</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-accent/30 rounded-lg border border-border">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Eye className="text-blue-500" size={18}/> Visualization</h4>
            <p className="text-sm text-muted-foreground">
              Mentally rehearse your perfect shot process before stepping on the line. See the target, feel the trigger, and picture the perfect 10.9.
            </p>
          </div>
          
          <div className="p-5 bg-accent/30 rounded-lg border border-border">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Wind className="text-teal-500" size={18}/> Emotional Regulation</h4>
            <p className="text-sm text-muted-foreground">
              A bad shot will happen. The key is recovery. Use the "3-Breath Rule" to flush the negative emotion and reset for the next shot.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/30 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Crown size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-lg">
            <Crown size={14} /> Premium Mode Access
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-3">Elevate Your Game to International Standards</h3>
          <p className="text-muted-foreground max-w-3xl mb-8">
            Upgrade your account to unlock the ultimate arsenal of tools. Get access to the exact routines, mental games, and data analytics used by National and International medalists.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background/80 backdrop-blur border border-amber-500/20 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
              <div className="bg-amber-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                <Star size={20} />
              </div>
              <h4 className="font-bold mb-2">1-on-1 Coaching</h4>
              <p className="text-sm text-muted-foreground">Direct chat and video analysis with International shooters and sports psychologists.</p>
            </div>
            
            <div className="bg-background/80 backdrop-blur border border-amber-500/20 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
              <div className="bg-amber-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                <Gamepad2 size={20} />
              </div>
              <h4 className="font-bold mb-2">Full Game Access</h4>
              <p className="text-sm text-muted-foreground">Unlock all 15+ biofeedback and neuro-cognitive training games to sharpen your mind.</p>
            </div>

            <div className="bg-background/80 backdrop-blur border border-amber-500/20 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
              <div className="bg-amber-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                <Activity size={20} />
              </div>
              <h4 className="font-bold mb-2">Smartwatch Sync</h4>
              <p className="text-sm text-muted-foreground">Connect Apple Watch or Garmin to track resting heart rate and stress levels live.</p>
            </div>

            <div className="bg-background/80 backdrop-blur border border-amber-500/20 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
              <div className="bg-amber-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                <Trophy size={20} />
              </div>
              <h4 className="font-bold mb-2">Match Simulations</h4>
              <p className="text-sm text-muted-foreground">Audio tracks simulating ISSF World Cup final environments (crowd noise, announcements).</p>
            </div>
          </div>
          
          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <CheckCircle2 className="text-amber-500" />
               <span className="font-medium text-sm">Join 5,000+ elite shooters training smarter today.</span>
            </div>
            <button className="whitespace-nowrap flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Upgrade to Premium <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
