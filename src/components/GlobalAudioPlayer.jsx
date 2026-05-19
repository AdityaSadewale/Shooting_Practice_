import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music, PauseCircle, PlayCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

export default function GlobalAudioPlayer() {
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const bgmAudioElementRef = useRef(null);

  const playBgm = useCallback(() => {
    if (!bgmEnabled) return;
    
    if (!bgmAudioElementRef.current) {
      bgmAudioElementRef.current = new Audio('/issf_bgm.mp3.mp3');
      bgmAudioElementRef.current.loop = true;
    }

    bgmAudioElementRef.current.volume = volume;
    bgmAudioElementRef.current.play().catch(e => {
      console.warn("Could not play BGM.", e);
      setBgmEnabled(false);
    });
  }, [bgmEnabled, volume]);

  const stopBgm = useCallback(() => {
    if (bgmAudioElementRef.current) {
      bgmAudioElementRef.current.pause();
    }
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (bgmAudioElementRef.current) {
      bgmAudioElementRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (bgmEnabled) playBgm();
    else stopBgm();
    // Do NOT stop on unmount, wait, if this unmounts the audio would keep playing? 
    // Actually, we do want to clean it up if the whole dashboard unmounts.
    return stopBgm;
  }, [bgmEnabled, playBgm, stopBgm]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-950/60 to-indigo-950/60 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl shadow-xl mb-6 gap-4 animate-fade-in z-50 relative">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className={`p-3 rounded-xl ${bgmEnabled ? 'bg-blue-500 text-white animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-accent/40 text-muted-foreground'} transition-all`}>
          <Music size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            Zen Focus Playlist
            {bgmEnabled && <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />}
          </h4>
          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[150px] md:max-w-xs">Binaural beats for deep shooting flow</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-white transition-colors" title="Previous Track">
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={() => setBgmEnabled(!bgmEnabled)}
          className={`transition-all transform hover:scale-110 active:scale-95 ${
            bgmEnabled 
              ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]' 
              : 'text-foreground'
          }`}
        >
          {bgmEnabled ? <PauseCircle size={36} strokeWidth={1.5} /> : <PlayCircle size={36} strokeWidth={1.5} />}
        </button>

        <button className="text-muted-foreground hover:text-white transition-colors" title="Next Track">
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 bg-background/30 px-3 py-1.5 rounded-full border border-white/5">
        <button 
          onClick={() => setVolume(v => v === 0 ? 0.25 : 0)} 
          className="text-muted-foreground hover:text-white transition-colors"
        >
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 sm:w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}
