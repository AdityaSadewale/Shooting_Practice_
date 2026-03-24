import { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Play, Square, Save, Gift } from 'lucide-react';
import { saveSession } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import PracticeTimer from './PracticeTimer';

const CONFIDENCE_TIPS = [
  "Visualize the perfect follow-through before every shot.",
  "Trust your hold. The wobble is natural, accept it.",
  "Focus only on the front sight and smooth trigger squeeze.",
  "Breathe deep, reset your mind. Every shot is a new match."
];

const REWARD_TIPS = [
  "Reward Tip: Dedicate 10 minutes to un-aimed dry fire against a blank wall to cement your trigger pull.",
  "Reward Tip: Mental rehearsal is just as effective as live fire. Run a 60-shot match in your head before bed.",
  "Reward Tip: A tense shoulder ruins the hold. Constantly scan your body for tension between shots.",
  "Reward Tip: Don't chase the ten. Let the ten come to your hold.",
  "Reward Tip: A good follow-through means seeing the pellet strike through the sights."
];

export default function Timeline({ user, onSessionSaved }) {
  const [expandedHour, setExpandedHour] = useState(1);
  const [completedHours, setCompletedHours] = useState([]);
  
  // Hour 3 state
  const [timeLeft, setTimeLeft] = useState(75 * 60); // 75 mins in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [scores, setScores] = useState(Array(6).fill(''));
  
  // Hour 4 state
  const [journal, setJournal] = useState('');
  const [tip] = useState(CONFIDENCE_TIPS[Math.floor(Math.random() * CONFIDENCE_TIPS.length)]);

  // Reward state
  const [rewardTip, setRewardTip] = useState('');

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(l => l - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const toggleHour = (hour) => {
    setExpandedHour(expandedHour === hour ? null : hour);
  };

  const markDone = (hour) => {
    if (!completedHours.includes(hour)) {
      setCompletedHours([...completedHours, hour]);
    }
    if (hour < 4) setExpandedHour(hour + 1);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleScoreChange = (index, val) => {
    const newScores = [...scores];
    newScores[index] = val;
    setScores(newScores);
  };

  const finishSession = () => {
    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weapon: user.weapon,
      completedHours,
      scores: scores.map(Number).filter(n => !isNaN(n) && n > 0),
      journal
    };
    saveSession(session);
    
    // Generate reward tip
    const randomReward = REWARD_TIPS[Math.floor(Math.random() * REWARD_TIPS.length)];
    setRewardTip(randomReward);

    if (onSessionSaved) onSessionSaved();
  };

  // Content for Hour 1
  const hour1Content = user.weapon === 'Air Pistol' ? (
    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
      <li>Focus on "Grip consistency"</li>
      <li>"Sights alignment" without pellets</li>
      <li>Hold on target for 30s x 10 times</li>
    </ul>
  ) : (
    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
      <li>Focus on "Natural Point of Aim"</li>
      <li>"Outer position" checks</li>
      <li>Zero-tension hold practice</li>
    </ul>
  );

  const hours = [
    {
      id: 1,
      title: 'Hour 1: Dry Practice & Stability',
      content: (
        <div className="space-y-4 text-left">
          <p className="text-sm font-medium">Objective: Build the perfect stance and hold.</p>
          {hour1Content}
          <PracticeTimer title="Dry Practice (30s hold / 25s break)" activeSeconds={30} restSeconds={25} totalCycles={100} startVocab="start" stopVocab="stop" />
          <button 
            onClick={() => markDone(1)}
            disabled={completedHours.includes(1)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            {completedHours.includes(1) ? 'Completed' : 'Mark as Done'}
          </button>
        </div>
      )
    },
    {
      id: 2,
      title: 'Hour 2: Holding Daily Practice & Technical Execution',
      content: (
        <div className="space-y-4 text-left">
          <p className="text-sm font-medium">Objective: Transfer dry fire feeling to live fire.</p>
          <ul className="list-disc pl-5 mt-2 space-y-2 text-muted-foreground">
            <li><strong>Holding exercises:</strong> Hold the shot on the target for 45 seconds before firing. (10 shots)</li>
            <li><strong>Single-shot perfection:</strong> Load, aim, fire, and follow-through. Analyze each shot. (20 shots)</li>
          </ul>
          <PracticeTimer title="Holding Practice (60s hold / 45s break)" activeSeconds={60} restSeconds={45} totalCycles={30} startVocab="start" stopVocab="finish" />
          <button 
            onClick={() => markDone(2)}
            disabled={completedHours.includes(2)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            {completedHours.includes(2) ? 'Completed' : 'Mark as Done'}
          </button>
        </div>
      )
    },
    {
      id: 3,
      title: 'Hour 3: Match Simulation (60-Shot Match)',
      content: (
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between bg-accent/20 p-4 rounded-lg border border-border">
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatTime(timeLeft)}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTimerActive(!timerActive)} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                {timerActive ? <Square fill="currentColor" size={16} /> : <Play fill="currentColor" size={16} />}
              </button>
              <button onClick={() => { setTimeLeft(75*60); setTimerActive(false); }} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                Reset
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Score Entry (6 Series of 10 Shots)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {scores.map((score, i) => (
                <div key={i}>
                  <label className="text-xs text-muted-foreground block mb-1">Series {i + 1}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={score}
                    onChange={(e) => handleScoreChange(i, e.target.value)}
                    placeholder="e.g. 102.4"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => markDone(3)}
            disabled={completedHours.includes(3)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            {completedHours.includes(3) ? 'Match Logged' : 'Log Match & Mark Done'}
          </button>
        </div>
      )
    },
    {
      id: 4,
      title: 'Hour 4: Physical & Mental Mastery',
      content: (
        <div className="space-y-6 text-left">
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg shadow-sm">
            <h4 className="text-yellow-600 dark:text-yellow-400 font-bold mb-1 text-sm top-0 uppercase tracking-wider">Coach's Tip</h4>
            <p className="text-foreground italic">"{tip}"</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Physical Cooldown</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Core static holds (Planks: 3 x 45s)</li>
              <li>Shoulder stability exercises with light bands</li>
              <li>Neck and back stretching</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Confidence Journal</h4>
            <label className="text-sm text-muted-foreground block mb-2">What was your most confident shot today and why?</label>
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              className="w-full h-24 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="e.g., Shot 42 in the match. I trusted my hold and the release surprised me perfectly..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button 
              onClick={() => markDone(4)}
              disabled={completedHours.includes(4)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              {completedHours.includes(4) ? 'Completed' : 'Mark as Done'}
            </button>
            
            {completedHours.length > 0 && !rewardTip && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={finishSession}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ml-auto shadow-md shadow-green-600/20"
              >
                <Save size={16} />
                Save Session
              </motion.button>
            )}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Task Completion Reward Popup */}
      <AnimatePresence>
        {rewardTip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-6 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl flex items-start gap-4"
          >
            <div className="p-3 bg-green-500 text-white rounded-full shrink-0">
              <Gift size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">Session Completed!</h3>
              <p className="text-foreground mb-4">{rewardTip}</p>
              <a href="https://www.youtube.com/@issfchannel" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors">
                <Play size={16} />
                Watch ISSF Matches on YouTube
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {hours.map((hour) => {
          const isExpanded = expandedHour === hour.id;
          const isCompleted = completedHours.includes(hour.id);
          
          return (
            <motion.div 
              layout
              key={hour.id} 
              className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                isExpanded ? 'border-blue-500/50 shadow-lg shadow-blue-500/5' : 'border-border'
              } ${isCompleted && !isExpanded ? 'bg-accent/20' : 'bg-card'}`}
            >
              <button
                onClick={() => toggleHour(hour.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                    isCompleted 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : isExpanded ? 'border-blue-500 text-blue-500' : 'border-muted-foreground/30 text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} /> : <span>{hour.id}</span>}
                  </div>
                  <h3 className={`font-semibold sm:text-lg transition-colors ${isCompleted && !isExpanded ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {hour.title}
                  </h3>
                </div>
                <div className="text-muted-foreground mr-2">
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-border/50 bg-card">
                      <div className="mt-4">
                        {hour.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
