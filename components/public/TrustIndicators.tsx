import { ShieldCheck, Award, Users, CheckCircle } from "lucide-react";

export default function TrustIndicators() {
  const indicators = [
    { icon: <Award className="w-4 h-4 text-gold" />, text: "MDRT Member" },
    { icon: <ShieldCheck className="w-4 h-4 text-sky" />, text: "AMFI Registered MFD" },
    { icon: <CheckCircle className="w-4 h-4 text-gold" />, text: "LIC Licensed Agent" },
    { icon: <Users className="w-4 h-4 text-sky" />, text: "500+ Happy Families" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/10">
      {indicators.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm text-gray-300 font-medium">
          {item.icon}
          <span>{item.text}</span>
          {index < indicators.length - 1 && (
            <span className="hidden sm:inline text-white/20 font-light select-none">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
