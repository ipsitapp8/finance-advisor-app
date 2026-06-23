"use client";

import { Trophy, Award, Calendar, Check, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const ACHIEVEMENTS_STATS = [
  { value: "Top 6%", label: "Globally Placed" },
  { value: "2 Years", label: "Consecutive MDRT" },
  { value: "500+", label: "Clients Protected" },
  { value: "20+", label: "Years Active Service" },
];

const MDRT_PILLARS = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-gold" />,
    title: "Strict Ethics",
    desc: "Placing client interests above all else. Adherence to AMFI guidelines and LIC professional codes.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-sky" />,
    title: "Service Excellence",
    desc: "Providing instant policy claims assistance, annual reviews, and round-the-clock claim guidance.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-gold" />,
    title: "Product Expertise",
    desc: "Rigorous research into policy features, tax implications, and asset class comparisons.",
  },
];

const MILESTONES = [
  {
    year: "2005",
    title: "Admitted as LIC Agent",
    desc: "Began marketing life safety endowment policies in Delhi-NCR.",
  },
  {
    year: "2012",
    title: "AMFI ARN Registration",
    desc: "Became a registered mutual fund distributor. Set up systematic portfolios.",
  },
  {
    year: "2018",
    title: "Outstanding Performance Award",
    desc: "Recognized by LIC regional managers for protecting 100+ lives in a single fiscal year.",
  },
  {
    year: "2023",
    title: "MDRT Global Member Selection",
    desc: "Achieved the prestigious global MDRT benchmark for top financial producers.",
  },
  {
    year: "2024",
    title: "MDRT Membership Renewal",
    desc: "Successfully qualified for consecutive year membership at the Million Dollar Round Table.",
  },
];

export default function AchievementsPageClient() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. MDRT Premium Hero Section */}
      <section className="relative bg-[#050C16] py-32 text-center text-white overflow-hidden border-b border-gold/10">
        {/* Particle/Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6 flex flex-col items-center">
          {/* Large MDRT Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-32 h-32 rounded-full border-4 border-gold bg-gradient-to-br from-gold/20 via-navy-light to-navy flex flex-col items-center justify-center shadow-2xl shadow-gold/20 relative"
          >
            <Trophy className="w-12 h-12 text-gold animate-bounce" style={{ animationDuration: '3s' }} />
            <span className="text-xs font-serif font-black text-white tracking-widest mt-1">MDRT</span>
          </motion.div>

          <div className="space-y-3">
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Million Dollar Round Table Member
            </h1>
            <p className="text-gold font-medium uppercase tracking-widest text-xs sm:text-sm">
              An elite global recognition awarded to the top 6% of financial professionals worldwide
            </p>
          </div>

          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
            MDRT membership is recognized internationally as the standard of excellence in the life insurance and financial services business. It is awarded only to professionals who demonstrate exceptional professional knowledge, strict ethical conduct, and outstanding client service.
          </p>

          {/* Years Pills */}
          <div className="flex justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider">
              2023 Member <Check className="w-3.5 h-3.5" />
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider">
              2024 Member <Check className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* 2. Achievement Stats */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {ACHIEVEMENTS_STATS.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-gold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Achievements Timeline */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-3xl font-bold text-navy">Chronology of Achievements</h2>
          <p className="text-gray-600 text-sm">A trace of commitment, growth, and industry qualification since 2005.</p>
        </div>

        <div className="relative border-l border-gray-200 pl-6 ml-4 sm:ml-8 space-y-12">
          {MILESTONES.map((milestone, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-gold border-2 border-white shadow" />
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-sky-dark bg-sky/10 border border-sky/20 px-2.5 py-0.5 rounded-full">
                  {milestone.year}
                </span>
                <h3 className="font-serif text-lg font-bold text-navy pt-1">{milestone.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What MDRT Means (The Pillars) */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl font-bold">What MDRT Standing Means For Our Clients</h2>
            <p className="text-gray-400 text-sm">
              We operate under the core pillars of the Million Dollar Round Table code of conduct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MDRT_PILLARS.map((pillar, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4 hover:border-gold/30 hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gold">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-white">{pillar.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
