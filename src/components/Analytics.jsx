import { useState, useCallback } from 'react';
import { getSessions, getDiaryEntries, saveDiaryEntry, deleteDiaryEntry } from '../lib/store';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Target, TrendingUp, BookOpen, Calendar, Smile, Trophy, Trash2, Edit2, Plus, Search, Award, Activity, Heart, Sparkles, Save, Check, CalendarDays, Zap, Crown, Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MOODS = [
  { id: 'epic', label: 'Epic / On Fire', emoji: '🔥', color: 'from-orange-500 to-red-600', bg: 'bg-orange-500/10 border-orange-500/20 text-orange-500' },
  { id: 'calm', label: 'Calm & Flowing', emoji: '🧘', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
  { id: 'tense', label: 'Tense / Anxious', emoji: '😰', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
  { id: 'tired', label: 'Tired / Low Energy', emoji: '😴', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-500/10 border-purple-500/20 text-purple-500' },
  { id: 'distracted', label: 'Unfocused', emoji: '🌀', color: 'from-amber-500 to-yellow-600', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500' }
];

const generateEntryId = (existingId) => existingId || Date.now().toString();

export default function Analytics() {
  const [sessions, setSessions] = useState(() => getSessions());
  const [diaryEntries, setDiaryEntries] = useState(() => {
    const list = getDiaryEntries();
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  });
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  
  // Diary Form State
  const [entryId, setEntryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('calm');
  const [achievement, setAchievement] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [scoreInput, setScoreInput] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Chart filter state (7d, 30d, 90d, 1y)
  const [chartFilter, setChartFilter] = useState('30d');

  const loadData = () => {
    setSessions(getSessions());
    const list = getDiaryEntries();
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    setDiaryEntries(list);
  };


  const resetForm = useCallback(() => {
    setEntryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setMood('calm');
    setAchievement('');
    setFocusArea('');
    setScoreInput('');
    setNotes('');
    setIsEditing(false);
  }, []);

  const handleSaveDiary = useCallback((e) => {
    e.preventDefault();
    if (!achievement.trim() || !focusArea.trim()) {
      alert("Please fill in today's achievement and focus points!");
      return;
    }

    const newEntry = {
      id: generateEntryId(entryId),
      date,
      mood,
      achievement: achievement.trim(),
      focusArea: focusArea.trim(),
      score: scoreInput ? Number(scoreInput) : null,
      notes: notes.trim()
    };

    saveDiaryEntry(newEntry);
    loadData();
    resetForm();

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  }, [entryId, date, mood, achievement, focusArea, scoreInput, notes, resetForm]);

  const handleEditDiary = (entry) => {
    setEntryId(entry.id);
    setDate(entry.date);
    setMood(entry.mood);
    setAchievement(entry.achievement);
    setFocusArea(entry.focusArea);
    setScoreInput(entry.score || '');
    setNotes(entry.notes || '');
    setIsEditing(true);
    
    // Smooth scroll to the form container
    const formElement = document.getElementById("diary-form-top");
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeleteDiary = (id) => {
    if (confirm("Are you sure you want to delete this diary entry?")) {
      deleteDiaryEntry(id);
      loadData();
    }
  };

  // Compile combined growth data chronologically
  const getCombinedGrowthData = () => {
    const dataPoints = [];

    // 1. Gather points from live fire training sessions (Hour 3)
    sessions.forEach((s) => {
      if (s.scores && s.scores.length > 0) {
        const totalScore = s.scores.reduce((a, b) => a + b, 0);
        const actualFormat = s.matchFormat || (s.scores.length * 10);
        const isDecimal = s.scores.some(val => val.toString().includes('.'));
        const maxPossible = s.maxScore || (isDecimal 
          ? (actualFormat === 20 ? 218.0 : actualFormat === 40 ? 436.0 : 654.0)
          : (actualFormat === 20 ? 200 : actualFormat === 40 ? 400 : 600));
        
        const avgScore = totalScore / s.scores.length;
        dataPoints.push({
          id: s.id,
          date: s.date.split('T')[0],
          dateTime: s.date,
          score: parseFloat(avgScore.toFixed(1)),
          totalScore: parseFloat(totalScore.toFixed(1)),
          maxScore: maxPossible,
          matchFormat: actualFormat,
          source: 'Training Session',
          mood: 'calm',
          achievement: s.journal || `Completed Hour 3 Match Simulation (${actualFormat} Shots)`,
          notes: s.journal || ''
        });
      }
    });

    // 2. Gather points from Diary entries that contain scores
    diaryEntries.forEach(d => {
      if (d.score) {
        let totalScore = Number(d.score);
        let matchFormat = 60;
        let isDecimal = d.score.toString().includes('.');
        let maxScore = 600;
        let avgScore = totalScore;

        if (totalScore > 450) {
          matchFormat = 60;
          maxScore = isDecimal ? 654.0 : 600;
          avgScore = totalScore / 6;
        } else if (totalScore > 250) {
          matchFormat = 40;
          maxScore = isDecimal ? 436.0 : 400;
          avgScore = totalScore / 4;
        } else if (totalScore > 110) {
          matchFormat = 20;
          maxScore = isDecimal ? 218.0 : 200;
          avgScore = totalScore / 2;
        } else {
          // Average score input
          matchFormat = 10;
          maxScore = isDecimal ? 109.0 : 100;
          avgScore = totalScore;
        }

        // Avoid duplicate entry if same date is logged (prefer custom diary values)
        const duplicateIdx = dataPoints.findIndex(p => p.date === d.date);
        const dataObj = {
          id: d.id,
          date: d.date,
          dateTime: new Date(d.date).toISOString(),
          score: parseFloat(avgScore.toFixed(1)),
          totalScore: parseFloat(totalScore.toFixed(1)),
          maxScore,
          matchFormat,
          source: 'Diary Log',
          mood: d.mood,
          achievement: d.achievement,
          notes: d.notes || ''
        };

        if (duplicateIdx >= 0) {
          dataPoints[duplicateIdx] = dataObj;
        } else {
          dataPoints.push(dataObj);
        }
      }
    });

    // Sort chronologically
    dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
    return dataPoints;
  };

  const rawGrowthData = getCombinedGrowthData();

  // Filter growth data based on selected filter (7d, 30d, 90d, 1y)
  const getFilteredGrowthData = () => {
    if (rawGrowthData.length === 0) return [];
    
    const now = new Date();
    let filterDays = 30;
    if (chartFilter === '7d') filterDays = 7;
    else if (chartFilter === '90d') filterDays = 90;
    else if (chartFilter === '1y') filterDays = 365;

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - filterDays);

    return rawGrowthData.filter(d => new Date(d.date) >= cutoffDate);
  };

  const chartData = getFilteredGrowthData();

  // Generate target curve/baseline standard pathway to show alongside actual scores
  const getChartPlotData = () => {
    // If no scores are logged, generate a fully professional simulated 1-year growth chart to show potential
    if (rawGrowthData.length === 0) {
      const simulatedPoints = [];
      const now = new Date();
      let totalPts = 12;
      let daysGap = 30; // 1 month

      if (chartFilter === '7d') { totalPts = 7; daysGap = 1; }
      else if (chartFilter === '30d') { totalPts = 10; daysGap = 3; }
      else if (chartFilter === '90d') { totalPts = 12; daysGap = 7; }

      for (let i = 0; i < totalPts; i++) {
        const d = new Date();
        d.setDate(now.getDate() - (totalPts - 1 - i) * daysGap);
        const dateStr = d.toISOString().split('T')[0];
        
        // Steady curved increase starting from 97.5 scaling up to 103.8
        const progressFactor = i / (totalPts - 1);
        const simulatedScore = (96.5 + (7.5 * progressFactor) - (2.0 * Math.pow(1 - progressFactor, 2))).toFixed(1);
        
        simulatedPoints.push({
          date: dateStr,
          displayDate: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: null, // No actual scores
          olympicTarget: parseFloat((100.0 + (4.8 * progressFactor)).toFixed(1)),
          growthTrend: parseFloat(simulatedScore),
          consistency: Math.round(75 + (18 * progressFactor))
        });
      }
      return simulatedPoints;
    }

    // Map real data to chart view
    return chartData.map((d, i) => {
      const progressFactor = i / Math.max(1, chartData.length - 1);
      // Est target progression line
      const olympicTarget = parseFloat((101.2 + (3.3 * progressFactor)).toFixed(1));
      
      // Calculate estimated inner-ten ratio based on average series score
      // A score of 104+ average is extremely high precision (near 90% inner tens)
      // A score of 95 is standard (approx 15% inner tens)
      const ratio = Math.max(5, Math.min(98, Math.round(((d.score - 92) / 13) * 100)));

      return {
        ...d,
        displayDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        olympicTarget,
        consistency: ratio
      };
    });
  };

  const plotData = getChartPlotData();

  // Metrics calculations
  const bestScore = rawGrowthData.length > 0 ? Math.max(...rawGrowthData.map(d => d.score)) : 0;
  const averageScore = rawGrowthData.length > 0 
    ? (rawGrowthData.reduce((sum, d) => sum + d.score, 0) / rawGrowthData.length).toFixed(1)
    : 0;
  
  // Growth rate calculation (first vs last)
  let growthRate = "0.0";
  if (rawGrowthData.length > 1) {
    const diff = rawGrowthData[rawGrowthData.length - 1].score - rawGrowthData[0].score;
    growthRate = (diff >= 0 ? "+" : "") + diff.toFixed(1);
  }

  // Filter diary list for the view
  const filteredDiaryEntries = diaryEntries.filter(entry => {
    const matchesSearch = 
      entry.achievement.toLowerCase().includes(search.toLowerCase()) ||
      entry.focusArea.toLowerCase().includes(search.toLowerCase()) ||
      (entry.notes && entry.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-10">
      
      {/* 1. DIARY LOG SECTION */}
      <section id="diary-form-top" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <h3 className="text-2xl font-black flex items-center gap-2 text-foreground tracking-tight">
              <BookOpen className="text-teal-500" /> Daily Practice Diary
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Log daily achievements, mental states, and fine-tune your growth journey.
            </p>
          </div>
          {isEditing && (
            <button
              onClick={resetForm}
              className="self-start text-xs font-bold text-teal-500 hover:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full flex items-center gap-1"
            >
              Cancel Edit & Create New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-5">
            <div className="bg-card/90 border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
              <h4 className="text-lg font-bold flex items-center gap-2 mb-4 text-foreground">
                {isEditing ? <Edit2 className="text-teal-500" size={18} /> : <Plus className="text-teal-500" size={18} />}
                {isEditing ? "Modify Log Entry" : "Record Today's Log"}
              </h4>
              
              <form onSubmit={handleSaveDiary} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1 flex items-center gap-1"><Calendar size={12}/> Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1 flex items-center gap-1"><Target size={12}/> Score / Group</label>
                    <input
                      type="number"
                      step="0.1"
                      value={scoreInput}
                      onChange={(e) => setScoreInput(e.target.value)}
                      placeholder="e.g. 102.4 or 612"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-2 flex items-center gap-1"><Smile size={12}/> Shooting Mood & Concentration</label>
                  <div className="flex flex-wrap gap-1.5">
                    {MOODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMood(m.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          mood === m.id
                            ? `bg-gradient-to-r ${m.color} text-white border-transparent shadow-md scale-[1.02]`
                            : 'bg-background hover:bg-accent border-border text-muted-foreground'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1 flex items-center gap-1"><Trophy className="text-amber-500" size={12}/> Today's Best Execution</label>
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => setAchievement(e.target.value)}
                    placeholder="What did you get right? (e.g. Follow-through hold)"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1 flex items-center gap-1"><Target className="text-blue-500" size={12}/> Calibration Needed Tomorrow</label>
                  <input
                    type="text"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    placeholder="What is the focal fix next? (e.g. Slow finger squeeze)"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1 flex items-center gap-1"><BookOpen size={12}/> Notes (Mental State & Wind Calibration)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe how still your stance was, your heart rhythm, or visual sight clarity..."
                    className="w-full h-24 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-foreground resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/15 transition-all hover:scale-[1.01]"
                  >
                    <Save size={16} />
                    {isEditing ? "Update Diary Log" : "Save Daily Entry"}
                  </button>
                </div>
              </form>
            </div>

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center gap-2 text-xs font-semibold"
                >
                  <Check size={16} className="bg-emerald-500 text-white rounded-full p-0.5" />
                  <span>Success! Keep updating your diary to build your Growth Curve. 📈</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Past Log List */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-foreground"
                  />
                </div>
                <select
                  value={filterMood}
                  onChange={(e) => setFilterMood(e.target.value)}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-foreground font-semibold"
                >
                  <option value="all">🧘 All State Moods</option>
                  <option value="epic">🔥 Epic / On Fire</option>
                  <option value="calm">🧘 Calm & Flowing</option>
                  <option value="tense">😰 Tense / Anxious</option>
                  <option value="tired">😴 Tired / Low</option>
                  <option value="distracted">🌀 Unfocused</option>
                </select>
              </div>

              {/* Log List Scroll Area */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 hide-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredDiaryEntries.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 border border-dashed border-border rounded-xl space-y-2"
                    >
                      <BookOpen size={36} className="text-muted-foreground/20 mx-auto" />
                      <p className="text-sm text-foreground font-bold">No diary entries matching criteria</p>
                      <p className="text-xs text-muted-foreground">Type your today's breakthroughs on the left form!</p>
                    </motion.div>
                  ) : (
                    filteredDiaryEntries.map((entry) => {
                      const moodDetail = MOODS.find(m => m.id === entry.mood) || MOODS[1];
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={entry.id}
                          className="bg-accent/15 border border-border/70 hover:border-teal-500/20 p-4 rounded-xl relative shadow-sm transition-all group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">
                                {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wide ${moodDetail.bg}`}>
                                {moodDetail.emoji} {moodDetail.label.split(' ')[0]}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditDiary(entry)}
                                className="p-1 text-muted-foreground hover:text-teal-500 hover:bg-teal-500/10 rounded transition-colors"
                                title="Edit Entry"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteDiary(entry.id)}
                                className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                title="Delete Entry"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <p className="text-foreground"><strong className="text-muted-foreground uppercase font-bold tracking-wider mr-1 text-[10px]">Best execution:</strong> {entry.achievement}</p>
                            <p className="text-foreground"><strong className="text-muted-foreground uppercase font-bold tracking-wider mr-1 text-[10px]">Micro calibration:</strong> {entry.focusArea}</p>
                            
                            {entry.score && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-500 rounded font-bold mt-1 text-[10px]">
                                🎯 Score: {entry.score}
                              </span>
                            )}
                            
                            {entry.notes && (
                              <p className="bg-background/50 border border-border/40 p-2.5 rounded-lg mt-1 italic text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRESS ANALYTICS SECTION */}
      <section className="space-y-6 pt-4 border-t border-border/80">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black flex items-center gap-2 text-foreground tracking-tight">
              <TrendingUp className="text-blue-500" /> Professional growth Analytics
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Target trajectory and actual accuracy trends day-by-day up to 365 Days.
            </p>
          </div>
          
          {/* Chart Filter */}
          <div className="flex items-center bg-accent/40 border border-border/60 p-1 rounded-full shrink-0">
            <button 
              onClick={() => setChartFilter('7d')} 
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${chartFilter === '7d' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setChartFilter('30d')} 
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${chartFilter === '30d' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              30 Days
            </button>
            <button 
              onClick={() => setChartFilter('90d')} 
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${chartFilter === '90d' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              90 Days
            </button>
            <button 
              onClick={() => setChartFilter('1y')} 
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${chartFilter === '1y' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              1 Year (365d)
            </button>
          </div>
        </div>

        {/* Growth Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-3.5 shadow-md">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">Growth Pace</p>
              <p className="text-xl sm:text-2xl font-black text-foreground">{growthRate} pts</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-3.5 shadow-md">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">Personal Record</p>
              <p className="text-xl sm:text-2xl font-black text-foreground">{bestScore > 0 ? bestScore : "0.0"}</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-3.5 shadow-md">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <Target size={20} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">Average Score</p>
              <p className="text-xl sm:text-2xl font-black text-foreground">{averageScore}</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-3.5 shadow-md">
            <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">Logs Count</p>
              <p className="text-xl sm:text-2xl font-black text-foreground">{rawGrowthData.length} records</p>
            </div>
          </div>
        </div>

        {/* Growth Pathway Recharts Graph */}
        <div className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
            <div>
              <h4 className="text-lg font-black text-foreground flex items-center gap-2">
                <Crown className="text-yellow-500" size={20} /> Gold Trajectory Performance Graph
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Displays actual training averages vs the standard baseline trajectory leading to Olympic final level (104.5+).
              </p>
            </div>
            {rawGrowthData.length === 0 && (
              <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                <Flame size={12} /> Showing Trajectory Target Pathway
              </span>
            )}
          </div>

          <div className="h-80 w-full text-foreground text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={plotData} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="targetColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="displayDate" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                <YAxis domain={[94, 107]} stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const hasReal = data.score !== null && data.score !== undefined;
                      return (
                        <div className="bg-card border border-border p-3.5 rounded-xl shadow-2xl space-y-2 max-w-[280px]">
                          <p className="text-xs font-black text-foreground border-b border-border/40 pb-1 flex items-center justify-between">
                            <span>📅 {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            {data.source && <span className="text-[9px] bg-teal-500/10 text-teal-500 border border-teal-500/20 px-1.5 py-0.5 rounded font-extrabold">{data.source}</span>}
                          </p>
                          <div className="space-y-1 text-xs">
                            {hasReal ? (
                              <>
                                <p className="text-blue-500 font-bold">🎯 Series Average: <span className="text-foreground font-black text-sm">{data.score}</span></p>
                                {data.totalScore && (
                                  <p className="text-teal-500 font-bold">📊 Total Score: <span className="text-foreground font-black text-sm">{data.totalScore} / {data.maxScore}</span> <span className="text-[10px] text-muted-foreground font-normal">({data.matchFormat} Shots)</span></p>
                                )}
                              </>
                            ) : (
                              <p className="text-blue-400/70 font-semibold italic">📈 Expected Growth: <span className="text-foreground font-black text-sm">{data.growthTrend}</span></p>
                            )}
                            <p className="text-amber-500 font-bold">👑 Olympic Baseline: <span className="text-foreground font-medium">{data.olympicTarget}</span></p>
                            <p className="text-purple-400 font-bold">💪 Precision Level: <span className="text-foreground font-medium">{data.consistency}%</span></p>
                            
                            {data.achievement && (
                              <p className="text-[10px] text-muted-foreground border-t border-border/40 pt-1.5 mt-1 leading-relaxed">
                                <strong className="text-[9px] text-amber-500 uppercase block font-bold">Best execution:</strong>
                                "{data.achievement}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconSize={10}
                  fontSize={10}
                />
                
                {/* Simulated background area for precision fill */}
                <Area name="Precision Base" type="monotone" dataKey="consistency" fill="url(#targetColor)" stroke="none" />
                
                {/* Olympic baseline target */}
                <Line name="Olympic Baseline Pathway" type="monotone" dataKey="olympicTarget" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                
                {/* actual logged scores or estimated curve */}
                {rawGrowthData.length > 0 ? (
                  <Line name="Your Average Series" type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: 'var(--card)' }} activeDot={{ r: 7 }} />
                ) : (
                  <Line name="Accuracy growth curve" type="monotone" dataKey="growthTrend" stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Journal Entries */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-lg space-y-4">
          <h4 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="text-blue-500" size={20} />
            Breakthrough Training Reflections
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
            {diaryEntries.filter(d => d.notes).map((d, idx) => (
              <div key={idx} className="bg-background border border-border/60 p-4 rounded-xl relative shadow-sm hover:border-blue-500/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-muted-foreground">📅 {new Date(d.date).toLocaleDateString()}</span>
                    {d.score && <span className="bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[9px] font-extrabold px-1.5 py-0.5 rounded">🎯 {d.score}</span>}
                  </div>
                  <p className="text-xs text-foreground italic leading-relaxed">"{d.notes}"</p>
                </div>
                <div className="border-t border-border/50 pt-2 mt-3 flex items-center justify-between text-[10px]">
                  <span className="text-amber-500 font-bold">🏆 {d.achievement.length > 28 ? d.achievement.substring(0, 28) + '...' : d.achievement}</span>
                  <span className="text-blue-500 font-bold">🎯 Focus: {d.focusArea.length > 25 ? d.focusArea.substring(0, 25) + '...' : d.focusArea}</span>
                </div>
              </div>
            ))}
            
            {diaryEntries.filter(d => d.notes).length === 0 && (
              <p className="text-sm text-muted-foreground italic col-span-2 text-center py-6">
                No technical notes written in the diary yet. Log notes on the form above to display them here!
              </p>
            )}
          </div>
        </div>

      </section>

    </div>
  );
}
