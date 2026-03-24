import { useState } from 'react';
import { Play, Square, Mic, Crosshair, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShootingFinal({ userName = "Shooter" }) {
  const [shots, setShots] = useState([]);
  const [currentScore, setCurrentScore] = useState('');
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [statusText, setStatusText] = useState('Standby');

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (cmd) => {
    switch (cmd) {
      case 'load':
        speak("Load.");
        setStatusText("Loaded");
        break;
      case 'stop':
        speak("Stop.");
        setStatusText("Stopped");
        break;
      case 'ranking':
        const mockOpponentTotal = (shots.length * 10.3).toFixed(1);
        const myTotal = shots.reduce((acc, s) => acc + parseFloat(s), 0).toFixed(1);
        const diff = (myTotal - mockOpponentTotal).toFixed(1);
        
        let rankText = "";
        if (diff > 0) {
           rankText = `${userName} is ranking first by ${diff} points.`;
        } else {
           rankText = `Opponent is ranking first by ${Math.abs(diff)} points.`;
        }
        speak(`Which one is ranking by these numbers? ${rankText}`);
        break;
      case 'onePoint':
        speak(`${userName} is going to one point for the gold!`);
        break;
      default:
        break;
    }
  };

  const startMatch = () => {
    setShots([]);
    setIsMatchActive(true);
    setStatusText('Match Started');
    speak("Athletes to the line. Load.");
  };

  const stopMatch = () => {
    setIsMatchActive(false);
    setStatusText('Match Aborted');
    speak("Stop. Unload.");
  };

  const handleShot = (e) => {
    e.preventDefault();
    if (!currentScore || isNaN(currentScore) || currentScore < 0 || currentScore > 10.9) return;
    if (shots.length >= 16) {
      speak("Match has ended.");
      return;
    }

    const val = parseFloat(currentScore).toFixed(1);
    const newShots = [...shots, val];
    setShots(newShots);
    setCurrentScore('');

    let announcement = `Score, ${val}.`;
    setStatusText(`Shot ${newShots.length} - Score: ${val}`);
    
    if (newShots.length === 16) {
      announcement += ` End of the match. ${userName} finishes the final.`;
      setIsMatchActive(false);
    }
    speak(announcement);
  };

  return (
    <div className="bg-card border border-border p-6 rounded-xl space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Award className="text-yellow-500" />
          ISSF 16-Shot Final Simulation
        </h3>
        <div className="flex gap-2">
          {!isMatchActive ? (
            <button onClick={startMatch} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold transition-colors">
              <Play size={16} /> Start Final
            </button>
          ) : (
            <button onClick={stopMatch} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors">
              <Square size={16} /> Stop Match
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-accent/20 border border-border p-4 rounded-lg text-center">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
            <p className="text-lg font-mono text-blue-500 dark:text-blue-400">{statusText}</p>
          </div>

          <form onSubmit={handleShot} className="space-y-3">
            <label className="text-sm font-medium">Record Shot (0.0 - 10.9)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.1" 
                value={currentScore}
                onChange={(e) => setCurrentScore(e.target.value)}
                placeholder="10.5"
                disabled={!isMatchActive || shots.length >= 16}
                className="w-full bg-background border border-border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 font-mono"
              />
              <button 
                type="submit" 
                disabled={!isMatchActive || shots.length >= 16}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 flex items-center gap-1"
              >
                <Crosshair size={18} /> Fire
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center">{shots.length} / 16 Shots taken</p>
          </form>

          {/* Voice Command Controls */}
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2 flex items-center gap-1"><Mic size={14}/> Voice Commands</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleCommand('load')} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border">"Load"</button>
              <button onClick={() => handleCommand('stop')} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border">"Stop"</button>
              <button onClick={() => handleCommand('ranking')} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border">"Score Ranking"</button>
              <button onClick={() => handleCommand('onePoint')} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border">"Going to 1 pt"</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-background border border-border rounded-lg p-4 h-full min-h-[250px]">
            <h4 className="font-semibold text-sm mb-3 text-muted-foreground flex justify-between">
              <span>Shot History</span>
              <span>Total: {shots.reduce((a,b)=>a+parseFloat(b),0).toFixed(1)}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {shots.map((shot, idx) => {
                const isInnerTen = parseFloat(shot) >= 10.3;
                return (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    key={idx} 
                    className={`w-12 h-12 flex flex-col items-center justify-center rounded-full border-2 ${isInnerTen ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-blue-500 bg-blue-500/10 text-blue-500'}`}
                  >
                    <span className="text-[10px] opacity-70">#{idx + 1}</span>
                    <span className="font-bold">{shot}</span>
                  </motion.div>
                )
              })}
              {shots.length === 0 && (
                <div className="w-full h-32 flex items-center justify-center text-muted-foreground text-sm italic">
                  Awaiting first shot...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
