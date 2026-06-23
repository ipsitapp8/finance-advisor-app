import { Trophy } from "lucide-react";

export default function MdrtBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold tracking-wide shadow-md">
      <Trophy className="w-4 h-4 text-gold" />
      <span>MDRT Achiever 2023 & 2024</span>
      <span className="text-xs">🏆</span>
    </div>
  );
}
