import React from "react";
import { Shield, TrendingUp, Heart, Milestone, GraduationCap, Coins, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PolicyCardProps {
  id: string;
  policyNumber: string;
  policyType: string;
  policyName: string;
  premiumAmount: number;
  premiumFreq: string;
  dueDate: string;
  status: string;
  sumAssured?: number | null;
  clientName: string;
  onDelete?: (id: string, num: string) => void;
}

export default function PolicyCard({
  id,
  policyNumber,
  policyType,
  policyName,
  premiumAmount,
  premiumFreq,
  dueDate,
  status,
  sumAssured,
  clientName,
  onDelete,
}: PolicyCardProps) {
  const getIcon = () => {
    switch (policyType) {
      case "LIC":
        return <Shield className="w-5 h-5 text-gold" />;
      case "MUTUAL_FUND":
        return <TrendingUp className="w-5 h-5 text-sky" />;
      case "HEALTH_INSURANCE":
        return <Heart className="w-5 h-5 text-gold" />;
      case "TERM_INSURANCE":
        return <Shield className="w-5 h-5 text-sky" />;
      case "ULIP":
        return <TrendingUp className="w-5 h-5 text-gold" />;
      case "PENSION":
        return <Milestone className="w-5 h-5 text-sky" />;
      case "CHILD_PLAN":
        return <GraduationCap className="w-5 h-5 text-gold" />;
      default:
        return <Coins className="w-5 h-5 text-sky" />;
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-navy truncate max-w-[150px]" title={policyName}>
              {policyName}
            </h4>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
              {policyNumber}
            </p>
          </div>
        </div>

        {/* Status Tag */}
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-bold",
            status === "ACTIVE" && "bg-success/10 text-success",
            status === "LAPSED" && "bg-danger/10 text-danger",
            status === "MATURED" && "bg-sky/10 text-sky-dark",
            status === "PENDING" && "bg-warning/10 text-warning"
          )}
        >
          {status}
        </span>
      </div>

      {/* Body details */}
      <div className="grid grid-cols-2 gap-4 text-xs pt-2">
        <div>
          <p className="text-gray-400 font-semibold">Client Name</p>
          <p className="font-bold text-navy mt-0.5 truncate">{clientName}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Premium Amount</p>
          <p className="font-bold text-navy mt-0.5">
            {formatCurrency(premiumAmount)}
            <span className="text-[9px] text-gray-400 font-normal"> / {premiumFreq.toLowerCase()}</span>
          </p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Cover Protected</p>
          <p className="font-bold text-navy mt-0.5">
            {sumAssured ? formatCurrency(sumAssured) : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Premium Due Date</p>
          <p className="font-bold text-navy mt-0.5">{formatDate(dueDate)}</p>
        </div>
      </div>

      {/* Footer remove action */}
      {onDelete && (
        <div className="pt-4 border-t border-gray-50 flex justify-end">
          <button
            onClick={() => onDelete(id, policyNumber)}
            className="p-1.5 border border-gray-100 hover:border-danger/20 text-gray-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"
            title="Delete Policy"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
