import React, { useState, useEffect, useRef } from 'react';
import { Music, PauseCircle, PlayCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';


const PLAYLIST = [
  {
    title: "Zen Shooting BGM",
    artist: "ISSF",
    url: "/issf_bgm.mp3.mp3",
    description: "Binaural beats for deep shooting flow"
  },
  {
    title: "On My Mind",
    artist: "Jonasu",
    url: "/On My Mind - Jonasu.mp3",
    description: "Upbeat focus vibe"
  },
  {
    title: "Good for Me",
    artist: "Jay Pryor",
    url: "/Good for Me - Jay Pryor.mp3",
    description: "Energizing background rhythm"
  },
  {
    title: "Shades",
    artist: "Tchami",
    url: "/Shades - Tchami.mp3",
    description: "House/Ambient deep concentration"
  },
  {
    title: "How Deep Is Your Love",
    artist: "Calvin Harris",
    url: "/How Deep Is Your Love - Calvin Harris.mp3",
    description: "Deep house focus rhythm"
  },
  {
    title: "My Way",
    artist: "ATEEZ",
    url: "/My Way - ATEEZ.mp3",
    description: "Uplifting electronic energy"
  },
  {
    title: "Paradise",
    artist: "Coldplay",
    url: "/Paradise - Coldplay.mp3",
    description: "Anthemic orchestral ambient flow"
  }
];

export default function GlobalAudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const audioRef = useRef(null);
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = false; // Must be false to fire 'ended' event
    audioRef.current.volume = 0.25;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Auto-advance to next track when song ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setCurrentTrackIndex(prev => (prev + 1) % PLAYLIST.length);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // Load and play track when index or bgmEnabled changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const track = PLAYLIST[currentTrackIndex];

    // Compare decoded path to avoid URL-encoding mismatches
    let currentPath = '';
    try {
      currentPath = audio.src ? decodeURIComponent(new URL(audio.src).pathname) : '';
    } catch {
      currentPath = '';
    }

    const needsLoad = currentPath !== track.url;

    if (needsLoad) {
      audio.pause();
      audio.src = track.url;
      audio.load();
    }

    audio.volume = volumeRef.current;

    if (bgmEnabled) {
      const attemptPlay = () => {
        audio.play().catch(e => {
          console.warn('Could not play BGM.', e);
          setBgmEnabled(false);
        });
      };

      if (needsLoad || audio.readyState < 3) {
        // Wait until enough data is buffered
        audio.addEventListener('canplay', attemptPlay, { once: true });
        return () => audio.removeEventListener('canplay', attemptPlay);
      } else {
        attemptPlay();
      }
    } else {
      audio.pause();
    }
  }, [currentTrackIndex, bgmEnabled]);

  // Sync volume independently
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const currentTrack = PLAYLIST[currentTrackIndex];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-950/60 to-indigo-950/60 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl shadow-xl mb-6 gap-4 animate-fade-in z-50 relative">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className={`p-3 rounded-xl ${bgmEnabled ? 'bg-blue-500 text-white animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-accent/40 text-muted-foreground'} transition-all`}>
          <Music size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 truncate">
            <span className="truncate">{currentTrack.title}</span>
            <span className="text-xs text-muted-foreground/80 font-normal shrink-0">by {currentTrack.artist}</span>
            {bgmEnabled && <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block shrink-0" />}
          </h4>
          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[150px] md:max-w-xs">{currentTrack.description}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          className="text-muted-foreground hover:text-white transition-colors"
          title="Previous Track"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={() => setBgmEnabled(!bgmEnabled)}
          className={`transition-all transform hover:scale-110 active:scale-95 ${
            bgmEnabled
              ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]'
              : 'text-foreground'
          }`}
          title={bgmEnabled ? 'Pause' : 'Play'}
        >
          {bgmEnabled ? <PauseCircle size={36} strokeWidth={1.5} /> : <PlayCircle size={36} strokeWidth={1.5} />}
        </button>

        <button
          onClick={handleNext}
          className="text-muted-foreground hover:text-white transition-colors"
          title="Next Track"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 bg-background/30 px-3 py-1.5 rounded-full border border-white/5">
        <button
          onClick={() => setVolume(v => v === 0 ? 0.25 : 0)}
          className="text-muted-foreground hover:text-white transition-colors"
          title={volume === 0 ? 'Unmute' : 'Mute'}
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
