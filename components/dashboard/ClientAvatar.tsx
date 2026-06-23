"use client";

import { cn } from "@/lib/utils";

interface ClientAvatarProps {
  name: string;
  className?: string;
}

export default function ClientAvatar({ name, className }: ClientAvatarProps) {
  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Generate deterministic color based on name hash
  const getColorClass = (n: string) => {
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "bg-navy text-white",
      "bg-sky text-sky-dark border border-sky/20",
      "bg-gold/20 text-gold-dark border border-gold/30",
      "bg-success/10 text-success border border-success/20",
      "bg-danger/10 text-danger border border-danger/20",
      "bg-purple-100 text-purple-800 border border-purple-200",
      "bg-pink-100 text-pink-800 border border-pink-200",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none font-serif",
        getColorClass(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
