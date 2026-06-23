import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendType = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Value and Title */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {title}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-navy tracking-tight">
            {value}
          </h3>
        </div>

        {/* Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50 text-xs">
        {/* Short description label */}
        <span className="text-gray-400 font-medium">{description}</span>

        {/* Trend marker */}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold",
              trendType === "up" && "bg-success/10 text-success",
              trendType === "down" && "bg-danger/10 text-danger",
              trendType === "neutral" && "bg-gray-100 text-gray-500"
            )}
          >
            {trendType === "up" && <ArrowUpRight className="w-3 h-3" />}
            {trendType === "down" && <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
