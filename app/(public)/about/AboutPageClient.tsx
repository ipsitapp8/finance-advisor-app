"use client";

import { Award, ShieldCheck, Milestone, Calendar, Briefcase, GraduationCap } from "lucide-react";

const CERTIFICATIONS = [
  {
    title: "AMFI Registered MFD",
    issuer: "Association of Mutual Funds in India",
    id: "ARN-182930",
    desc: "Licensed to distribute and advise on mutual fund products across India.",
  },
  {
    title: "LIC Licensed Agent",
    issuer: "Life Insurance Corporation of India",
    id: "LIC-092847",
    desc: "Authorized life insurance advisor specializing in endowment, term, and pension planning.",
  },
  {
    title: "MDRT Member 2023",
    issuer: "Million Dollar Round Table",
    id: "Global Elite Certificate",
    desc: "Awarded for outstanding professional knowledge, client service, and sales ethics.",
  },
  {
    title: "MDRT Member 2024",
    issuer: "Million Dollar Round Table",
    id: "Global Elite Certificate",
    desc: "Consecutive qualification in the premier global association of financial professionals.",
  },
];

const TIMELINE = [
  {
    year: "2005",
    title: "Career Inception",
    desc: "Certified as an LIC Life Insurance advisor. Began guiding families in local circles on savings and asset safety.",
  },
  {
    year: "2010",
    title: "AMFI Mutual Fund Certification",
    desc: "Registered with AMFI as a Mutual Fund Distributor, expanding services to wealth creation and SIP planning.",
  },
  {
    year: "2015",
    title: "500+ Active Clients Milestone",
    desc: "Established a dedicated customer base, protecting over 500 families with life and health cover.",
  },
  {
    year: "2023",
    title: "First MDRT Global Qualification",
    desc: "Qualified for the prestigious Million Dollar Round Table, placing in the top 6% of financial professionals globally.",
  },
  {
    year: "2024",
    title: "Second Consecutive MDRT Award",
    desc: "Retained the MDRT milestone, demonstrating outstanding advisor standards and client retention.",
  },
];

const SKILLS = [
  "LIC Policy Advisory",
  "Mutual Fund SIPs",
  "Tax Saving (Section 80C)",
  "Estate Planning & Wills",
  "Risk Analysis",
  "Retirement Annuities",
  "Child Future Education Funds",
  "Claims Settlement Liaison",
];

export default function AboutPageClient() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Hero Banner */}
      <section className="bg-navy py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">About Me</h1>
          <p className="text-gray-400 text-sm md:text-base">
            <span className="hover:text-white transition-colors">Home</span> / <span className="text-gold">About Me</span>
          </p>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Avatar Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-80 h-96 bg-gradient-to-br from-navy-mid to-navy rounded-3xl p-8 text-center border border-white/10 shadow-2xl flex flex-col justify-center items-center space-y-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-sky-light to-gold-light text-navy flex items-center justify-center font-bold text-3xl shadow-xl">
                PS
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Pratik Shah</h3>
                <p className="text-sm text-sky-light font-medium uppercase tracking-wider mt-1">Senior Financial Advisor</p>
              </div>
              <p className="text-xs text-gray-400 italic">"Securing lives and growing wealth with integrity since 2005."</p>
            </div>
          </div>

          {/* Bio Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-navy">
              Decades of Dedicated Financial Planning
            </h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed font-light">
              <p>
                My journey in financial services began in 2005 with a clear purpose: to demystify money management and insurance protection for families and small business owners in India. Over the last two decades, I have worked as a certified Life Insurance Corporation (LIC) agent and AMFI-registered Mutual Fund Distributor, helping clients align their money with their goals.
              </p>
              <p>
                I believe that financial planning is not just about choosing products; it is about building a secure foundation. Whether it is ensuring a child's higher education through target-date funds, mapping out a stress-free retirement income, or protecting your home with term and health insurance, I approach every portfolio with transparency and detailed risk analysis.
              </p>
              <p>
                As a member of the Million Dollar Round Table (MDRT) for consecutive years, I remain committed to the highest global standards of professionalism, ethical conduct, and customer-first service.
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="#timeline"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-navy text-white hover:bg-navy-light text-sm font-semibold transition-all shadow-md"
              >
                View Career Milestones
              </a>
              <button
                onClick={() => alert("Credentials verification certificate pack placeholder.")}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all"
              >
                Download Credentials PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="timeline" className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl font-bold text-navy">My Career Timeline</h2>
            <p className="text-gray-600 text-sm">Key milestones of service, growth, and industry recognition.</p>
          </div>

          <div className="relative border-l-2 border-gold/40 pl-6 ml-4 sm:ml-8 space-y-12">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Gold Circle Dot */}
                <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-gold border-4 border-white shadow-md flex items-center justify-center z-10" />
                
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs font-bold text-gold-dark">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-navy">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-3xl font-bold text-navy">Professional Certifications</h2>
          <p className="text-gray-600 text-sm">Fully licensed, compliant, and recognized by national and global bodies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CERTIFICATIONS.map((cert, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-sky/10 text-sky-dark text-white rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-sky-dark" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-navy">{cert.title}</h3>
                  <p className="text-xs text-sky-dark font-medium">{cert.issuer}</p>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{cert.desc}</p>
              </div>
              <div className="pt-4 border-t border-gray-100 mt-4">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  Reg ID: {cert.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills/Expertise Section */}
      <section className="py-20 bg-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl font-bold">Advisory Expertise & Skills</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Our core competencies cover a range of financial asset classes and planning protocols.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {SKILLS.map((skill, index) => (
              <div
                key={index}
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 text-sm font-medium hover:text-gold transition-all duration-300"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
