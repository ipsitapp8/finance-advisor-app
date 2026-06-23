import Link from "next/link";
import { Phone, Mail, MapPin, MessageSquare, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Pratik Finance<span className="text-gold">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-300">
              Securing your family's future through customized life insurance protection, tax-saving solutions, and growth-oriented mutual fund portfolios.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-success hover:text-white transition-colors duration-300 text-gray-300"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-sky-dark hover:text-white transition-colors duration-300 text-gray-300"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="tel:+919876543210"
                className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-gold hover:text-navy transition-colors duration-300 text-gray-300"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors duration-200 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors duration-200 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> About Me
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors duration-200 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Services
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-gold transition-colors duration-200 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Achievements
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-gold transition-colors duration-200 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors duration-200 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="hover:text-gold transition-colors duration-200">
                  LIC Advisory & Life Cover
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors duration-200">
                  Mutual Fund Investment Planning
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors duration-200">
                  Tax-Saving (80C / ELSS) Guidance
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors duration-200">
                  Comprehensive Health Protection
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors duration-200">
                  Retirement Planning & Pensions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">Get in Touch</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-gold shrink-0 mt-0.5" />
                <span>Office 104, Capital Business Park, Sector 15, Gurgaon, HR - 122001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gold shrink-0" />
                <a href="tel:+919876543210" className="hover:text-gold transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gold shrink-0" />
                <a href="mailto:info@pratikfinance.com" className="hover:text-gold transition-colors">
                  info@pratikfinance.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs space-y-2">
          <p className="text-gray-300">
            © 2026 Pratik Shah | AMFI Registered Mutual Fund Distributor | LIC Agent
          </p>
          <p className="text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Disclaimer: Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Insurance is the subject matter of solicitation.
          </p>
        </div>
      </div>
    </footer>
  );
}
