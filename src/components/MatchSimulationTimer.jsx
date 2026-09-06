import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Users, Trophy, Calculator, Plus, Trash2, UserPlus } from 'lucide-react';

/* ─────────────────────────────────────────────
   Human-like TTS helper
   Uses small random pitch / rate variation,
   and breaks long announcements into natural
   sentences so Chrome doesn't cut off mid-way.
───────────────────────────────────────────── */
function buildHumanUtterance(text) {
  const u = new SpeechSynthesisUtterance(text);
  // Slight randomness makes it sound less robotic
  u.rate = 0.88 + Math.random() * 0.06;   // 0.88–0.94
  u.pitch = 0.95 + Math.random() * 0.10;   // 0.95–1.05
  u.volume = 1.0;

  // Prefer a female English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    /en[-_](US|GB|AU|IN)/i.test(v.lang) &&
    /female|zira|samantha|karen|moira|fiona|victoria|hazel|emma/i.test(v.name)
  ) || voices.find(v => /en[-_]/i.test(v.lang));
  if (preferred) u.voice = preferred;

  return u;
}

function speakHuman(sentences) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  // Split on '. ' so each sentence queues naturally
  const parts = Array.isArray(sentences) ? sentences : [sentences];
  parts.forEach((part) => {
    const u = buildHumanUtterance(part);
    window.speechSynthesis.speak(u);
  });
}

/* ─────────────────────────────────────────────
   Announcement scripts
───────────────────────────────────────────── */
const SCRIPTS = {
  occupy: [
    "Attention all shooters.",
    "Please occupy your assigned lane.",
    "Do not unbox your weapons at this time.",
  ],
  unbox: [
    "Shooters, you may now unbox your weapons.",
    "Please insert your safety flag before handling.",
    "Dry-fire and holding practice is allowed.",
    // "You have three minutes before sighter time begins.",
  ],
  sighterStart: (shots) => [
    `Welcome, shooters!`,
    `This is your ten-meter air pistol and air rifle shooting competition.`,
    `You will shoot a total of ${shots} shots today.`,
    `The preparation and sighter time is fifteen minutes.`,
    `Shooters — your preparation and sighter time... START!`,
    // `If you wish to skip sighters, you may begin your match targets now.`,
  ],
  sighterWarn: [
    "Attention — last thirty seconds remaining for preparation and sighters.",
  ],
  sighterStop: [
    "Preparation and sighter time is... STOP.",
    "Do not load your weapon.",
    "If your weapon is already loaded, then raise your left hand up.",
  ],
  matchStart: (shots, mins) => [
    `For the ${shots}-shot match — match time... START!`,
    `You have ${mins} minutes. Best of luck, shooters`,
  ],
  matchDone: [
    "STOP! The match is now finished.",
    "Please unload weapon.",
    "Submit your target to the range officer and sign your scorecard.",
    "Thank you, shooters. for corporation and support.",
  ],
};

/* ─────────────────────────────────────────────
   Score helpers
───────────────────────────────────────────── */
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function seriesCount(matchFormat) {
  return matchFormat === 20 ? 2 : matchFormat === 40 ? 4 : 6;
}

function matchMins(matchFormat) {
  return matchFormat === 20 ? 25 : matchFormat === 40 ? 50 : 75;
}

function buildEmptyScores(players, fmt) {
  return Array.from({ length: players }, () => Array(seriesCount(fmt)).fill(''));
}

