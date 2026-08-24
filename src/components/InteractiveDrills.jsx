import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Activity, Volume2, VolumeX, MousePointer2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const getRandomDelay = () => 1000 + Math.random() * 2000;

export default function InteractiveDrills() {
  const [drillMode, setDrillMode] = useState('hold'); // 'hold' or 'flick'
  const [isActive, setIsActive] = useState(false);
  
  // Audio states
  const [noiseEnabled, setNoiseEnabled] = useState(false);
  const [metroEnabled, setMetroEnabled] = useState(false);
  const [bpm, setBpm] = useState(60);
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const metroIntervalRef = useRef(null);

  // Drill states
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [targetVisible, setTargetVisible] = useState(false);
  
  // Hold & Trace specific
  const [isHolding, setIsHolding] = useState(false);
  const [holdTimeLeft, setHoldTimeLeft] = useState(0);
  const holdTimerRef = useRef(null);
  
  // Flick specific
  const flickTimeoutRef = useRef(null);

  // --- Audio System ---
  useEffect(() => {
    // Initialize AudioContext on first user interaction or mount if allowed
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext && !audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      clearInterval(metroIntervalRef.current);
    };
  }, []);

  const playBeep = useCallback(() => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtxRef.current.currentTime);
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    osc.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtxRef.current.currentTime + 0.1);
    osc.stop(audioCtxRef.current.currentTime + 0.1);
  }, []);

  useEffect(() => {
    if (metroEnabled && isActive) {
      const intervalMs = (60 / bpm) * 1000;
      metroIntervalRef.current = setInterval(playBeep, intervalMs);
    } else {
      clearInterval(metroIntervalRef.current);
    }
    return () => clearInterval(metroIntervalRef.current);
  }, [metroEnabled, isActive, bpm, playBeep]);

  useEffect(() => {
    if (!audioCtxRef.current) return;
    if (noiseEnabled && isActive) {
      // Create white noise
      const bufferSize = audioCtxRef.current.sampleRate * 2;
      const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtxRef.current.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      // Filter for ambient rumble/crowd-like sound
      const filter = audioCtxRef.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      
      const gain = audioCtxRef.current.createGain();
      gain.gain.value = 0.5;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      
      noise.start();
      noiseNodeRef.current = noise;
    } else {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
        noiseNodeRef.current = null;
      }
    }
    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
        noiseNodeRef.current = null;
      }
    };
  }, [noiseEnabled, isActive]);

  // --- Drill Logic ---
  const spawnTarget = () => {
    const margin = 10;
    const x = margin + Math.random() * (100 - margin * 2);
    const y = margin + Math.random() * (100 - margin * 2);
    setTargetPos({ x, y });
    setTargetVisible(true);
    setIsHolding(false);
  };

  const startDrill = () => {
    setIsActive(true);
    setScore(0);
    setAttempts(0);
    
    if (drillMode === 'hold') {
      setTimeout(spawnTarget, 1000);
    } else {
      scheduleFlickTarget();
    }
  };

  const stopDrill = () => {
    setIsActive(false);
    setTargetVisible(false);
    setIsHolding(false);
    clearInterval(holdTimerRef.current);
    clearTimeout(flickTimeoutRef.current);
  };

  // Flick Drill specific
  const scheduleFlickTarget = () => {
    if (!isActive) return;
    const delay = getRandomDelay();
    flickTimeoutRef.current = setTimeout(() => {
      spawnTarget();
      // Target disappears quickly
      flickTimeoutRef.current = setTimeout(() => {
        setTargetVisible(false);
        setAttempts(a => a + 1);
        scheduleFlickTarget();
      }, 400); // 400ms window
    }, delay);
  };

  const handleFlickClick = () => {
    if (drillMode !== 'flick' || !targetVisible) return;
    clearTimeout(flickTimeoutRef.current);
    setTargetVisible(false);
    setScore(s => s + 1);
    setAttempts(a => a + 1);
    scheduleFlickTarget();
  };

  // Hold Drill specific
  const handleHoldEnter = () => {
    if (drillMode !== 'hold' || !targetVisible || isHolding) return;
    setIsHolding(true);
    setHoldTimeLeft(3); // 3 seconds hold required
    
    holdTimerRef.current = setInterval(() => {
      setHoldTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(holdTimerRef.current);
          setScore(s => s + 10); // 10 points for successful hold
          setAttempts(a => a + 1);
          setTargetVisible(false);
          setIsHolding(false);
          setTimeout(spawnTarget, 1000 + Math.random() * 1000);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  const handleHoldLeave = () => {
    if (drillMode !== 'hold' || !isHolding) return;
    clearInterval(holdTimerRef.current);
    setIsHolding(false);
    setScore(s => Math.max(0, s - 2)); // Penalize drift
  };


  return (
    <div className="space-y-6">
      
      {/* Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 bg-card border border-border p-6 rounded-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Zap className="text-yellow-500" /> Cognitive Drills
            </h3>
            
            <div className="flex bg-accent/30 p-1 rounded-lg">
              <button 
                onClick={() => { setDrillMode('hold'); if (isActive) stopDrill(); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${drillMode === 'hold' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Hold & Trace
              </button>
              <button 
                onClick={() => { setDrillMode('flick'); if (isActive) stopDrill(); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${drillMode === 'flick' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Micro-Flick
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Volume2 size={16}/> Sensory Pacing
            </h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ambient Noise</span>
              <button onClick={() => setNoiseEnabled(!noiseEnabled)} className={`p-2 rounded-full transition-colors ${noiseEnabled ? 'bg-blue-500 text-white' : 'bg-secondary text-muted-foreground'}`}>
                {noiseEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Heart Rate Sync</span>
                <button onClick={() => setMetroEnabled(!metroEnabled)} className={`p-2 rounded-full transition-colors ${metroEnabled ? 'bg-red-500 text-white' : 'bg-secondary text-muted-foreground'}`}>
                  <Activity size={16}/>
                </button>
              </div>
              {metroEnabled && (
                <div className="flex items-center gap-3 bg-background p-2 rounded border border-border">
                  <input type="range" min="50" max="120" value={bpm} onChange={e => setBpm(Number(e.target.value))} className="flex-1 accent-red-500" />
                  <span className="text-xs font-mono font-bold w-12 text-right">{bpm} BPM</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex gap-2">
             {!isActive ? (
                <button onClick={startDrill} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                  <Play size={18} /> Start Drill
                </button>
             ) : (
                <button onClick={stopDrill} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                  <Square size={18} /> Stop Drill
                </button>
             )}
          </div>
          
          {isActive && (
             <div className="bg-background border border-border rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Score / Attempts</p>
                <p className="text-3xl font-black font-mono text-blue-500">{score} <span className="text-xl text-muted-foreground">/ {attempts}</span></p>
             </div>
          )}
        </div>

        {/* Drill Arena */}
        <div className="lg:col-span-2">
           <div className="bg-card border border-border rounded-xl h-[500px] relative overflow-hidden flex flex-col cursor-crosshair">
              
              {!isActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-background/50 backdrop-blur-sm z-10">
                   <MousePointer2 size={48} className="text-muted-foreground mb-4 opacity-50" />
                   <h3 className="text-xl font-bold mb-2">Ready for {drillMode === 'hold' ? 'Hold & Trace' : 'Micro-Flick'}?</h3>
                   <p className="text-muted-foreground text-sm max-w-sm">
                     {drillMode === 'hold' 
                       ? "Target will lock for 3s. Keep your cursor dead center. Drifting penalizes your score."
                       : "Targets appear for 0.4s. Click them instantly. Tests your reaction and trigger break."}
                   </p>
                </div>
              ) : null}

              {/* Crosshair guidelines */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                 <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground" />
                 <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground" />
              </div>

              {/* Target Rendering */}
              <AnimatePresence>
                 {isActive && targetVisible && (
                   <motion.div
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0, opacity: 0 }}
                     transition={{ duration: 0.1 }}
                     className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full border-4 border-foreground bg-background flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                     style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                     onMouseEnter={handleHoldEnter}
                     onMouseLeave={handleHoldLeave}
                     onMouseDown={handleFlickClick}
                   >
                     {/* Inner Ring */}
                     <div className={`w-6 h-6 rounded-full transition-colors duration-300 ${isHolding ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                     
                     {/* Progress Ring for Hold Mode */}
                     {drillMode === 'hold' && isHolding && (
                       <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                         <circle 
                           cx="32" cy="32" r="30" 
                           fill="none" 
                           stroke="#22c55e" 
                           strokeWidth="2"
                           strokeDasharray="188"
                           strokeDashoffset={188 * (holdTimeLeft / 3)}
                           className="transition-all duration-100 ease-linear"
                         />
                       </svg>
                     )}
                   </motion.div>
                 )}
              </AnimatePresence>

           </div>
        </div>

      </div>
    </div>
  );
}
