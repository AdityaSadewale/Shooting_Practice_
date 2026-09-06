import React from 'react';
import { Crown, Sparkles, TrendingUp, Users, Video, Shield, CheckCircle2, Zap, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PremiumFeatures() {
  const tiers = [
    {
      name: "Starter Pro",
      price: "5,500",
      icon: <Zap className="text-blue-400" size={28} />,
      color: "from-blue-500 to-blue-700",
      textColor: "text-blue-400",
      border: "border-blue-500/30",
      features: [
        "Advanced Target Analysis",
        "Basic Match Stress Simulations",
        "Export to PDF",
        "Standard Support"
      ]
    },
    {
      name: "Elite Pro",
      price: "10,500",
      icon: <Crown className="text-yellow-400" size={28} />,
      color: "from-yellow-500 to-yellow-700",
      textColor: "text-yellow-400",
      border: "border-yellow-500/50",
      popular: true,
      features: [
        "Everything in Starter",
        "AI-Powered Posture Analysis",
        "Unlimited Video Library Access",
        "Custom Diet & Mental Plans",
        "Priority Support"
      ]
    },
    {
      name: "Champion Pro",
      price: "13,500",
      icon: <Medal className="text-purple-400" size={28} />,
      color: "from-purple-500 to-purple-700",
      textColor: "text-purple-400",
      border: "border-purple-500/30",
      features: [
        "Everything in Elite",
        "1-on-1 Monthly Coaching",
        "Live Match Mentoring",
        "Custom Equipment Tuning Advice",
        "Direct Coach WhatsApp Access"
      ]
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in relative pb-16">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 relative z-10 pt-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full border border-yellow-500/30 mb-4"
        >
          <Sparkles className="text-yellow-500" size={32} />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
          Choose Your <span className="bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 text-transparent">Path to Gold</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Select the tier that fits your training needs. From AI analysis to 1-on-1 Olympic coaching, we have you covered.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10 px-4 mt-12">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className={`relative group ${tier.popular ? 'md:-translate-y-4' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
            )}
            
            <div className={`relative h-full bg-card/80 backdrop-blur-xl border ${tier.border} rounded-2xl p-8 flex flex-col hover:border-opacity-100 transition-colors shadow-2xl`}>
              {tier.popular && (
                <div className="absolute -top-4 right-8 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black text-xs font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">{tier.name}</h2>
                <div className="p-2 bg-background/50 rounded-xl">
                  {tier.icon}
                </div>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-border/50">
                <span className="text-2xl font-semibold text-muted-foreground">₹</span>
                <span className={`text-5xl font-black ${tier.textColor}`}>{tier.price}</span>
                <span className="text-muted-foreground font-medium ml-1">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className={`shrink-0 ${tier.textColor} mt-0.5`} size={18} />
                    <span className="text-muted-foreground text-sm leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r ${tier.color} text-white shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.98] mt-auto`}>
                Select {tier.name}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-3xl mx-auto mt-20 relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Have questions about which plan is right for you? Send us a message or email and we'll be happy to assist you with more details.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <a href="mailto:adityasadewale@gmail.com" className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                adityasadewale@gmail.com
              </a>
              <a href="tel:+917038990002" className="flex items-center gap-2 text-sm font-medium hover:text-green-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +91 7038990002
              </a>
            </div>
          </div>
          <a
            href="https://wa.me/917038990002?text=Hi%20Aditya,%20I%20am%20interested%20in%20the%20PRO%20Shooter%20plans."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all transform hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            WhatsApp Me
          </a>
        </div>
      </motion.div>
    </div>
  );
}