const DEFAULT_NAMES = ['Shooter 1', 'Shooter 2', 'Shooter 3', 'Shooter 4', 'Shooter 5', 'Shooter 6', 'Shooter 7', 'Shooter 8'];

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function MatchSimulationTimer({ matchFormat, weapon = 'Air Pistol', onMatchFinished }) {
  // ── Phase / timer state ──
  const [phase, setPhase] = useState('idle');
  const [occupyTime, setOccupyTime] = useState(weapon === 'Air Pistol' ? 3 * 60 : 5 * 60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sighterWarned, setSighterWarned] = useState(false);
  const timerRef = useRef(null);

  // ── Player state ──
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState(['']);

  // ── Score state — per player, per series ──
  // scores[playerIdx][seriesIdx]
  const [scores, setScores] = useState(() => buildEmptyScores(1, matchFormat));
  const [calculated, setCalculated] = useState(false);

  // ── Controls (declared early so effects can use them) ──
  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    window.speechSynthesis.cancel();
    setIsActive(false);
    setPhase('idle');
    setTimeLeft(0);
    setSighterWarned(false);
    setCalculated(false);
    setScores(prev => buildEmptyScores(prev.length, matchFormat));
  }, [matchFormat]);

  // When matchFormat or numPlayers changes, reset scores
  useEffect(() => {
    const t = setTimeout(() => {
      setScores(buildEmptyScores(numPlayers, matchFormat));
      setCalculated(false);
    }, 0);
    return () => clearTimeout(t);
  }, [matchFormat, numPlayers]);

  // ── Voice helper ──
  const speak = useCallback((lines) => {
    speakHuman(lines);
  }, []);

  // ── Phase transitions ──
  const startNextPhase = useCallback((nextPhase) => {
    window.speechSynthesis.cancel();
    setPhase(nextPhase);
    setSighterWarned(false);

    if (nextPhase === 'occupy') {
      setTimeLeft(occupyTime);
      setIsActive(true);
      speak(SCRIPTS.occupy);
    } else if (nextPhase === 'unbox') {
      setTimeLeft(3 * 60);
      setIsActive(true);
      speak(SCRIPTS.unbox);
    } else if (nextPhase === 'sighter') {
      setTimeLeft(15 * 60);
      setIsActive(true);
      speak(SCRIPTS.sighterStart(matchFormat));
    } else if (nextPhase === 'match') {
      setTimeLeft(matchMins(matchFormat) * 60);
      setIsActive(true);
      speak(SCRIPTS.matchStart(matchFormat, matchMins(matchFormat)));
    } else if (nextPhase === 'done') {
      setTimeLeft(0);
      setIsActive(false);
      speak(SCRIPTS.matchDone);
      if (onMatchFinished) onMatchFinished();
    }
  }, [occupyTime, matchFormat, speak, onMatchFinished]);

  // ── Countdown tick ──
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    // 30-second sighter warning
    if (phase === 'sighter' && timeLeft === 30 && !sighterWarned) {
      speak(SCRIPTS.sighterWarn);
      setTimeout(() => setSighterWarned(true), 0);
    }

    timerRef.current = setTimeout(() => setTimeLeft(l => l - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft, phase, sighterWarned, speak]);

  // ── Phase completion ──
  useEffect(() => {
    if (!isActive || timeLeft !== 0) return;
    const t = setTimeout(() => {
      if (phase === 'occupy') startNextPhase('unbox');
      else if (phase === 'unbox') startNextPhase('sighter');
      else if (phase === 'sighter') {
        setIsActive(false);
        speak(SCRIPTS.sighterStop);
        setTimeout(() => startNextPhase('match'), 9000);
      } else if (phase === 'match') startNextPhase('done');
    }, 0);
    return () => clearTimeout(t);
  }, [isActive, timeLeft, phase, speak, startNextPhase]);

  // ── Reset when weapon/format changes ──
  useEffect(() => {
    const t = setTimeout(() => {
      if (phase !== 'idle') resetTimer();
      setOccupyTime(weapon === 'Air Pistol' ? 3 * 60 : 5 * 60);
    }, 0);
    return () => clearTimeout(t);
  }, [matchFormat, weapon]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controls (continued) ──
  const toggleTimer = () => {
    if (phase === 'done') return;
    if (phase === 'idle') startNextPhase('occupy');
    else setIsActive(a => !a);
  };

  const skipPhase = () => {
    clearTimeout(timerRef.current);
    window.speechSynthesis.cancel();
    if (phase === 'occupy') startNextPhase('unbox');
    else if (phase === 'unbox') startNextPhase('sighter');
    else if (phase === 'sighter') startNextPhase('match');
  };

  // ── Player management ──
  const handleNumPlayers = (n) => {
    const count = Math.max(1, Math.min(8, n));
    setNumPlayers(count);
    setPlayerNames(prev => {
      const arr = [...prev];
      while (arr.length < count) arr.push('');
      return arr.slice(0, count);
    });
  };

  const handlePlayerName = (idx, val) => {
    setPlayerNames(prev => { const a = [...prev]; a[idx] = val; return a; });
  };

  // ── Score entry ──
  const handleScore = (pIdx, sIdx, val) => {
    setScores(prev => {
      const next = prev.map(r => [...r]);
      next[pIdx][sIdx] = val;
      return next;
    });
    setCalculated(false);
  };

  const calculateScores = () => setCalculated(true);

  // Totals per player
  const totals = scores.map(row =>
    row.reduce((sum, v) => sum + (parseFloat(v) || 0), 0)
  );

  // Sorted leaderboard
  const leaderboard = playerNames
    .map((name, i) => ({
      name: name.trim() || DEFAULT_NAMES[i],
      total: totals[i],
      series: scores[i],
    }))
    .sort((a, b) => b.total - a.total);

  const maxScore = scores[0]?.some(v => v.includes?.('.'))
    ? (matchFormat === 20 ? 218.0 : matchFormat === 40 ? 436.0 : 654.0)
    : (matchFormat === 20 ? 200 : matchFormat === 40 ? 400 : 600);

  // ── Phase labels ──
  const phaseLabel = {
    idle: 'Ready to Start',
    occupy: '🎯 Occupy Lane',
    unbox: '📦 Unbox Weapon',
    sighter: '🔭 Preparation & Sighters',
    match: '🏆 Match Stage',
    done: '✅ Match Finished',
  }[phase] || '';

  const phaseTip = {
    occupy: "Occupy your lane — do not unbox your weapons yet.",
    unbox: "Unbox your weapon and insert a safety flag. Dry-fire and holding practice is allowed.",
    sighter: "15 minutes for preparation and sighters. Use 'Skip Stage' to start your match early.",
    match: `${matchFormat}-shot match is live. Pace yourself and trust your process.`,
    done: "Match complete. Ensure your weapon is cleared and safe before leaving the range.",
  }[phase] || '';

  const phaseColor = {
    occupy: 'from-purple-500 to-purple-700',
    unbox: 'from-amber-500 to-orange-600',
    sighter: 'from-teal-500 to-cyan-600',
    match: 'from-blue-500 to-indigo-600',
    done: 'from-green-500 to-emerald-600',
    idle: 'from-gray-500 to-gray-600',
  }[phase] || 'from-gray-500 to-gray-600';

  return (
    <div className="flex flex-col gap-5">

      {/* ── Phase / Timer Card ── */}
      <div className={`bg-gradient-to-br ${phaseColor} p-[1px] rounded-2xl shadow-lg`}>
        <div className="bg-card rounded-2xl p-5 flex flex-col gap-4">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-black tracking-widest text-muted-foreground block mb-1">
                {phaseLabel}
              </span>
              <div className={`text-5xl font-mono font-black bg-gradient-to-r ${phaseColor} bg-clip-text text-transparent`}>
                {phase === 'idle' ? '0:00' : formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleTimer}
                className={`px-5 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5 active:scale-95
                  ${isActive ? 'bg-orange-500 hover:bg-orange-600' : phase === 'done' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isActive
                  ? <><Pause fill="currentColor" size={18} /> Pause</>
                  : <><Play fill="currentColor" size={18} /> {phase === 'idle' ? 'Start Match' : 'Resume'}</>}
              </button>

              {['occupy', 'unbox', 'sighter'].includes(phase) && (
                <button
                  onClick={skipPhase}
                  className="px-4 py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-amber-500/20 transition-all hover:-translate-y-0.5"
                >
                  <FastForward size={16} /> Skip Stage
                </button>
              )}

              <button
                onClick={resetTimer}
                className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-secondary/80 transition-all hover:-translate-y-0.5"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Tip */}
          {phaseTip && (
            <div className={`bg-gradient-to-r ${phaseColor} p-[1px] rounded-xl`}>
              <div className="bg-card/90 rounded-xl px-4 py-2.5">
                <p className="text-sm font-semibold text-foreground">{phaseTip}</p>
              </div>
            </div>
          )}

          {/* Idle controls */}
          {phase === 'idle' && (
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <label className="flex items-center gap-2 font-semibold">
                Lane Occupy Time:
                <select
                  className="bg-background border border-border rounded-lg px-2 py-1.5 ml-1"
                  value={occupyTime}
                  onChange={e => setOccupyTime(Number(e.target.value))}
                >
                  <option value={3 * 60}>3 min — Pistol</option>
                  <option value={5 * 60}>5 min — Rifle</option>
                  <option value={60}>1 min — Quick</option>
                </select>
              </label>
            </div>
          )}

          {/* Progress bar */}
          {phase !== 'idle' && phase !== 'done' && (
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${phaseColor} transition-all duration-1000`}
                style={{
                  width: `${100 - (timeLeft / (
                    phase === 'occupy' ? occupyTime :
                      phase === 'unbox' ? 180 :
                        phase === 'sighter' ? 900 :
                          matchMins(matchFormat) * 60
                  )) * 100}%`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Players Setup Card ── */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            <h4 className="font-bold text-foreground">Shooters</h4>
            <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full font-semibold">1–8</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNumPlayers(numPlayers - 1)}
              disabled={numPlayers <= 1}
              className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground font-bold flex items-center justify-center disabled:opacity-40 hover:bg-secondary/70 transition"
            >−</button>
            <span className="w-6 text-center font-black text-lg text-foreground">{numPlayers}</span>
            <button
              onClick={() => handleNumPlayers(numPlayers + 1)}
              disabled={numPlayers >= 8}
              className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 transition"
            >+</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: numPlayers }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <input
                type="text"
                value={playerNames[i] || ''}
                onChange={e => handlePlayerName(i, e.target.value)}
                placeholder={DEFAULT_NAMES[i]}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Series Score Entry ── */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Calculator size={18} className="text-teal-500" />
          <h4 className="font-bold text-foreground">Series Score Entry</h4>
          <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full font-semibold">
            {seriesCount(matchFormat)} series × 10 shots = {matchFormat} shots
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: numPlayers }).map((_, pIdx) => (
            <div key={pIdx} className="bg-accent/20 border border-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-black flex items-center justify-center">
                  {pIdx + 1}
                </div>
                <span className="font-bold text-sm text-foreground">
                  {playerNames[pIdx]?.trim() || DEFAULT_NAMES[pIdx]}
                </span>
              </div>
              <div className={`grid gap-2 ${seriesCount(matchFormat) <= 2 ? 'grid-cols-2' : seriesCount(matchFormat) <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {Array.from({ length: seriesCount(matchFormat) }).map((_, sIdx) => (
                  <div key={sIdx} className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Series {sIdx + 1}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={scores[pIdx]?.[sIdx] || ''}
                      onChange={e => handleScore(pIdx, sIdx, e.target.value)}
                      placeholder="e.g. 98.4"
                      className="bg-background border border-border/80 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={calculateScores}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Calculator size={18} /> Calculate Scores
        </button>
      </div>

      {/* ── Final Scoreboard ── */}
      {calculated && (
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            <h4 className="font-bold text-foreground">Final Scoreboard</h4>
            <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full font-semibold">
              {matchFormat}-Shot Match · {weapon}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {leaderboard.map((player, rank) => {
              const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`;
              const isFirst = rank === 0;
              return (
                <div
                  key={rank}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all
                    ${isFirst
                      ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/30 shadow-md shadow-yellow-500/5'
                      : 'bg-accent/20 border-border/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-8 text-center">{medal}</span>
                    <div>
                      <p className={`font-bold text-sm ${isFirst ? 'text-yellow-500' : 'text-foreground'}`}>
                        {player.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        {weapon} · {matchFormat}-Shot
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black font-mono ${isFirst ? 'text-yellow-500' : 'text-foreground'}`}>
                      {player.total.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono font-semibold">
                      / {maxScore}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Per-player series breakdown */}
          <div className="flex flex-col gap-3 mt-2">
            <h5 className="text-xs uppercase font-black tracking-widest text-muted-foreground">Series Breakdown</h5>
            {leaderboard.map((player, rank) => (
              <div key={rank} className="bg-accent/10 border border-border/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">{player.name}</span>
                  <span className="text-xs font-mono font-bold text-blue-500">Total: {player.total.toFixed(1)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {player.series.map((s, sIdx) => (
                    <div key={sIdx} className="bg-background border border-border rounded-lg px-3 py-1.5 text-center min-w-[60px]">
                      <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">S{sIdx + 1}</p>
                      <p className="text-sm font-black font-mono text-foreground">{parseFloat(s) || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
