"use client";

import Link from "next/link";
import { CheckCircle2, MessageSquare, Trophy, Calendar, ShieldCheck } from "lucide-react";
import HeroSection from "@/components/public/HeroSection";
import StatsSection from "@/components/public/StatsSection";
import ServicesGrid from "@/components/public/ServicesGrid";
import TestimonialsCarousel from "@/components/public/TestimonialsCarousel";

const WHY_CHOOSE_ME = [
  {
    title: "Personalized Strategy",
    description: "Every investment plan is custom-crafted to align with your unique family goals and risk appetite.",
  },
  {
    title: "Decades of Experience",
    description: "Backed by 20+ years of active market presence, guiding families through multiple market cycles.",
  },
  {
    title: "Transparent Advisory",
    description: "Strict adherence to code of ethics, zero hidden fees, and transparent commission structure disclosures.",
  },
  {
    title: "24/7 Support",
    description: "Always available to support clients with claim settlements, emergency withdrawals, or policy status queries.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Stats Section */}
      <StatsSection />

      {/* 3. Services Grid */}
      <ServicesGrid />

      {/* 4. Why Choose Me Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphics Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-80 h-96 sm:w-96 sm:h-[450px] bg-gradient-to-br from-navy-mid to-navy rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center p-6 text-center overflow-hidden">
                {/* SVG pattern overlay */}
                <div 
                  className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(45deg, #0EA5E9 25%, transparent 25%), linear-gradient(-45deg, #0EA5E9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0EA5E9 75%), linear-gradient(-45deg, transparent 75%, #0EA5E9 75%)",
                    backgroundSize: "20px 20px"
                  }}
                />
                
                <div className="space-y-6 relative z-10">
                  <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto border border-gold/20">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white">Guaranteed Trust</h3>
                  <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
                    Your financial well-being is protected by two decades of regulatory compliance and client loyalty.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-sky-light">LIC AGENT</span>
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gold">AMFI MFD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">
                  Why Choose Pratik Shah as Your Advisor?
                </h2>
                <p className="text-gray-600 text-base">
                  We bridge the gap between financial complexity and peace of mind by offering structured investment paths.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {WHY_CHOOSE_ME.map((point, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="shrink-0 mt-1">
                      <CheckCircle2 className="w-6 h-6 text-gold fill-gold/10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-bold text-navy">{point.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MDRT Achievement Banner */}
      <section className="py-16 bg-gradient-to-r from-navy via-navy-light to-navy text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto shadow-lg shadow-gold/25 animate-pulse">
            <Trophy className="w-10 h-10 text-gold" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">
            Proud MDRT Achiever <span className="text-gold">(2023 & 2024)</span>
          </h2>
          
          <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto font-light leading-relaxed">
            The Million Dollar Round Table (MDRT) is an elite global, independent association of the world's leading life insurance and financial services professionals. Membership is only granted to the top 6% of professionals worldwide who demonstrate exceptional knowledge, client service, and ethical conduct.
          </p>

          <div className="pt-2">
            <Link
              href="/achievements"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-navy text-sm font-semibold transition-all duration-300"
            >
              Learn More About MDRT Recognition
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Preview */}
      <TestimonialsCarousel />

      {/* 7. Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold via-gold-light to-gold text-navy text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
            Ready to Secure Your Family's Financial Future?
          </h2>
          <p className="text-navy/80 text-base md:text-lg max-w-2xl mx-auto">
            Schedule a free introductory consultation to review your existing insurance policies and mutual fund holdings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold bg-success hover:bg-success-dark text-white shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
            >
              <MessageSquare className="mr-2 w-5 h-5 fill-white" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold bg-white hover:bg-gray-100 text-navy shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Schedule Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
