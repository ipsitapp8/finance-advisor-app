"use client";

import { Star, ShieldCheck, CheckSquare, Award, TrendingUp } from "lucide-react";

const TESTIMONIALS_LIST = [
  {
    name: "Amit S.",
    occupation: "Business Owner",
    policy: "LIC Jeevan Anand & Term Cover",
    quote: "Mr. Pratik Shah has been handling my family's investments and life insurance policies for over 15 years. His integrity, deep understanding of market trends, and prompt service during claims are unmatched.",
    rating: 5,
  },
  {
    name: "Priya P.",
    occupation: "Software Engineer",
    policy: "Tax Saving ELSS & SIPs",
    quote: "As a young IT professional, I was completely lost with tax-saving and investments. Pratik guided me through ELSS tax saving mutual funds and term insurance. Truly simplified my finances!",
    rating: 5,
  },
  {
    name: "Vikram S.",
    occupation: "Managing Director",
    policy: "Retirement Annuity & AUM",
    quote: "The level of customization and personal attention I receive is incredible. The retirement and wealth protection plans mapped out by Pratik are robust. I sleep easy knowing my family's future is secure.",
    rating: 5,
  },
  {
    name: "Sunita R.",
    occupation: "Home Maker",
    policy: "Child Future Plan",
    quote: "Exceptional advisory! Very transparent about costs, returns, and lock-in periods. Highly recommended for anyone looking for reliable financial advisory in India.",
    rating: 5,
  },
  {
    name: "Karan M.",
    occupation: "Creative Director",
    policy: "Health Insurance & SIP",
    quote: "Pratik restructured my health coverage and sorted out a lapsed life policy. Excellent, ethical service. Never pushes any products.",
    rating: 5,
  },
  {
    name: "Divya K.",
    occupation: "Consultant",
    policy: "Term Life & ULIP",
    quote: "Secured a 1.5 Cr term cover with critical illness rider. The documentation, medical scheduling, and issuance were entirely managed by him.",
    rating: 5,
  },
];

const SUCCESS_STORIES = [
  {
    title: "Retirement Security Restructuring",
    client: "Retiring PSU Employee (Age 58)",
    challenge: "Received a lump sum retirement corpus but was unsure about regular cash flow generation and taxation.",
    solution: "Mapped a combination of LIC immediate annuity plans, debt mutual fund systematic withdrawal plans (SWP), and Senior Citizens Savings Scheme.",
    outcome: "Generated a tax-efficient monthly income of ₹75,000 while preserving 80% of the primary capital.",
  },
  {
    title: "Tax Optimization & SIP Integration",
    client: "IT Consultant Duo (Age 32 & 30)",
    challenge: "High tax slab liability with unorganized, ad-hoc investments in bank fixed deposits.",
    solution: "Shifted savings to Section 80C ELSS Mutual Funds, set up goal-based SIPs for children's education, and secured a family health floater.",
    outcome: "Reduced annual tax outflow by ₹90,000 and automated ₹40,000 monthly wealth creation.",
  },
  {
    title: "Key-Man Life Protection for SME",
    client: "Manufacturing Business Owner (Age 45)",
    challenge: "High business debt with zero personal asset protection in case of emergency.",
    solution: "Implemented a 3 Cr Key-Man Term Insurance policy alongside a personal LIC Jeevan Umang plan.",
    outcome: "Secured the business liabilities and provided lifetime risk cover with tax-free growth payouts.",
  },
];

export default function TestimonialsPage() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Page Hero Banner with Stats */}
      <section className="bg-navy pt-28 pb-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">Client Testimonials</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Explore the experiences of families and businesses we've guided over the years.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-gold">500+</div>
              <div className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase mt-1">Happy Clients</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-gold">4.9/5</div>
              <div className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase mt-1">Average Rating</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-gold">20+ Yrs</div>
              <div className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase mt-1">Trusted Advice</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Testimonials Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS_LIST.map((item, index) => {
            const isAlternate = index % 2 === 1;
            return (
              <div
                key={index}
                className={`p-8 rounded-3xl border border-gray-100 shadow-md flex flex-col justify-between transition-all hover:shadow-lg ${
                  isAlternate ? "bg-sky/5 border-sky-light/10" : "bg-white"
                }`}
              >
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex space-x-1">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  {/* Quote */}
                  <blockquote className="text-gray-600 text-sm leading-relaxed italic">
                    "{item.quote}"
                  </blockquote>
                </div>

                {/* Profile */}
                <div className="flex items-center space-x-3 pt-6 border-t border-gray-100 mt-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-mid to-navy text-white flex items-center justify-center text-xs font-bold font-serif">
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-navy">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {item.occupation} • <span className="text-sky-dark">{item.policy}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Success Stories Cases */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl font-bold text-navy">Case Studies & Success Stories</h2>
            <p className="text-gray-600 text-sm">Concrete examples of how structured planning solved real financial challenges.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-navy flex items-center">
                    <TrendingUp className="w-5 h-5 text-gold mr-2 shrink-0" />
                    {story.title}
                  </h3>
                  <div className="text-xs text-sky-dark font-semibold uppercase tracking-wider">{story.client}</div>
                  
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-gray-600">
                      <strong className="text-navy">Challenge:</strong> {story.challenge}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong className="text-navy">Solution:</strong> {story.solution}
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 mt-6 bg-gold/5 p-4 rounded-2xl">
                  <p className="text-xs text-navy font-bold flex items-center">
                    <CheckSquare className="w-4 h-4 text-success mr-2 shrink-0" />
                    Outcome: {story.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footnote Trust Indicators */}
      <section className="py-12 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-gray-500 font-medium uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gold" /> AMFI Registered</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-sky" /> LIC Licensed</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-gold" /> MDRT Member</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><CheckSquare className="w-4 h-4 text-sky" /> ISO Certified Process</span>
        </div>
      </section>
    </div>
  );
}
