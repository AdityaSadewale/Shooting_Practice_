import { Apple, EyeOff, Check, X } from 'lucide-react';

export default function DietInfo() {
  return (
    <div className="bg-card border border-border p-6 rounded-xl space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
        <Apple className="text-green-500" />
        Shooter's Diet & Focus Guide
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What to eat */}
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
            <Check size={18} /> Foods to Eat
          </h4>
          <ul className="space-y-2 text-sm text-foreground">
            <li><strong>Complex Carbs (Oats, Whole Grains):</strong> Provides steady glucose to the brain, maintaining focus over long matches without spikes.</li>
            <li><strong>Lean Proteins (Chicken, Fish, Tofu):</strong> Aids in muscle repair and keeps you satiated without feeling heavy.</li>
            <li><strong>Bananas:</strong> Natural beta-blockers! Potassium helps steady nerves and reduces micro-tremors in holding practice.</li>
            <li><strong>Almonds & Walnuts:</strong> High in Omega-3s and Magnesium, which support cognitive function and reduce muscle tension.</li>
          </ul>
        </div>

        {/* What to avoid */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
            <X size={18} /> Foods to Avoid
          </h4>
          <ul className="space-y-2 text-sm text-foreground">
            <li><strong>Caffeine & Energy Drinks:</strong> Increases heart rate and induces micro-tremors. A shooter's absolute worst enemy.</li>
            <li><strong>High-Sugar Snacks:</strong> Causes a rapid insulin spike followed by a crash, destroying focus and causing fatigue during a match.</li>
            <li><strong>Heavy/Greasy Fast Food:</strong> Diverts blood flow to digestion, making you feel sluggish and lowering reaction time.</li>
            <li><strong>Excessive Dairy Pre-Match:</strong> Can cause bloating or acid reflux while holding your stance in a final.</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
          <EyeOff size={18} /> Focus Improvements
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Hydration is the most critical element of focus. A 2% drop in hydration can lead to a 20% drop in cognitive performance and vision sharpness. Sip water continuously throughout the match. Practice box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) to lower heart rate naturally before lifting the weapon.
        </p>
      </div>
    </div>
  );
}
