"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import MdrtBadge from "./MdrtBadge";
import TrustIndicators from "./TrustIndicators";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
      {/* Background Dot Grid Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(56, 189, 248, 0.2) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />
      
      {/* Animated Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-sky/10 blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-gold/5 blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Content (60% equivalent: 7 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <div className="inline-block">
            <MdrtBadge />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15]">
            Securing Your Financial Future With{" "}
            <span className="bg-gradient-to-r from-sky-light to-gold-light bg-clip-text text-transparent">
              Trust & Expertise
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl">
            20+ years of dedicated service in LIC policy portfolios, mutual funds, and custom wealth creation strategies for families across India.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-navy transition-all duration-300 shadow-xl hover:shadow-gold/20 hover:-translate-y-1"
            >
              Get Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 hover:-translate-y-1"
            >
              Explore Services
            </Link>
          </div>

          {/* Trust Indicators Component */}
          <TrustIndicators />
        </motion.div>

        {/* Right Side Visuals (40% equivalent: 5 cols) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          {/* Main Visual Circle */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-sky-light/20 to-navy-mid border-2 border-white/10 flex items-center justify-center shadow-2xl">
            {/* Inner Graphic Grid */}
            <div className="absolute inset-4 rounded-full border border-dashed border-sky-light/20 animate-spin" style={{ animationDuration: '30s' }} />
            
            <div className="text-center p-8 space-y-3 z-10">
              <Award className="w-20 h-20 text-gold mx-auto animate-bounce" style={{ animationDuration: '3s' }} />
              <h3 className="font-serif text-2xl font-semibold text-white">Pratik Shah</h3>
              <p className="text-sm text-sky-light font-medium uppercase tracking-widest">Your Financial Advisor</p>
            </div>
          </div>

          {/* Floating Card 1: MDRT */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-4 -left-4 glass-card p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[200px]"
          >
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Global Standard</p>
              <h4 className="text-sm font-bold text-white">MDRT Achiever</h4>
            </div>
          </motion.div>

          {/* Floating Card 2: Happy Clients */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: 2, ease: "easeInOut" }}
            className="absolute -bottom-4 -right-4 glass-card p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[210px]"
          >
            <div className="w-10 h-10 rounded-full bg-sky-dark/20 flex items-center justify-center text-sky-light">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Track Record</p>
              <h4 className="text-sm font-bold text-white">500+ Clients Served</h4>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
