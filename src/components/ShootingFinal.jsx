import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Pause, Mic, Crosshair, Award, Timer, Users, Trophy, Music } from 'lucide-react';
import { getUser } from '../lib/store';

export default function ShootingFinal({ userName = "Shooter" }) {
  const [numPlayers, setNumPlayers] = useState(1);
  const [players, setPlayers] = useState([]);
  const [currentScores, setCurrentScores] = useState({});
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [statusText, setStatusText] = useState('Standby');
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50);
  const [phase, setPhase] = useState('idle'); // idle, loading, active
  const [roundNum, setRoundNum] = useState(1);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [playerNames, setPlayerNames] = useState(Array(6).fill(''));

  // New States and Refs for pausing/resuming and logging
  const [hasSavedPausedState, setHasSavedPausedState] = useState(
    () => !!localStorage.getItem('shooting_match_paused_state')
  );
  const opponentTimersRef = useRef({});

  const addLog = useCallback((msg, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${msg}`);
  }, []);

  const formatSpokenScore = (scoreVal) => {
    const user = getUser();
    const isRifle = user ? user.weapon === 'Air Rifle' : false;
    const val = parseFloat(scoreVal);
    if (isNaN(val)) return scoreVal;
    
    if (isRifle) {
      // Rifle: say "point" and decimal score
      return val.toFixed(1).replace('.', ' point ');
    } else {
      // Pistol: don't tell pistol score in point (speak as integer)
      return Math.round(val).toString();
    }
  };
  
<<<<<<< HEAD
  // Keep players state names and structures in sync with custom inputs even before match starts!
  useEffect(() => {
    if (!isMatchActive) {
      const initialPlayers = [];
      for (let i = 0; i < numPlayers; i++) {
        initialPlayers.push({
          id: i,
          name: (playerNames[i] && playerNames[i].trim()) || (i === 0 ? userName : `Player ${i + 1}`),
          shots: [],
          total: 0
        });
      }
      // Defer state update to avoid cascading renders
      setTimeout(() => setPlayers(initialPlayers), 0);
    }
  }, [numPlayers, playerNames, userName, isMatchActive]);
=======


>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8
  
  const timerRef = useRef(null);
  const sequenceTimeoutRef = useRef(null);

<<<<<<< HEAD
  // Audio Context for BGM
=======
  // Audio Element for BGM
>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8
  const bgmAudioElementRef = useRef(null);

  // Initialize Voices
  useEffect(() => {
    // Chrome needs to load voices asynchronously
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const getBestVoice = () => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Zira') || (v.lang.startsWith('en') && v.name.includes('Female'))) || voices.find(v => v.lang.startsWith('en')) || voices[0];
  };

  const playBgm = useCallback(() => {
    if (!bgmEnabled) return;
    
    if (!bgmAudioElementRef.current) {
      // Look for an MP3 file in the public folder. The user must provide this file.
      bgmAudioElementRef.current = new Audio('/issf_bgm.mp3.mp3');
      bgmAudioElementRef.current.loop = true;
    }
    
    bgmAudioElementRef.current.volume = 0.15; // Soft focus volume
    bgmAudioElementRef.current.play().catch(e => {
      console.warn("Could not play BGM. Please ensure you have placed 'song.mp3' in your public/ folder.", e);
      setBgmEnabled(false);
    });
  }, [bgmEnabled]);

  const stopBgm = useCallback(() => {
    if (bgmAudioElementRef.current) {
      bgmAudioElementRef.current.pause();
    }
  }, []);

  const duckBgm = useCallback(() => {
    if (bgmAudioElementRef.current) {
      // Lower volume to 5% while voice speaks
      bgmAudioElementRef.current.volume = 0.05;
    }
  }, []);

  const restoreBgm = useCallback(() => {
    if (bgmAudioElementRef.current && bgmEnabled) {
      // Restore volume to soft 15% focus volume after voice speaks
      bgmAudioElementRef.current.volume = 0.15;
    }
  }, [bgmEnabled]);

  useEffect(() => {
    if (bgmEnabled) playBgm();
    else stopBgm();
    return stopBgm;
  }, [bgmEnabled, playBgm, stopBgm]);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = getBestVoice();
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;
      
      duckBgm(); // Duck music before speaking
      utterance.onend = restoreBgm; // Restore after
      
      window.speechSynthesis.speak(utterance);
    }
<<<<<<< HEAD
  }, [duckBgm, restoreBgm]);
=======
  }, [bgmEnabled, restoreBgm]);
>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8

  const handleCommand = (cmd) => {
    switch (cmd) {
      case 'load':
        speak("Load.");
        setStatusText("Loaded");
        break;
      case 'start':
        speak("Start.");
        setStatusText("SHOOT");
        break;
      case 'stop':
        speak("Stop.");
        setStatusText("Stopped");
        break;
      case 'ranking':
        if (players.length > 0) {
          const sorted = [...players].sort((a, b) => b.total - a.total);
          let ann = `Current standings. Leading is ${sorted[0].name} with ${formatSpokenScore(sorted[0].total)} points.`;
          if (sorted.length > 1) {
            const diff = (sorted[0].total - sorted[1].total).toFixed(1);
            ann += ` Leading by ${formatSpokenScore(parseFloat(diff))} points.`;
          }
          speak(ann);
        }
        break;
      default:
        break;
    }
  };

  const startOpponentShot = useCallback((playerId) => {
    if (isPaused) return;
    const timerInfo = opponentTimersRef.current[playerId];
    if (!timerInfo || timerInfo.fired) return;
    
    timerInfo.startTime = Date.now();
    addLog(`Scheduled shot for Opponent ${playerId} with ${timerInfo.remaining.toFixed(0)}ms delay`, 'info');
    
    timerInfo.timeoutId = setTimeout(() => {
      if (isPaused) return;
      const simulated = (Math.random() * 2.2 + 8.7).toFixed(1);
      setCurrentScores(prev => {
        if (prev[playerId]) return prev;
        return { ...prev, [playerId]: simulated };
      });
      timerInfo.fired = true;
      timerInfo.shotValue = simulated;
      addLog(`Opponent ${playerId} fired shot: ${simulated}`, 'success');
    }, timerInfo.remaining);
  }, [addLog, isPaused]);

  const startActivePhase = useCallback((restoredOpponents = null) => {
    if (isPaused) return;
    setPhase('active');
    setStatusText('SHOOT');
    speak("Start!");
    addLog(`Round ${roundNum} active shooting phase started. Timer initialized at 50s.`, 'info');

    // Initialize opponent timers
    opponentTimersRef.current = {};
    players.forEach(p => {
      if (p.id !== 0) { // Opponent ID
        let delay, fired = false, shotValue = null;
        if (restoredOpponents && restoredOpponents[p.id]) {
          delay = restoredOpponents[p.id].remaining;
          fired = restoredOpponents[p.id].fired;
          shotValue = restoredOpponents[p.id].shotValue;
        } else {
          delay = Math.random() * 20000 + 4000; // between 4s and 24s
        }

        opponentTimersRef.current[p.id] = {
          delay,
          startTime: Date.now(),
          remaining: delay,
          fired,
          shotValue,
          timeoutId: null
        };

        if (!fired) {
          startOpponentShot(p.id);
        } else if (shotValue) {
          // Keep score registered
          setCurrentScores(prev => ({ ...prev, [p.id]: shotValue }));
        }
      }
    });
  }, [players, roundNum, startOpponentShot, addLog, isPaused, speak]);

  const nextShotSequence = () => {
    if (isPaused) {
      addLog("Cannot start next shot sequence because match is paused.", "warning");
      return;
    }
    setPhase('loading');
    setStatusText('Loading (10s)...');
    setTimeLeft(10); // 10 seconds loading/prep countdown
    setCurrentScores({}); // clear inputs
    
    if (roundNum === 1) {
      speak("Athletes to the line.");
      speak("Load.");
    } else {
      speak("Load.");
    }
    
    addLog(`Load sequence started for Shot ${roundNum} (10 seconds).`, 'info');
  };

  const startMatch = () => {
    const initialPlayers = [];
    for (let i = 0; i < numPlayers; i++) {
      initialPlayers.push({
        id: i,
        name: (playerNames[i] && playerNames[i].trim()) || (i === 0 ? userName : `Player ${i + 1}`),
        shots: [],
        total: 0
      });
    }
    setPlayers(initialPlayers);
    setRoundNum(1);
    setCurrentScores({});
    setIsMatchActive(true);
    setBgmEnabled(true);
    
    // Play BGM directly in the user click handler to guarantee browser permission!
    if (!bgmAudioElementRef.current) {
      bgmAudioElementRef.current = new Audio('/issf_bgm.mp3.mp3');
      bgmAudioElementRef.current.loop = true;
    }
    bgmAudioElementRef.current.volume = 0.15;
    bgmAudioElementRef.current.play().catch(e => console.warn("BGM play interrupted", e));

    addLog("Match started. Loading first shot...", 'info');
    nextShotSequence();
  };

  const stopMatch = () => {
    setIsMatchActive(false);
    setIsPaused(false);
    setPhase('idle');
    setStatusText('Match Aborted');
    speak("Stop. Unload.");
    setBgmEnabled(false); // Stop BGM
    clearInterval(timerRef.current);
    clearTimeout(sequenceTimeoutRef.current);
    
    // Clear all opponent timers
    if (opponentTimersRef.current) {
      Object.keys(opponentTimersRef.current).forEach(id => {
        if (opponentTimersRef.current[id].timeoutId) {
          clearTimeout(opponentTimersRef.current[id].timeoutId);
        }
      });
      opponentTimersRef.current = {};
    }
    
    addLog("Match aborted. Shot firing cancelled and cleared.", 'warning');
    
    // Store stopped state
    const stopState = {
      timestamp: new Date().toISOString(),
      roundNum,
      players: players.map(p => ({ id: p.id, name: p.name, total: p.total, shots: p.shots }))
    };
    localStorage.setItem('shooting_match_stopped_state', JSON.stringify(stopState));
    localStorage.removeItem('shooting_match_paused_state'); // Clear paused state
  };

<<<<<<< HEAD
=======



>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8
  const confirmScores = useCallback(() => {
    clearInterval(timerRef.current);
    clearTimeout(sequenceTimeoutRef.current);

    // Clear opponent timers of this round
    if (opponentTimersRef.current) {
      Object.keys(opponentTimersRef.current).forEach(id => {
        if (opponentTimersRef.current[id].timeoutId) {
          clearTimeout(opponentTimersRef.current[id].timeoutId);
        }
      });
      opponentTimersRef.current = {};
    }
    localStorage.removeItem('shooting_match_paused_state'); // clear paused state on round completion

    setPlayers(prevPlayers => {
      // 1. Gather initial scores (user/opponents) with auto-fallbacks
      const updated = prevPlayers.map(p => {
        let val = parseFloat(currentScores[p.id]);
        
        // If a player has no score logged when the timer completes:
        if (isNaN(val) || val < 0 || val > 10.9) {
          if (p.id !== 0) {
            // Opponent shoots automatically
            val = parseFloat((Math.random() * 2.1 + 8.8).toFixed(1)); // 8.8 to 10.9
          } else {
            // Player 1 (user) auto-shoots a high-quality simulation if they didn't input anything!
            val = parseFloat((Math.random() * 1.5 + 9.4).toFixed(1)); // 9.4 to 10.9
          }
        }
        return { ...p, tempVal: val };
      });

      // 2. Perform Olympic Shoot-off (Tie Breaker) logic if players hit the exact same shot value in this round!
      // This implements: "if they hit same shot, then give again one shot... give more chances... after give best shot for this round shooter".
      const valueCounts = {};
      updated.forEach(p => {
        const valStr = p.tempVal.toFixed(1);
        valueCounts[valStr] = (valueCounts[valStr] || 0) + 1;
      });

      // Find tied scores with frequency > 1
      const tiedScores = Object.keys(valueCounts).filter(valStr => valueCounts[valStr] > 1);

      if (tiedScores.length > 0) {
        tiedScores.forEach(scoreStr => {
          const scoreVal = parseFloat(scoreStr);
          // Get all players with this tied score
          const tiedPlayers = updated.filter(p => p.tempVal.toFixed(1) === scoreStr);
          
          tiedPlayers.forEach(p => {
            // Simulate up to 2 extra shoot-off shots
            const extraShot1 = parseFloat((Math.random() * 2.1 + 8.8).toFixed(1));
            const extraShot2 = parseFloat((Math.random() * 2.1 + 8.8).toFixed(1));
            
            // Take the absolute best/highest value among original and shoot-offs!
            const bestShot = Math.max(scoreVal, extraShot1, extraShot2);
            p.tempVal = bestShot;
          });
        });
      }

      // 3. Map tempVal into final shot history and total scores
      const finalized = updated.map(p => {
        const val = p.tempVal.toFixed(1);
        const newShots = [...p.shots, val];
        const newTotal = newShots.reduce((acc, s) => acc + parseFloat(s), 0);
        
        return { 
          id: p.id,
          name: p.name,
          shots: newShots,
          total: newTotal
        };
      });

      // 4. Announce scores/leaders according to strict scheduling
      const sorted = [...finalized].sort((a, b) => b.total - a.total);
      let announcement = "";
      
      if (roundNum >= 16) {
        const leader = sorted[0];
        let diffText = "";
        if (sorted.length > 1) {
          const diff = (leader.total - sorted[1].total).toFixed(1);
          diffText = `, leading by ${formatSpokenScore(parseFloat(diff))} points`;
        }
        announcement = `End of the match. ${leader.name} wins the final with ${formatSpokenScore(leader.total)} points${diffText}.`;
        setIsMatchActive(false);
        setPhase('idle');
        speak(announcement);
      } else {
        if (roundNum % 5 === 0) {
           announcement = `Standings after ${roundNum} shots. `;
           finalized.forEach(p => {
              announcement += `${p.name} score is ${formatSpokenScore(p.total)}. `;
           });
           
           if (sorted.length > 1) {
              const leader = sorted[0];
              const runnerUp = sorted[1];
              const diff = (leader.total - runnerUp.total).toFixed(1);
              announcement += `First place, ${leader.name} leads by ${formatSpokenScore(parseFloat(diff))} points. `;
           }
           
           announcement += "And lastly, ";
           finalized.forEach(p => {
              announcement += `${p.name} is in the game. `;
           });
           
           speak(announcement);
        }
      }

      return finalized;
    });
    
    setStatusText(`Round ${roundNum} Complete`);
    setPhase('round_completed');
<<<<<<< HEAD
  }, [currentScores, roundNum, speak]);

  const handleTimeUp = useCallback(() => {
    speak("Stop.");
    confirmScores();
  }, [speak, confirmScores]);

  // Timer logic for both loading and active phases
  useEffect(() => {
=======
  }, [currentScores, roundNum, speak, addLog]);

  // Timer logic for both loading and active phases
  useEffect(() => {
    const handleTimeUp = () => {
      speak("Stop.");
      confirmScores();
    };

>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8
    if (isMatchActive && !isPaused) {
      if (phase === 'loading') {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              startActivePhase();
              return 50;
            }
            setStatusText(`Loading (${prev - 1}s)...`);
            return prev - 1;
          });
        }, 1000);
      } else if (phase === 'active') {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleTimeUp();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    return () => clearInterval(timerRef.current);
<<<<<<< HEAD
  }, [phase, isMatchActive, isPaused, currentScores, startActivePhase, handleTimeUp]);
=======
  }, [phase, isMatchActive, isPaused, startActivePhase, speak, confirmScores]);
>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8

  const startNextShot = () => {
    if (isPaused) {
      addLog("Cannot proceed to next shot while paused.", "warning");
      return;
    }
    setRoundNum(r => r + 1);
    nextShotSequence();
  };

  const togglePause = () => {
    setIsPaused(prev => {
      const nextPaused = !prev;
      if (nextPaused) {
        // Paused state
        if (bgmAudioElementRef.current) {
          bgmAudioElementRef.current.pause();
        }
        setStatusText("Paused");
        speak("Match paused.");
        
        // 1. Pause and clear opponent timers
        addLog("Pausing match. Halting opponent shot firing...", 'info');
        if (opponentTimersRef.current) {
          Object.keys(opponentTimersRef.current).forEach(id => {
            const timerInfo = opponentTimersRef.current[id];
            if (timerInfo && !timerInfo.fired) {
              // Clear current timeout
              if (timerInfo.timeoutId) {
                clearTimeout(timerInfo.timeoutId);
                timerInfo.timeoutId = null;
              }
              // Calculate elapsed time since start of this shooting delay
              const elapsed = Date.now() - timerInfo.startTime;
              timerInfo.remaining = Math.max(0, timerInfo.remaining - elapsed);
              addLog(`Player ${id} shot paused. Remaining delay: ${timerInfo.remaining.toFixed(0)}ms`, 'info');
            }
          });
        }
        
        // 2. Store the paused match details in localStorage
        const pausedState = {
          roundNum,
          timeLeft,
          players,
          currentScores,
          phase,
          statusText: "Paused",
          opponentTimers: Object.keys(opponentTimersRef.current || {}).reduce((acc, id) => {
            const info = opponentTimersRef.current[id];
            acc[id] = {
              delay: info.delay,
              remaining: info.remaining,
              fired: info.fired,
              shotValue: info.shotValue
            };
            return acc;
          }, {})
        };
        localStorage.setItem('shooting_match_paused_state', JSON.stringify(pausedState));
        addLog("Paused match state successfully stored in localStorage.", 'success');
        
      } else {
        // Resumed state
        if (bgmAudioElementRef.current && bgmEnabled) {
          bgmAudioElementRef.current.play().catch(e => console.warn(e));
        }
        setStatusText(phase === 'loading' ? `Loading (${timeLeft}s)...` : `Round ${roundNum} Active`);
        speak("Resuming.");
        
        addLog("Resuming match. Restarting shot firing...", 'info');
        
        // Remove paused state from local storage or update it to active
        localStorage.removeItem('shooting_match_paused_state');
        
        // 3. Resume opponent timers with remaining delays (only during active shooting)
        if (phase === 'active' && opponentTimersRef.current) {
          Object.keys(opponentTimersRef.current).forEach(id => {
            const timerInfo = opponentTimersRef.current[id];
            if (timerInfo && !timerInfo.fired) {
              startOpponentShot(id);
            }
          });
        }
      }
      return nextPaused;
    });
  };

  const restorePausedMatch = () => {
    const saved = localStorage.getItem('shooting_match_paused_state');
    if (!saved) return;
    
    try {
      const state = JSON.parse(saved);
      setRoundNum(state.roundNum);
      setTimeLeft(state.timeLeft);
      setPlayers(state.players);
      setCurrentScores(state.currentScores);
      setPhase(state.phase);
      setStatusText(state.statusText);
      setIsMatchActive(true);
      setIsPaused(true);
      setBgmEnabled(true);
      
      // Restore opponent timers
      opponentTimersRef.current = {};
      Object.keys(state.opponentTimers).forEach(id => {
        const info = state.opponentTimers[id];
        opponentTimersRef.current[id] = {
          delay: info.delay,
          startTime: Date.now(), // Will be updated on resume
          remaining: info.remaining,
          fired: info.fired,
          shotValue: info.shotValue,
          timeoutId: null
        };
      });
      
      addLog(`Restored paused match from localStorage. Standing at Round ${state.roundNum}`, 'success');
      setHasSavedPausedState(false);
    } catch (e) {
      console.error("Failed to parse saved paused state", e);
      addLog("Failed to restore saved paused state.", 'danger');
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    const saved = localStorage.getItem('shooting_match_paused_state');
    if (saved) {
      window.setTimeout(() => setHasSavedPausedState(true), 0);
    }
    
=======
>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8
    return () => {
      // Clear all active opponent timers on unmount
      if (opponentTimersRef.current) {
        Object.keys(opponentTimersRef.current).forEach(id => {
          if (opponentTimersRef.current[id].timeoutId) {
            clearTimeout(opponentTimersRef.current[id].timeoutId);
          }
        });
      }
    };
  }, []);

  const getTiedPlayersInLastRound = () => {
    if (players.length <= 1 || players[0].shots.length === 0) return [];
    const lastShots = players.map(p => p.shots[p.shots.length - 1]);
    const valueCounts = {};
    lastShots.forEach(val => {
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    });
    
    // Find values that are duplicated
    const tiedValues = Object.keys(valueCounts).filter(val => valueCounts[val] > 1);
    
    if (tiedValues.length === 0) return [];
    
    // Return the players who have these tied values
    return players.filter(p => tiedValues.includes(p.shots[p.shots.length - 1]));
  };

  const triggerReshot = () => {
    if (isPaused) {
      addLog("Cannot trigger reshot while match is paused.", "warning");
      return;
    }
    const tiedPlayers = getTiedPlayersInLastRound();
    if (tiedPlayers.length === 0) return;
    
    const updatedPlayers = players.map(p => {
      // Only modify the players who are tied in the last round!
      const isTied = tiedPlayers.some(tp => tp.id === p.id);
      if (isTied) {
        // Get the manually input reshot score from currentScores!
        let reshotVal = parseFloat(currentScores[p.id]);
        
        // If no score was input, fall back to a random shot simulation
        if (isNaN(reshotVal) || reshotVal < 0 || reshotVal > 10.9) {
          reshotVal = parseFloat((Math.random() * 2.1 + 8.8).toFixed(1)); // 8.8 to 10.9
        }
        
        // Take the reshot value to break the tie! (Using Math.max was causing them to remain tied if both shot lower than original)
        const bestVal = reshotVal.toFixed(1);
        
        const newShots = [...p.shots];
        newShots[newShots.length - 1] = bestVal; // Replace the last shot with the reshot!
        
        const newTotal = newShots.reduce((acc, s) => acc + parseFloat(s), 0);
        
        return { ...p, shots: newShots, total: newTotal, lastReshotVal: reshotVal };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setCurrentScores({});

    // Save to local storage after resolving tie
    const matchState = {
      roundNum,
      timeLeft,
      players: updatedPlayers,
      currentScores: {},
      phase,
      statusText: "Tie-Breaker Complete",
      opponentTimers: Object.keys(opponentTimersRef.current || {}).reduce((acc, id) => {
        const info = opponentTimersRef.current[id];
        acc[id] = { delay: info.delay, remaining: info.remaining, fired: info.fired, shotValue: info.shotValue };
        return acc;
      }, {})
    };
    localStorage.setItem('shooting_match_paused_state', JSON.stringify(matchState));
    setHasSavedPausedState(true);
    addLog("Tie-breaker completed. Match state saved to localStorage.", "success");
  };

  const handleScoreChange = (id, val) => {
    setCurrentScores(prev => ({ ...prev, [id]: val }));
  };

  const sortedPlayers = [...players].sort((a, b) => b.total - a.total);

  return (
    <div className="bg-card border border-border p-6 rounded-xl space-y-6">
      {hasSavedPausedState && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
            <Award size={20} className="animate-pulse shrink-0" />
            <div>
              <p className="font-bold text-sm">Paused Match Found</p>
              <p className="text-[11px] text-muted-foreground">You have a previously paused shooting simulation saved in storage.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={restorePausedMatch}
              className="flex-1 sm:flex-none px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs rounded-lg transition-colors shadow-sm animate-pulse"
            >
              Restore & Resume
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('shooting_match_paused_state');
                setHasSavedPausedState(false);
                addLog("Cleared saved paused match state.", "warning");
              }}
              className="flex-1 sm:flex-none px-3 py-2 bg-accent/20 hover:bg-accent/40 text-muted-foreground font-semibold text-xs rounded-lg transition-colors border border-border"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Award className="text-yellow-500" />
          Multi-Player Final Simulation
        </h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setBgmEnabled(!bgmEnabled)} 
            className={`p-2 rounded-full transition-colors border ${bgmEnabled ? 'bg-blue-500/20 text-blue-500 border-blue-500/50' : 'bg-accent/20 text-muted-foreground border-border'}`}
            title="Toggle Focus Music"
          >
            <Music size={16} />
          </button>
        
          {!isMatchActive && (
            <div className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-lg border border-border">
              <Users size={16} className="text-muted-foreground" />
              <select 
                value={numPlayers} 
                onChange={(e) => setNumPlayers(Number(e.target.value))}
                className="bg-transparent text-sm font-semibold focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n} className="bg-card">{n} {n === 1 ? 'Player' : 'Players'}</option>
                ))}
              </select>
            </div>
          )}
          
          {!isMatchActive ? (
            <button onClick={startMatch} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Play size={16} /> Start Match
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={togglePause} 
                className={`flex items-center gap-1.5 px-3 py-2 text-white rounded-md text-sm font-semibold transition-colors shadow-sm ${isPaused ? 'bg-amber-600 hover:bg-amber-700 animate-pulse' : 'bg-orange-600 hover:bg-orange-700'}`}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={stopMatch} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
                <Square size={16} /> Stop Match
              </button>
            </div>
          )}
        </div>
      </div>

      {!isMatchActive && (
        <div className="bg-accent/5 border border-border p-4 rounded-xl space-y-3 font-sans">
          <h4 className="text-xs uppercase font-black text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Users size={14} className="text-blue-500" /> Customize Shooter Names
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: numPlayers }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-mono">Shooter {i + 1} {i === 0 ? '(You)' : ''}</span>
                <input
                  type="text"
                  placeholder={i === 0 ? userName : `Player ${i + 1}`}
                  value={playerNames[i] || ''}
                  onChange={(e) => {
                    const newNames = [...playerNames];
                    newNames[i] = e.target.value;
                    setPlayerNames(newNames);
                  }}
                  className="bg-background border border-border px-3 py-1 rounded text-xs text-foreground focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="flex gap-2">
            <div className="bg-accent/20 border border-border p-4 rounded-lg text-center flex-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
              <p className={`text-lg font-mono font-bold ${phase === 'loading' ? 'text-yellow-500' : phase === 'active' ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>{statusText}</p>
            </div>
            <div className="bg-accent/20 border border-border p-4 rounded-lg text-center flex-1 flex flex-col items-center justify-center">
               <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Timer size={12}/> Time</p>
               <p className={`text-2xl font-mono font-black ${timeLeft <= 10 && phase === 'active' ? 'text-red-500' : 'text-foreground'}`}>{phase === 'idle' ? '--' : timeLeft}s</p>
            </div>
          </div>

          {/* Score Input Grid */}
          <div className="bg-background border border-border p-5 rounded-xl shadow-md space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-md font-bold text-foreground flex items-center gap-1.5">
                <Crosshair size={16} className="text-red-500" />
                Record Scores
              </h4>
              <span className="text-xs bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded-full">
                Round {isMatchActive ? roundNum : '-'}/16
              </span>
            </div>

            {isMatchActive && (phase === 'active' || phase === 'round_completed') ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wide">
                    {phase === 'round_completed' ? '📝 Locked Scores' : 'Shooter Quick Keypads'}
                  </p>
                  {phase === 'round_completed' && (
                    <span className="text-[10px] bg-green-500/10 text-green-500 font-bold px-2 py-0.5 rounded animate-pulse">
                      Scores Locked
                    </span>
                  )}
                </div>
                
                {/* Scrollable list containing individual keypads for ALL selected shooters */}
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 select-none hide-scrollbar">
                  {players.map(p => {
                    const isTied = phase === 'round_completed' && getTiedPlayersInLastRound().some(tp => tp.id === p.id);
                    const isDisabled = isPaused || (phase === 'round_completed' ? !isTied : false);
                    
                    return (
                      <div key={p.id} className={`bg-accent/10 border p-3 rounded-lg flex flex-col gap-2 transition-all ${phase === 'round_completed' ? (isTied ? 'border-amber-500/40 bg-amber-500/5 shadow-inner' : 'border-green-500/20 opacity-50') : 'border-border hover:border-blue-500/30'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-blue-500 truncate max-w-[120px]">
                              {p.name} {p.id === 0 ? '(You)' : ''}
                            </span>
                            {isTied && (
                              <span className="text-[9px] text-amber-500 font-bold animate-pulse">⚠️ Shoot-off Tied</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="number" 
                              step="0.1" 
                              min="0.0"
                              max="10.9"
                              disabled={isDisabled}
                              value={currentScores[p.id] !== undefined ? currentScores[p.id] : (phase === 'round_completed' ? p.shots[p.shots.length - 1] : '')}
                              onChange={(e) => handleScoreChange(p.id, e.target.value)}
                              placeholder="0.0"
                              className="w-16 bg-background border border-border px-1.5 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-center text-sm font-bold text-foreground disabled:opacity-80"
                            />
                            
                            <button
                              disabled={isDisabled}
                              onClick={() => {
                                const randVal = (Math.random() * 2.1 + 8.8).toFixed(1);
                                handleScoreChange(p.id, randVal);
                              }}
                              title="Auto Shoot"
                              className="px-1.5 py-0.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 disabled:opacity-60 text-white rounded text-[10px] font-black transition-colors"
                            >
                              🎯 Auto
                            </button>
                          </div>
                        </div>

                        {/* Micro Keypad row */}
                        <div className="grid grid-cols-4 gap-1">
                          {['10.9', '10.8', '10.5', '10.2', '10.0', '9.8', '9.5', '9.0'].map(val => (
                            <button
                              key={val}
                              disabled={isDisabled}
                              onClick={() => handleScoreChange(p.id, val)}
                              className="py-1 bg-background hover:bg-blue-500 hover:text-white disabled:hover:bg-background disabled:hover:text-foreground border border-border text-[10px] font-mono font-bold rounded transition-all active:scale-95 text-foreground disabled:opacity-40"
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Two Separate Control Buttons */}
                {phase === 'active' ? (
                  <button
                    onClick={confirmScores}
                    disabled={isPaused}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-sm font-black rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                  >
                    ✔️ Put Scores on Board
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={startNextShot}
                      disabled={isPaused || getTiedPlayersInLastRound().length > 0}
                      className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:from-green-600 disabled:to-emerald-600 text-white text-sm font-black rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-98"
                    >
                      🚀 Start Next Shot (Shot {roundNum + 1})
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8 border border-dashed border-border rounded-lg bg-accent/5">
                {phase === 'loading' ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-yellow-500">Loading next shot sequence (10s)...</p>
                  </div>
                ) : (
                  <p className="italic">Click "Start Match" to begin the multi-player final simulation.</p>
                )}
              </div>
            )}
          </div>

          {/* Voice Command Controls */}
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2 flex items-center gap-1"><Mic size={14}/> Manual Voice</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleCommand('load')} disabled={isMatchActive || isPaused} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border disabled:opacity-50">"Load"</button>
              <button onClick={() => handleCommand('start')} disabled={isMatchActive || isPaused} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border disabled:opacity-50">"Start"</button>
              <button onClick={() => handleCommand('stop')} disabled={isMatchActive || isPaused} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border disabled:opacity-50">"Stop"</button>
              <button onClick={() => handleCommand('ranking')} disabled={isPaused} className="px-2 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs rounded border border-border disabled:opacity-50">"Rankings"</button>
            </div>
          </div>
        </div>

        {/* Right Leaderboard & History Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Leaderboard */}
          <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-sm mb-3 text-muted-foreground flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" /> Current Standings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedPlayers.length > 0 ? sortedPlayers.map((p, idx) => (
                <div key={p.id} className={`flex justify-between items-center p-3 rounded-lg border ${idx === 0 ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-border bg-accent/10'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-lg ${idx === 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>#{idx + 1}</span>
                    <span className="font-bold truncate max-w-[100px]">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-lg">{p.total.toFixed(1)}</span>
                </div>
              )) : (
                <div className="col-span-2 text-center text-sm text-muted-foreground py-2 italic">No players yet.</div>
              )}
            </div>
          </div>

          {/* Shot History Grid */}
          <div className="bg-background border border-border rounded-lg p-4 shadow-sm flex-1">
            <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Shot History</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-accent/20">
                  <tr>
                    <th className="px-3 py-2 rounded-tl-md">Player</th>
                    {Array.from({length: 16}).map((_, i) => (
                      <th key={i} className={`px-2 py-2 text-center ${i===15?'rounded-tr-md':''}`}>{i+1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map(p => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0">
                      <td className="px-3 py-2 font-bold whitespace-nowrap">{p.name}</td>
                      {Array.from({length: 16}).map((_, i) => {
                        const shot = p.shots[i];
                        const isInner = shot && parseFloat(shot) >= 10.3;
                        const isZero = shot && parseFloat(shot) === 0;
                        return (
                          <td key={i} className="px-1 py-2 text-center">
                            {shot ? (
                              <span className={`inline-block w-8 text-center py-0.5 rounded font-mono ${isInner ? 'bg-green-500/20 text-green-500' : isZero ? 'bg-red-500/20 text-red-500' : 'text-muted-foreground'}`}>
                                {shot}
                              </span>
                            ) : '-'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  {players.length === 0 && (
                    <tr><td colSpan={17} className="text-center py-8 text-muted-foreground italic">Start a match to see shot history.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>



      </div>
      </div>
      {/* Tie Breaker Modal */}
      {phase === 'round_completed' && getTiedPlayersInLastRound().length > 0 && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-amber-500/50 p-6 rounded-xl shadow-2xl w-full max-w-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500 animate-pulse">
                <Timer size={24} />
                Tie-Breaker Shoot-off
              </h3>
            </div>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {getTiedPlayersInLastRound().map(p => (
                <div key={p.id} className="bg-amber-500/5 border border-amber-500/30 p-4 rounded-lg flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg text-amber-600 dark:text-amber-400">
                      {p.name} {p.id === 0 ? '(You)' : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0.0"
                        max="10.9"
                        value={currentScores[p.id] !== undefined ? currentScores[p.id] : ''}
                        onChange={(e) => handleScoreChange(p.id, e.target.value)}
                        placeholder="0.0"
                        className="w-20 bg-background border border-border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-center text-lg font-bold text-foreground"
                      />
                      <button
                        onClick={() => {
                          const randVal = (Math.random() * 2.1 + 8.8).toFixed(1);
                          handleScoreChange(p.id, randVal);
                        }}
                        title="Auto Shoot"
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-black transition-colors"
                      >
                        🎯 Auto
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {['10.9', '10.8', '10.5', '10.2', '10.0', '9.8', '9.5', '9.0'].map(val => (
                      <button
                        key={val}
                        onClick={() => handleScoreChange(p.id, val)}
                        className="py-1.5 bg-background hover:bg-amber-500 hover:text-white border border-border text-xs font-mono font-bold rounded transition-all active:scale-95 text-foreground"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1"><Mic size={14}/> Commands</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleCommand('load')} className="py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold rounded border border-border transition-colors shadow-sm">"Load"</button>
                <button onClick={() => handleCommand('start')} className="py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold rounded border border-border transition-colors shadow-sm">"Start"</button>
                <button onClick={() => handleCommand('stop')} className="py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold rounded border border-border transition-colors shadow-sm">"Stop"</button>
              </div>
            </div>

            <button
              onClick={triggerReshot}
              disabled={isPaused}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white text-base font-black rounded-lg transition-all shadow-lg active:scale-98 animate-pulse"
            >
              Confirm Reshot Scores
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
