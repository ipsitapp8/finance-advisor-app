"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "₹50Cr+", label: "Assets Managed" },
  { value: "2x", label: "MDRT Achiever" },
];

export default function StatsSection() {
  return (
    <section className="relative py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
