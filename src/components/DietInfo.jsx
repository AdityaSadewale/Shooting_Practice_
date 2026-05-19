import { useState } from 'react';
import { Apple, Check, X, Droplets, Calendar, Activity, Sunrise, Sun, Moon, Trophy, Target, Flame, Gift, Clock, AlertTriangle, ShieldCheck, Crosshair, Coffee, Heart, Crown, Star, Zap, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fifteenDayPlan = [
  {
    day: 1,
    schedule: {
      morning: "Oatmeal with honey, sliced bananas, and a handful of almonds.",
      lunch: "Grilled chicken or tofu salad with quinoa and olive oil dressing.",
      snack: "Green tea and a small bowl of mixed berries.",
      dinner: "Baked salmon or lentils with steamed broccoli and sweet potato."
    },
    water: "3.5 Liters (Sip consistently, extra 500ml during practice).",
    activity: "Dry fire holding practice (15 mins) focusing on follow-through.",
    fun: "Watch a world-cup final match video to study elite shooter routines.",
    strict: "Absolutely NO refined sugar today."
  },
  {
    day: 2,
    schedule: {
      morning: "Whole wheat toast with avocado and boiled eggs (or paneer).",
      lunch: "Brown rice with mixed dal and a large portion of green salad.",
      snack: "Greek yogurt with a pinch of cinnamon.",
      dinner: "Grilled turkey or roasted chickpeas with asparagus."
    },
    water: "3.5 Liters. Add a pinch of Himalayan pink salt to your morning glass.",
    activity: "Wall-sit holds (3x1 min) to build core and leg stability.",
    fun: "Play a focus-based mobile game (like Sudoku or a reaction timer).",
    strict: "No caffeine after 2 PM."
  },
  {
    day: 3,
    schedule: {
      morning: "Smoothie: Spinach, banana, almond milk, and protein powder.",
      lunch: "Whole grain wrap with lean meat/falafel and plenty of veggies.",
      snack: "Handful of walnuts and a kiwi.",
      dinner: "Stir-fried tofu/chicken with bok choy and mushrooms."
    },
    water: "3 Liters. Focus on hydration 2 hours before practice.",
    activity: "Balance board practice or single-leg stands with eyes closed (5 mins).",
    fun: "Listen to a sports psychology podcast episode.",
    strict: "Zero fried food."
  },
  {
    day: 4,
    schedule: {
      morning: "Muesli with cold milk/almond milk and fresh apples.",
      lunch: "Quinoa bowl with roasted sweet potatoes, black beans, and salsa.",
      snack: "Carrot and cucumber sticks with hummus.",
      dinner: "Light chicken soup or clear vegetable broth with whole wheat noodles."
    },
    water: "3.5 Liters. Herbal tea before bed.",
    activity: "Breathing drills: 4-7-8 breathing technique for 10 minutes.",
    fun: "Juggling practice for 10 minutes to improve hand-eye coordination.",
    strict: "No screen time 1 hour before bed."
  },
  {
    day: 5,
    schedule: {
      morning: "Scrambled eggs/tofu with spinach and whole wheat toast.",
      lunch: "Grilled fish or paneer tikka with a side of mint chutney and brown rice.",
      snack: "An apple and a spoonful of peanut butter.",
      dinner: "Zucchini noodles with light pesto and cherry tomatoes."
    },
    water: "3 Liters minimum. Track every glass.",
    activity: "Trigger squeeze exercises using a stress ball (100 reps each hand).",
    fun: "Try a new stretching routine or light yoga flow.",
    strict: "Consume all meals within a 10-hour window (e.g., 8 AM - 6 PM)."
  },
  {
    day: 6,
    schedule: {
      morning: "Oatmeal porridge with chia seeds and blueberries.",
      lunch: "Chicken/Veg clear soup with a large leafy green salad.",
      snack: "Roasted pumpkin seeds.",
      dinner: "Baked sweet potato stuffed with beans and light cheese."
    },
    water: "4 Liters (Heavy practice day hydration).",
    activity: "10m live fire or SCATT training focusing ONLY on grouping.",
    fun: "Review your own shooting journal or video.",
    strict: "No dairy today to check for inflammation reduction."
  },
  {
    day: 7,
    schedule: {
      morning: "Pancakes made from oats and banana, topped with honey.",
      lunch: "Lentil stew (Dal) with mixed vegetables and a small portion of rice.",
      snack: "Orange or grapefruit segments.",
      dinner: "Grilled lean steak or portobello mushrooms with green beans."
    },
    water: "3.5 Liters. Add lemon slices to your water bottle.",
    activity: "Visual focus shifting (near to far object focusing) for 5 minutes.",
    fun: "Rest day! Go for a nature walk without your phone.",
    strict: "Cheat meal allowed for lunch, but keep portions controlled."
  },
  {
    day: 8,
    schedule: {
      morning: "Greek yogurt parfait with layers of granola and berries.",
      lunch: "Tuna or chickpea salad sandwich on multigrain bread.",
      snack: "A small banana.",
      dinner: "Roasted chicken breast or soy chunks with Brussels sprouts."
    },
    water: "3 Liters.",
    activity: "Stance rebuilding: 20 reps of getting into position blindfolded.",
    fun: "Read a chapter of a book on mental toughness.",
    strict: "Back to strict diet. No artificial sweeteners."
  },
  {
    day: 9,
    schedule: {
      morning: "Poached eggs on avocado toast.",
      lunch: "Whole wheat pasta with a light tomato and basil sauce.",
      snack: "A handful of almonds.",
      dinner: "Steamed white fish or silken tofu with ginger and scallions."
    },
    water: "3.5 Liters. Coconut water post-practice.",
    activity: "Hold a full water bottle at arm's length (simulating weapon weight) for 3x1 min.",
    fun: "Try writing with your non-dominant hand for 10 minutes (brain plasticity).",
    strict: "No heavily processed packaged foods."
  },
  {
    day: 10,
    schedule: {
      morning: "Smoothie bowl topped with seeds and nuts.",
      lunch: "Grilled chicken or paneer wrap with lots of fresh lettuce.",
      snack: "Celery sticks with almond butter.",
      dinner: "Lentil soup with a side of steamed spinach."
    },
    water: "3 Liters. Sip constantly.",
    activity: "Dry fire: 30 perfect clicks focusing on trigger release.",
    fun: "Take a 20-minute power nap in the afternoon.",
    strict: "Limit salt intake today to reduce any water retention."
  },
  {
    day: 11,
    schedule: {
      morning: "Oatmeal with chopped dates and walnuts.",
      lunch: "Brown rice, grilled veggies, and lean protein bowl.",
      snack: "Green tea and a dark chocolate square (70%+ cocoa).",
      dinner: "Baked cauliflower steak or lean turkey with light gravy."
    },
    water: "3.5 Liters. Warm lemon water in the morning.",
    activity: "Cardio day: 20 mins of light jogging or cycling to improve VO2 max.",
    fun: "Watch a comedy show to relax facial muscles.",
    strict: "No eating 3 hours before sleep."
  },
  {
    day: 12,
    schedule: {
      morning: "Scrambled whites with mushrooms and tomatoes.",
      lunch: "Quinoa salad with pomegranate seeds and feta cheese.",
      snack: "Roasted makhanas (fox nuts).",
      dinner: "Clear vegetable broth with boiled chicken or egg whites."
    },
    water: "3 Liters. Hydration is key.",
    activity: "Core workout: Planks, Russian twists, and leg raises.",
    fun: "Solve a puzzle or Rubik's cube.",
    strict: "No refined carbs (white bread, white pasta)."
  },
  {
    day: 13,
    schedule: {
      morning: "Whole grain cereal with cold milk.",
      lunch: "Baked sweet potato wedges with a side of protein-rich salad.",
      snack: "A small pear or apple.",
      dinner: "Grilled fish or lentils with a side of steamed broccoli."
    },
    water: "3.5 Liters. Add cucumber slices to water.",
    activity: "15 minutes of progressive muscle relaxation technique.",
    fun: "Listen to your favorite upbeat music.",
    strict: "Maintain a strict 8 hours of sleep."
  },
  {
    day: 14,
    schedule: {
      morning: "Avocado toast with a sprinkle of chili flakes.",
      lunch: "Brown rice with chicken curry or mixed vegetable curry (light oil).",
      snack: "A handful of mixed nuts.",
      dinner: "Light mixed vegetable stir-fry with a small portion of tofu/chicken."
    },
    water: "4 Liters. Peak hydration before the final day.",
    activity: "Mock match: Shoot a full 60-shot qualification round.",
    fun: "Visualize winning a match while listening to your pre-match playlist.",
    strict: "Absolutely no negative self-talk today. 100% positive affirmations."
  },
  {
    day: 15,
    schedule: {
      morning: "Oatmeal with bananas and a tiny bit of honey (Pre-match meal style).",
      lunch: "Light, easily digestible salad with a small protein portion.",
      snack: "A few sips of sports drink or coconut water.",
      dinner: "Celebration meal! Enjoy your favorite healthy dish."
    },
    water: "3 Liters. Sip moderately so you don't feel bloated.",
    activity: "Light stretching and mental rehearsal only. Rest the eyes.",
    fun: "Reflect on the 15 days. Write down the improvements you feel.",
    strict: "Celebrate the consistency! You've upgraded your focus."
  }
];

export default function DietInfo() {
  const [selectedDay, setSelectedDay] = useState(1);
  const dayData = fifteenDayPlan.find(d => d.day === selectedDay);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">

      {/* Header */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-900/20 border border-green-500/30 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-green-500">
          <Apple size={150} />
        </div>
        <div className="relative z-10 flex flex-col items-start gap-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
            <Target size={14} /> Elite Nutrition
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Shooter's Diet & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Focus Guide</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Your body is the platform for your weapon. What you eat directly dictates your heart rate, micro-tremors, and mental clarity on the line.
          </p>
        </div>
      </div>

      {/* Task-Wise Instructions (Match Strategy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-500">
            <Clock size={20} /> Pre-Match
          </h3>
          <p className="text-xs text-muted-foreground mb-4 italic">2-3 hours before shooting</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <span className="text-foreground"><strong>Eat:</strong> Complex Carbs (Oats, brown rice) for slow-release energy.</span></li>
            <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <span className="text-foreground"><strong>Eat:</strong> Bananas (Natural beta-blockers, reduces tremors).</span></li>
            <li className="flex items-start gap-2"><X size={16} className="text-red-500 shrink-0 mt-0.5" /> <span className="text-muted-foreground"><strong>Avoid:</strong> Caffeine/Coffee (Causes immediate heart rate spikes).</span></li>
            <li className="flex items-start gap-2"><X size={16} className="text-red-500 shrink-0 mt-0.5" /> <span className="text-muted-foreground"><strong>Avoid:</strong> Heavy fats & excess dairy (Causes sluggishness).</span></li>
          </ul>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-yellow-500">
            <Target size={20} /> During Match
          </h3>
          <p className="text-xs text-muted-foreground mb-4 italic">Between series / timeouts</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <span className="text-foreground"><strong>Action:</strong> Sip water regularly. A 2% drop in hydration drops focus by 20%.</span></li>
            <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <span className="text-foreground"><strong>Eat:</strong> Small bite of banana or dark chocolate if blood sugar drops.</span></li>
            <li className="flex items-start gap-2"><X size={16} className="text-red-500 shrink-0 mt-0.5" /> <span className="text-muted-foreground"><strong>Avoid:</strong> Gulping large amounts of water (Causes bloating).</span></li>
            <li className="flex items-start gap-2"><X size={16} className="text-red-500 shrink-0 mt-0.5" /> <span className="text-muted-foreground"><strong>Avoid:</strong> Sugary sports drinks (Causes insulin spikes and crashes).</span></li>
          </ul>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-500">
            <ShieldCheck size={20} /> Post-Match
          </h3>
          <p className="text-xs text-muted-foreground mb-4 italic">Within 1 hour after shooting</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <span className="text-foreground"><strong>Eat:</strong> High lean protein (Chicken, Tofu, Fish) for back/core muscle recovery.</span></li>
            <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <span className="text-foreground"><strong>Action:</strong> Electrolytes / Coconut water to replenish lost minerals.</span></li>
            <li className="flex items-start gap-2"><X size={16} className="text-red-500 shrink-0 mt-0.5" /> <span className="text-muted-foreground"><strong>Avoid:</strong> Immediate junk food binging (Induces inflammation).</span></li>
            <li className="flex items-start gap-2"><X size={16} className="text-red-500 shrink-0 mt-0.5" /> <span className="text-muted-foreground"><strong>Avoid:</strong> Alcohol (Destroys REM sleep needed for neural recovery).</span></li>
          </ul>
        </div>
      </div>

      {/* 15-Day Strict Plan Section */}
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* Sidebar Selector */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-accent/10 flex flex-col">
          <div className="p-6 border-b border-border bg-background/50">
            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Calendar className="text-orange-500" />
              15-Day Strict Plan
            </h3>
            <p className="text-xs text-muted-foreground mt-2">Commit to 15 days of perfect nutrition and mental tasks to rewire your focus.</p>
          </div>

          <div className="overflow-x-auto md:overflow-y-auto flex md:flex-col p-4 gap-2 md:max-h-[600px] hide-scrollbar custom-scrollbar">
            {fifteenDayPlan.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`flex-shrink-0 md:w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-300 ${selectedDay === day.day
                  ? 'bg-orange-500 text-white shadow-md scale-[1.02]'
                  : 'bg-background hover:bg-accent border border-border/50 text-foreground hover:border-orange-500/30'
                  }`}
              >
                <span className="font-bold">Day {day.day}</span>
                {selectedDay === day.day && <Flame size={18} className="animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 p-6 md:p-8 bg-background relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-sm flex items-center gap-1">
                    <Activity size={16} /> Protocol Active
                  </span>
                  <h3 className="text-3xl font-black mt-1">Day {dayData.day}</h3>
                </div>
                <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 max-w-[200px] text-right">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{dayData.strict}</span>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="bg-accent/20 border border-border p-5 rounded-2xl space-y-4 relative group hover:bg-accent/30 transition-colors">
                  <h4 className="font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
                    <Apple size={18} className="text-green-500" /> Nutrition Schedule
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1 mb-1"><Sunrise size={14} /> Morning</p>
                      <p className="text-sm font-medium text-foreground">{dayData.schedule.morning}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1 mb-1"><Sun size={14} /> Lunch</p>
                      <p className="text-sm font-medium text-foreground">{dayData.schedule.lunch}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1 mb-1"><Coffee size={14} /> Snack</p>
                      <p className="text-sm font-medium text-foreground">{dayData.schedule.snack}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1 mb-1"><Moon size={14} /> Dinner</p>
                      <p className="text-sm font-medium text-foreground">{dayData.schedule.dinner}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl hover:bg-blue-500/10 transition-colors">
                    <h4 className="font-bold text-blue-500 flex items-center gap-2 mb-2">
                      <Droplets size={18} /> Water Intake
                    </h4>
                    <p className="text-sm font-medium text-foreground">{dayData.water}</p>
                  </div>

                  <div className="bg-purple-500/5 border border-purple-500/20 p-5 rounded-2xl hover:bg-purple-500/10 transition-colors">
                    <h4 className="font-bold text-purple-500 flex items-center gap-2 mb-2">
                      <Heart size={18} /> Daily Fun & Mind
                    </h4>
                    <p className="text-sm font-medium text-foreground">{dayData.fun}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-5 rounded-2xl">
                  <h4 className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 mb-2">
                    <Crosshair size={18} /> Practice Task
                  </h4>
                  <p className="text-sm font-bold text-foreground">{dayData.activity}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bonus Tips Section */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Gift size={200} className="text-indigo-500" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black flex items-center gap-2 text-foreground mb-4">
            <Trophy className="text-yellow-500" /> Post-15 Day Bonus Rewards
          </h3>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Completing a 15-day strict diet without cheating is a massive mental victory. It proves you have the discipline required to win medals. Here is how to lock in those gains:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-500 shrink-0"><Check size={20} /></div>
              <div>
                <h4 className="font-bold text-foreground mb-1">The 80/20 Rule</h4>
                <p className="text-sm text-muted-foreground">You can now transition to an 80/20 lifestyle. 80% strict elite nutrition, 20% relaxed meals to maintain sanity without losing your baseline focus.</p>
              </div>
            </div>
            <div className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <div className="bg-pink-500/20 p-2 rounded-lg text-pink-500 shrink-0"><Gift size={20} /></div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Guilt-Free Cheat Day</h4>
                <p className="text-sm text-muted-foreground">Take one full day off to eat your favorite foods. Notice how your body feels heavier—this builds the mental association that clean food equals high performance.</p>
              </div>
            </div>
            <div className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-xl flex items-start gap-3 shadow-sm md:col-span-2">
              <div className="bg-green-500/20 p-2 rounded-lg text-green-500 shrink-0"><Activity size={20} /></div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Notice The Difference in Hold</h4>
                <p className="text-sm text-muted-foreground">Next time you lift your weapon, pay attention to your heart rate and micro-tremors. You will notice a significantly steadier hold and a calmer mind because your nervous system is no longer fighting inflammation and sugar spikes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Plan Section */}
      <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border border-yellow-500/30 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden mt-8 group hover:border-yellow-500/50 transition-colors">
        <div className="absolute -right-10 -bottom-10 opacity-10 transition-transform group-hover:scale-110 duration-500">
          <Crown size={200} className="text-yellow-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
              <Crown size={14} /> PRO
            </span>
          </div>
          <h3 className="text-2xl font-black flex items-center gap-2 text-foreground mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Premium Shooter's Protocol</span>
          </h3>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Ready to take it to the Olympic level? Unlock our personalized, macro-calculated nutrition plans tailored to your exact body weight, training intensity, and competition schedule.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-xl flex items-center gap-3 shadow-sm hover:border-yellow-500/30 transition-colors">
              <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500 shrink-0"><Star size={20} /></div>
              <h4 className="font-bold text-sm text-foreground">Custom Macros</h4>
            </div>
            <div className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-xl flex items-center gap-3 shadow-sm hover:border-orange-500/30 transition-colors">
              <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500 shrink-0"><Zap size={20} /></div>
              <h4 className="font-bold text-sm text-foreground">Live Hydration Tracking</h4>
            </div>
            <div className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-xl flex items-center gap-3 shadow-sm hover:border-red-500/30 transition-colors">
              <div className="bg-red-500/20 p-2 rounded-lg text-red-500 shrink-0"><Target size={20} /></div>
              <h4 className="font-bold text-sm text-foreground">Match-Day Secrets</h4>
            </div>
          </div>

          <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
            <Lock size={18} /> Unlock Premium Plan
          </button>
        </div>
      </div>

    </div>
  );
}
