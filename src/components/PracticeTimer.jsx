import { useState, useEffect, useRef } from 'react';
import { Play, Square, Pause, RotateCcw } from 'lucide-react';

export default function PracticeTimer({ 
  title, 
  activeSeconds, 
  restSeconds, 
  totalCycles, 
  startVocab = 'start', 
  stopVocab = 'stop' 
}) {
  const [cycle, setCycle] = useState(1);
  const [phase, setPhase] = useState('idle'); // idle, active, rest, done
  const [timeLeft, setTimeLeft] = useState(activeSeconds);
  const [isActive, setIsActive] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(l => l - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      if (phase === 'active') {
        speak(stopVocab);
        if (cycle >= totalCycles) {
          setPhase('done');
          setIsActive(false);
          speak("Practice complete.");
        } else {
          setPhase('rest');
          setTimeLeft(restSeconds);
        }
      } else if (phase === 'rest') {
        speak(startVocab);
        setPhase('active');
        setTimeLeft(activeSeconds);
        setCycle(c => c + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, cycle, activeSeconds, restSeconds, totalCycles, startVocab, stopVocab]);

  const toggleTimer = () => {
    if (phase === 'done') return;
    
    if (!isActive && phase === 'idle') {
      speak(startVocab);
      setPhase('active');
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase('idle');
    setCycle(1);
    setTimeLeft(activeSeconds);
    window.speechSynthesis.cancel();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border p-4 rounded-lg my-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="font-bold text-foreground text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
            Cycle {Math.min(cycle, totalCycles)} of {totalCycles}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTimer} 
            disabled={phase === 'done'}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <button 
            onClick={resetTimer} 
            className="p-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className={`p-4 rounded-md text-center border transition-colors ${
        phase === 'active' ? 'bg-green-500/10 border-green-500/30' : 
        phase === 'rest' ? 'bg-orange-500/10 border-orange-500/30' : 
        phase === 'done' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-background border-border'
      }`}>
        <p className={`text-xs uppercase font-bold tracking-widest mb-1 ${
          phase === 'active' ? 'text-green-500' : 
          phase === 'rest' ? 'text-orange-500' : 
          phase === 'done' ? 'text-blue-500' : 'text-muted-foreground'
        }`}>
          {phase === 'idle' ? 'Ready' : phase}
        </p>
        <p className="text-4xl font-mono font-bold tracking-tighter text-foreground">
          {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
}
