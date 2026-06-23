"use client";

import Link from "next/link";
import { Shield, TrendingUp, Heart, Milestone, GraduationCap, Coins, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const SERVICES = [
  {
    icon: <Shield className="w-8 h-8 text-gold" />,
    title: "LIC Advisory",
    description: "Tailored life insurance plans protecting your family's future while optimizing premium outlays.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-sky" />,
    title: "Mutual Fund Advisory",
    description: "Goal-based mutual fund portfolios and SIP planning designed for wealth compounding.",
  },
  {
    icon: <Heart className="w-8 h-8 text-gold" />,
    title: "Insurance Planning",
    description: "High-cover term insurance and comprehensive health plans protecting against life's uncertainties.",
  },
  {
    icon: <Milestone className="w-8 h-8 text-sky" />,
    title: "Retirement Planning",
    description: "Secure post-retirement income strategies through NPS, pension products, and annuity setups.",
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-gold" />,
    title: "Child Education",
    description: "Strategic investment funds and educational insurance policies securing your children's future studies.",
  },
  {
    icon: <Coins className="w-8 h-8 text-sky" />,
    title: "Wealth Creation",
    description: "Sustained long-term financial structures matching risk profiles with asset-allocation methods.",
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">
            Comprehensive Financial Solutions
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Empowering individuals and families with transparent, customized, and client-first financial planning strategies.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-sky-light/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Border Glow Highlight */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-sky-light/10 rounded-2xl pointer-events-none transition-all duration-300" />
              
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center group-hover:bg-navy-light group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-navy group-hover:text-sky-dark transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-semibold text-navy hover:text-sky-dark transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
