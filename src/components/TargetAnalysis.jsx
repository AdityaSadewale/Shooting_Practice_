import { useState, useMemo } from 'react';
import { Crosshair, AlertTriangle, ChevronRight, Activity } from 'lucide-react';

export default function TargetAnalysis() {
  // Generate mock 20-shot series for demonstration
  // Normal distribution around a bias point
  const generateShots = (biasX, biasY, spread) => {
    return Array.from({ length: 20 }).map((_, i) => {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
      
      const x = biasX + z0 * spread;
      const y = biasY + z1 * spread;
      
      // Calculate score based on distance from center (0,0 is center, max radius is 50)
      const distance = Math.sqrt(x*x + y*y);
      let score = 10.9 - (distance / 5);
      if (score < 0) score = 0;
      
      return { id: i, x, y, score: score.toFixed(1) };
    });
  };

  const [shots, setShots] = useState(() => generateShots(-15, 10, 10)); // Top-left bias
  
  const analytics = useMemo(() => {
    if (shots.length === 0) return null;
    
    let sumX = 0, sumY = 0;
    shots.forEach(s => { sumX += s.x; sumY += s.y; });
    const cx = sumX / shots.length;
    const cy = sumY / shots.length;
    
    let sumDist = 0;
    shots.forEach(s => {
      const dx = s.x - cx;
      const dy = s.y - cy;
      sumDist += Math.sqrt(dx*dx + dy*dy);
    });
    
    const meanRadius = sumDist / shots.length;
    
    let biasText = "Centered";
    if (cx < -5 && cy < -5) biasText = "Top-Left Bias";
    else if (cx > 5 && cy < -5) biasText = "Top-Right Bias";
    else if (cx < -5 && cy > 5) biasText = "Bottom-Left Bias";
    else if (cx > 5 && cy > 5) biasText = "Bottom-Right Bias";
    else if (cy < -10) biasText = "High Bias";
    else if (cy > 10) biasText = "Low Bias";
    else if (cx < -10) biasText = "Left Bias";
    else if (cx > 10) biasText = "Right Bias";

    return { cx, cy, meanRadius, biasText };
  }, [shots]);

  const runNewSimulation = (type) => {
    if (type === 'good') setShots(generateShots(0, 0, 4)); // Tight, centered group
    else if (type === 'bad-trigger') setShots(generateShots(20, 20, 12)); // Low-right (common right hand trigger snatch)
    else if (type === 'fatigue') setShots(generateShots(0, 30, 15)); // Low (holding fatigue)
  };

  return (
    <div className="bg-card border border-border p-6 rounded-xl space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Activity className="text-blue-500" />
          Grouping Analysis
        </h3>
        <div className="flex gap-2">
           <button onClick={() => runNewSimulation('good')} className="px-3 py-1.5 text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded font-semibold border border-green-500/20">Tight Group</button>
           <button onClick={() => runNewSimulation('bad-trigger')} className="px-3 py-1.5 text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded font-semibold border border-red-500/20">Trigger Error</button>
           <button onClick={() => runNewSimulation('fatigue')} className="px-3 py-1.5 text-xs bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 rounded font-semibold border border-orange-500/20">Fatigue</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Target Visualization */}
        <div className="relative aspect-square max-w-[400px] w-full mx-auto bg-white rounded-lg p-4 shadow-inner">
           {/* SVG Target */}
           <svg viewBox="0 0 100 100" className="w-full h-full">
             {/* Rings 1 to 9 */}
             <circle cx="50" cy="50" r="45" fill="white" stroke="black" strokeWidth="0.5" />
             <circle cx="50" cy="50" r="40" fill="white" stroke="black" strokeWidth="0.5" />
             <circle cx="50" cy="50" r="35" fill="white" stroke="black" strokeWidth="0.5" />
             <circle cx="50" cy="50" r="30" fill="white" stroke="black" strokeWidth="0.5" />
             
             {/* Black aiming mark (Rings 4 to 9 + 10) */}
             <circle cx="50" cy="50" r="25" fill="#1a1a1a" />
             <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.2" />
             <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.2" />
             <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.2" />
             <circle cx="50" cy="50" r="5" fill="none" stroke="white" strokeWidth="0.2" />
             
             {/* Inner 10 Dot */}
             <circle cx="50" cy="50" r="1" fill="white" />

             {/* Group Center Crosshair */}
             {analytics && (
               <g className="opacity-40 pointer-events-none">
                 <line x1={50 + analytics.cx - 5} y1={50 + analytics.cy} x2={50 + analytics.cx + 5} y2={50 + analytics.cy} stroke="blue" strokeWidth="0.5" />
                 <line x1={50 + analytics.cx} y1={50 + analytics.cy - 5} x2={50 + analytics.cx} y2={50 + analytics.cy + 5} stroke="blue" strokeWidth="0.5" />
                 <circle cx={50 + analytics.cx} cy={50 + analytics.cy} r={analytics.meanRadius} fill="none" stroke="blue" strokeWidth="0.5" strokeDasharray="1 1" />
               </g>
             )}

             {/* Shots */}
             {shots.map((shot, i) => (
               <circle 
                 key={shot.id} 
                 cx={50 + shot.x} 
                 cy={50 + shot.y} 
                 r="1.5" 
                 fill={parseFloat(shot.score) >= 10.0 ? '#22c55e' : '#ef4444'} 
                 stroke="black"
                 strokeWidth="0.2"
                 className="opacity-80 hover:opacity-100 hover:r-2 transition-all cursor-pointer"
               >
                 <title>Shot {i+1}: {shot.score}</title>
               </circle>
             ))}
           </svg>
        </div>

        {/* Analytics Dashboard */}
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-background border border-border p-4 rounded-lg">
                 <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Mean Radius</p>
                 <p className="text-2xl font-mono text-foreground font-black">{analytics?.meanRadius.toFixed(2)}</p>
                 <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
              </div>
              <div className="bg-background border border-border p-4 rounded-lg">
                 <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Group Bias</p>
                 <p className={`text-lg font-bold ${analytics?.biasText === 'Centered' ? 'text-green-500' : 'text-orange-500'}`}>{analytics?.biasText}</p>
                 <p className="text-xs text-muted-foreground mt-1 font-mono">X: {analytics?.cx.toFixed(1)} / Y: {-analytics?.cy.toFixed(1)}</p>
              </div>
           </div>

           <div className="bg-accent/20 border border-border p-4 rounded-lg">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                 <AlertTriangle size={16} className="text-yellow-500" /> Diagnostics
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                 {analytics?.biasText === 'Centered' 
                   ? "Excellent position and follow-through. Maintain current tension and sight picture."
                   : analytics?.biasText.includes('Right') 
                   ? "Consistent right-side bias often indicates snatching the trigger or improper index finger placement. Ensure smooth, straight rearward pressure."
                   : analytics?.biasText.includes('Low')
                   ? "Low shots suggest anticipating the recoil (breaking the wrist down) or holding breath too long causing visual/muscle fatigue."
                   : "Check natural point of aim. Close your eyes, settle into position, and open them. If the sights aren't aligned naturally, shift your feet, not your arms."}
              </p>
           </div>
           
           <div className="bg-background border border-border rounded-lg overflow-hidden">
             <div className="bg-muted px-4 py-2 text-xs font-bold uppercase tracking-wider border-b border-border">20-Shot Series Data</div>
             <div className="max-h-40 overflow-y-auto p-2 grid grid-cols-5 gap-2 text-center text-sm font-mono">
<<<<<<< HEAD
                {shots.map((s, index) => (
                  <div key={`${s.id}-${index}`} className={`py-1 rounded ${parseFloat(s.score) >= 10.3 ? 'bg-green-500/10 text-green-500 font-bold' : 'text-muted-foreground'}`}>
=======
                {shots.map((s) => (
                  <div key={s.id} className={`py-1 rounded ${parseFloat(s.score) >= 10.3 ? 'bg-green-500/10 text-green-500 font-bold' : 'text-muted-foreground'}`}>
>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8
                    {s.score}
                  </div>
                ))}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
