"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Amit Sharma",
    occupation: "Business Owner",
    quote: "Mr. Pratik Shah has been handling my family's investments and life insurance policies for over 15 years. His integrity, deep understanding of market trends, and prompt service during claims are unmatched.",
    rating: 5,
    tag: "LIC & Wealth"
  },
  {
    name: "Priya Patel",
    occupation: "Software Engineer",
    quote: "As a young IT professional, I was completely lost with tax-saving and investments. Pratik guided me through ELSS tax saving mutual funds and term insurance. Truly simplified my finances!",
    rating: 5,
    tag: "Tax & Mutual Funds"
  },
  {
    name: "Vikram Singh",
    occupation: "Managing Director",
    quote: "The level of customization and personal attention I receive is incredible. The retirement and wealth protection plans mapped out by Pratik are robust. I sleep easy knowing my family's future is secure.",
    rating: 5,
    tag: "Retirement Planning"
  }
];

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">
            Trusted By Over 500+ Families
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Read real feedback from clients who have partnered with us for long-term growth and protection.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative"
            >
              <div className="absolute top-6 right-8 text-sky-light/10">
                <MessageSquare className="w-24 h-24 stroke-[3]" />
              </div>

              <div className="space-y-6">
                {/* Stars */}
                <div className="flex space-x-1">
                  {Array.from({ length: TESTIMONIALS[activeIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-navy italic leading-relaxed font-light">
                  "{TESTIMONIALS[activeIndex].quote}"
                </blockquote>

                {/* Client Profile */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-light to-navy-mid text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(TESTIMONIALS[activeIndex].name)}
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-navy">
                      {TESTIMONIALS[activeIndex].name}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {TESTIMONIALS[activeIndex].occupation} • <span className="text-sky-dark">{TESTIMONIALS[activeIndex].tag}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left/Right Buttons */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors duration-200 hover:border-navy"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? "bg-gold w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors duration-200 hover:border-navy"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View All Testimonials Button */}
        <div className="text-center mt-12">
          <Link
            href="/testimonials"
            className="inline-flex items-center text-sm font-semibold text-navy hover:text-gold transition-colors"
          >
            View All Testimonials
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
