import ContactForm from "@/components/public/ContactForm";
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Hero Banner */}
      <section className="bg-navy py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-gray-400 text-sm md:text-base">
            <span className="hover:text-white transition-colors">Home</span> / <span className="text-gold">Contact Us</span>
          </p>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl font-bold text-navy">Get in Touch</h2>
              <p className="text-gray-600 text-sm">
                Have a query regarding policy renewals, fresh SIP setups, or claim files? Feel free to contact us via any channel.
              </p>
            </div>

            {/* Support Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone Card */}
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3">
                <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-navy">Call Us</h4>
                <a href="tel:+919876543210" className="text-xs text-sky-dark font-semibold hover:underline block">
                  +91 98765 43210
                </a>
                <p className="text-[10px] text-gray-400">Mon-Sat, 9:00 AM - 6:00 PM</p>
              </div>

              {/* Email Card */}
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3">
                <div className="w-10 h-10 bg-sky/10 text-sky-dark rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-navy">Email Us</h4>
                <a href="mailto:info@pratikfinance.com" className="text-xs text-sky-dark font-semibold hover:underline block">
                  info@pratikfinance.com
                </a>
                <p className="text-[10px] text-gray-400">Response within 24 hours</p>
              </div>
            </div>

            {/* WhatsApp Big Button */}
            <div className="bg-success/5 border border-success/15 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 text-success fill-success/10" />
                <div>
                  <h4 className="font-serif text-base font-bold text-navy">Instant WhatsApp Chat</h4>
                  <p className="text-xs text-gray-500">Fastest way to get in touch for quick queries.</p>
                </div>
              </div>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-success hover:bg-success-dark text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-colors shadow-md shadow-success/10"
              >
                Send WhatsApp Message
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* Address & Hours */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-navy">Office Address</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Office 104, Capital Business Park, Sector 15, Gurgaon, HR - 122001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 pt-2 border-t border-gray-50">
                <Clock className="w-6 h-6 text-sky shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-navy">Business Hours</h4>
                  <p className="text-xs text-gray-500">
                    Monday – Saturday: 9:00 AM – 6:00 PM <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-100 h-48 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200">
              <div className="text-center z-10 space-y-2">
                <MapPin className="w-8 h-8 text-gold mx-auto animate-bounce" />
                <h5 className="font-bold text-xs text-navy">Pratik Finance Office</h5>
                <p className="text-[10px] text-gray-500">Gurgaon Sector 15, Haryana</p>
              </div>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
