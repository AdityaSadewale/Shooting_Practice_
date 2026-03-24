import { useState, useEffect } from 'react';
import { getSessions } from '../lib/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, BookOpen } from 'lucide-react';

export default function Analytics() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  if (sessions.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed border-border rounded-xl">
        <h3 className="text-lg font-semibold mb-2">No data yet</h3>
        <p className="text-muted-foreground">Complete your first 4-hour training session to see analytics.</p>
      </div>
    );
  }

  // Calculate metrics
  const chartData = sessions.map((s, idx) => {
    const avgScore = s.scores.length > 0 
      ? (s.scores.reduce((a, b) => a + b, 0) / s.scores.length).toFixed(1)
      : 0;
      
    // Inner ten approximation: assuming scores 10.3 and higher are inner tens.
    // We only have series scores (e.g., 102.4 for 10 shots), so we can approximate inner tens
    // based on the average shot value. Since real inner tens require per-shot data:
    // This is a statistical rough approximation for the UI:
    const seriesAverage = avgScore / 10; 
    let innerTenPct = 0;
    if (seriesAverage >= 10.3) innerTenPct = 80;
    else if (seriesAverage >= 10.0) innerTenPct = 40;
    else if (seriesAverage >= 9.5) innerTenPct = 10;

    return {
      name: `Session ${idx + 1}`,
      date: new Date(s.date).toLocaleDateString(),
      average: parseFloat(avgScore),
      innerTenPct
    };
  });

  const latestSession = sessions[sessions.length - 1];
  const totalMatchesLogged = sessions.filter(s => s.scores.length > 0).length;

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Matches Logged</p>
            <p className="text-2xl font-bold">{totalMatchesLogged}</p>
          </div>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Est. Inner Ten Ratio</p>
            <p className="text-2xl font-bold">{chartData[chartData.length - 1]?.innerTenPct || 0}%</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-6">Average Series Score Trend</h3>
        <div className="h-64 w-full text-foreground text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--blue-500)' }}
              />
              <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="text-blue-500" size={20} />
          Recent Confidence Journal
        </h3>
        
        {sessions.slice().reverse().map((s, idx) => s.journal ? (
          <div key={idx} className="border-l-2 border-blue-500 pl-4 py-1">
            <p className="text-xs text-muted-foreground mb-1">{new Date(s.date).toLocaleDateString()}</p>
            <p className="text-sm italic">"{s.journal}"</p>
          </div>
        ) : null)}
        
        {!sessions.some(s => s.journal) && (
          <p className="text-sm text-muted-foreground italic">No journal entries found.</p>
        )}
      </div>

    </div>
  );
}
