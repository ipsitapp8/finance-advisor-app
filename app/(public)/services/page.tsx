import { Metadata } from "next";
import Link from "next/link";
import { Shield, TrendingUp, Heart, Milestone, GraduationCap, Coins, Percent, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Pratik Shah - Financial Advisor",
  description: "Explore financial planning services including LIC policy consulting, goal-based mutual fund SIP setups, family health floaters, and retirement annuities.",
  openGraph: {
    title: "Services | Pratik Shah - Financial Advisor",
    description: "Explore financial planning services including LIC policy consulting, goal-based mutual fund SIP setups, family health floaters, and retirement annuities.",
    type: "website",
  },
};

const SERVICES_DETAILED = [
  {
    icon: <Shield className="w-8 h-8 text-gold" />,
    title: "LIC Advisory",
    desc: "Comprehensive guidance on Life Insurance Corporation of India (LIC) policies. We help you pick the right plans and manage claims.",
    bullets: [
      "Endowment & Money Back policy selection",
      "Term plan premium structuring",
      "Maturity & death claim liaison assistance",
      "Policy servicing (nomination, loan against policy)",
    ],
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-sky" />,
    title: "Mutual Fund Advisory",
    desc: "Goal-based investment recommendations to match your timeframe, liquidity, and risk appetite.",
    bullets: [
      "SIP (Systematic Investment Plan) setups",
      "Lump sum asset allocation recommendations",
      "Quarterly portfolio performance review",
      "Diversified equity, debt, & hybrid fund advice",
    ],
  },
  {
    icon: <Heart className="w-8 h-8 text-gold" />,
    title: "Insurance Planning",
    desc: "Protection schemes safeguarding your family from medical crises and unexpected losses.",
    bullets: [
      "High-cover term insurance comparison",
      "Family floater health cover advisory",
      "Critical illness & disability rider analysis",
      "Cashless claims documentation support",
    ],
  },
  {
    icon: <Milestone className="w-8 h-8 text-sky" />,
    title: "Retirement Planning",
    desc: "Structured investment paths providing you with a reliable, tax-efficient cash flow after your working years.",
    bullets: [
      "National Pension System (NPS) advisory",
      "Immediate & deferred annuity plans",
      "Post-Office Savings & senior citizen savings mapping",
      "Inflation-adjusted retirement expense sizing",
    ],
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-gold" />,
    title: "Child Education Planning",
    desc: "Creating separate capital blocks to fund your children's dream colleges without debt.",
    bullets: [
      "Target-date child education mutual funds",
      "LIC child future policies",
      "Higher education fee projection tools",
      "Systematic equity allocation for long timelines",
    ],
  },
  {
    icon: <Coins className="w-8 h-8 text-sky" />,
    title: "Wealth Creation",
    desc: "Building a resilient multi-asset portfolio to help you achieve financial independence.",
    bullets: [
      "Custom active asset reallocation strategy",
      "Growth vs value asset class blending",
      "Emergency reserve sizing",
      "Long-term compound interest tracking",
    ],
  },
  {
    icon: <Percent className="w-8 h-8 text-gold" />,
    title: "Tax Saving Guidance",
    desc: "Strategies to legally optimize your tax liabilities under the Income Tax Act.",
    bullets: [
      "Section 80C ELSS Mutual Funds advice",
      "LIC premiums & health insurance tax deductions",
      "New vs Old Tax Regime comparison reports",
      "Capital gains tax planning for mutual funds",
    ],
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consultation",
    desc: "We analyze your existing financial health, policies, and future ambitions.",
  },
  {
    step: "02",
    title: "Analysis",
    desc: "Identify risk gaps, excessive premium payouts, and underperforming assets.",
  },
  {
    step: "03",
    title: "Strategy",
    desc: "Prepare a custom blueprint including term covers, mutual funds, and tax planning.",
  },
  {
    step: "04",
    title: "Implementation",
    desc: "We execute the plan, automate SIP investments, and handle documentation.",
  },
];

const PARTNERS = [
  "LIC of India",
  "HDFC Life",
  "SBI Life",
  "ICICI Prudential",
  "Max Life",
  "Tata AIA",
];

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Hero Banner */}
      <section className="bg-navy py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="text-gray-400 text-sm md:text-base">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> / <span className="text-gold">Services</span>
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-3xl font-bold text-navy">Comprehensive Planning Services</h2>
          <p className="text-gray-600 text-sm">Professional financial advice tailored to your life stage and risk tolerance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DETAILED.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl hover:border-sky-light/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 bg-navy/5 text-navy rounded-2xl flex items-center justify-center">
                  {service.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-navy">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
                
                {/* Feature Bullets */}
                <ul className="space-y-2 pt-2">
                  {service.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-500">
                      <Check className="w-4 h-4 text-gold mr-2 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-gray-50">
                <Link
                  href="/contact"
                  className="w-full py-3 bg-navy hover:bg-navy-light text-white font-semibold text-sm rounded-xl flex items-center justify-center transition-colors shadow-md"
                >
                  Get Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section "How We Work" */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl font-bold text-navy">How We Work</h2>
            <p className="text-gray-600 text-sm">Our streamlined financial strategy lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-md">
                <span className="absolute top-4 right-6 font-serif text-4xl font-extrabold text-gold/10 select-none">
                  {step.step}
                </span>
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-navy pt-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Partners Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-navy">Advisory Insurance Partners</h2>
          <p className="text-gray-600 text-sm">We compare and service policies from leading providers in India.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {PARTNERS.map((partner, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl flex items-center justify-center text-center font-serif text-base font-bold text-navy hover:text-sky-dark hover:border-sky-light/20 transition-all hover:shadow-md cursor-default"
            >
              {partner}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
