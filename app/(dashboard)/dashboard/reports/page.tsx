"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, TrendingUp, Download, Calendar, BarChart2, PieChart, Coins } from "lucide-react";
import ReportChart from "@/components/dashboard/ReportChart";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PremiumSummaryItem {
  id: string;
  clientName: string;
  clientPhone: string;
  policyNumber: string;
  policyName: string;
  premiumAmount: number;
  premiumFreq: string;
  dueDate: string;
  status: string;
}

interface UpcomingRenewalItem {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  policyNumber: string;
  policyName: string;
  premiumAmount: number;
  premiumFreq: string;
  dueDate: string;
}

interface PortfolioStats {
  policyTypeStats: Array<{ type: string; count: number; totalPremium: number; totalSumAssured: number }>;
  statusStats: Array<{ status: string; count: number }>;
  freqStats: Array<{ frequency: string; count: number }>;
}

export default function ReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState<"premium-summary" | "active-clients" | "upcoming-renewals" | "revenue-overview">("premium-summary");

  // Premium Summary state
  const [premiumMonth, setPremiumMonth] = useState((new Date().getMonth() + 1).toString());
  const [premiumYear, setPremiumYear] = useState(new Date().getFullYear().toString());

  // Upcoming Renewals state
  const todayStr = new Date().toISOString().split("T")[0];
  const next30DaysStr = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(next30DaysStr);

  // Revenue Overview state
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear().toString());

  // 1. Fetch Premium Summary Query
  const { data: premiumSummary, isLoading: isSummaryLoading } = useQuery<PremiumSummaryItem[]>({
    queryKey: ["report-premium-summary", premiumMonth, premiumYear],
    queryFn: async () => {
      const res = await fetch(`/api/reports/premium-summary?month=${premiumMonth}&year=${premiumYear}`);
      if (!res.ok) throw new Error("Failed to load premium summary");
      return res.json();
    },
    enabled: activeReportTab === "premium-summary",
  });

  // 2. Fetch Portfolio Distribution Stats
  const { data: portfolioStats, isLoading: isPortfolioLoading } = useQuery<PortfolioStats>({
    queryKey: ["report-portfolio-distribution"],
    queryFn: async () => {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to load portfolio stats");
      return res.json();
    },
    enabled: activeReportTab === "active-clients",
  });

  // 3. Fetch Upcoming Renewals Query
  const { data: renewals, isLoading: isRenewalsLoading } = useQuery<UpcomingRenewalItem[]>({
    queryKey: ["report-upcoming-renewals", startDate, endDate],
    queryFn: async () => {
      const res = await fetch(`/api/reports/upcoming-renewals?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error("Failed to load renewals");
      return res.json();
    },
    enabled: activeReportTab === "upcoming-renewals",
  });

  // 4. Monthly Revenue calculations (Line Chart mock values matching chosen year)
  const getRevenueData = () => {
    const isCurrent = revenueYear === new Date().getFullYear().toString();
    return [
      { name: "Jan", value: isCurrent ? 45000 : 38000 },
      { name: "Feb", value: isCurrent ? 62000 : 54000 },
      { name: "Mar", value: isCurrent ? 38000 : 42000 },
      { name: "Apr", value: isCurrent ? 85000 : 70000 },
      { name: "May", value: isCurrent ? 72000 : 65000 },
      { name: "Jun", value: isCurrent ? 54000 : 59000 },
      { name: "Jul", value: isCurrent ? 49000 : 41000 },
      { name: "Aug", value: isCurrent ? 61000 : 50000 },
      { name: "Sep", value: isCurrent ? 68000 : 62000 },
      { name: "Oct", value: isCurrent ? 74000 : 69000 },
      { name: "Nov", value: isCurrent ? 89000 : 78000 },
      { name: "Dec", value: isCurrent ? 95000 : 85000 },
    ];
  };

  // CSV Exporter helper
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const premiumTotal = premiumSummary?.reduce((sum, item) => sum + item.premiumAmount, 0) || 0;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
          Reports & Advisory Portfolios
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Run comprehensive audits and visual analytics on collections, client counts, and revenue trends.
        </p>
      </div>

      {/* Reports Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setActiveReportTab("premium-summary")}
          className={`py-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeReportTab === "premium-summary" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Coins className="w-4 h-4" />
          Premium Collection
        </button>
        <button
          onClick={() => setActiveReportTab("active-clients")}
          className={`py-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeReportTab === "active-clients" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Active Clients
        </button>
        <button
          onClick={() => setActiveReportTab("upcoming-renewals")}
          className={`py-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeReportTab === "upcoming-renewals" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Upcoming Renewals
        </button>
        <button
          onClick={() => setActiveReportTab("revenue-overview")}
          className={`py-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeReportTab === "revenue-overview" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Revenue Overview
        </button>
      </div>

      {/* Render selected report card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* REPORT 1: Premium Collection Summary */}
        {activeReportTab === "premium-summary" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-navy">Premium Collection Summary</h2>
                <p className="text-gray-500 text-xs mt-0.5">Filter payments due by calendar month</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Month Picker */}
                <select
                  value={premiumMonth}
                  onChange={(e) => setPremiumMonth(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-navy bg-white cursor-pointer"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleDateString("en", { month: "long" })}
                    </option>
                  ))}
                </select>

                {/* Year Picker */}
                <select
                  value={premiumYear}
                  onChange={(e) => setPremiumYear(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-navy bg-white cursor-pointer"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>

                <button
                  onClick={() => exportToCSV(premiumSummary || [], `Premium_Collection_${premiumMonth}_${premiumYear}`)}
                  disabled={!premiumSummary || premiumSummary.length === 0}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-navy text-xs font-bold shadow-sm disabled:opacity-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {isSummaryLoading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-xs">Generating report data...</p>
              </div>
            ) : !premiumSummary || premiumSummary.length === 0 ? (
              <p className="text-gray-400 text-xs py-8 text-center">No premium records due in this period.</p>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto text-xs font-semibold">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Policy Number</th>
                        <th className="px-4 py-3">Plan Name</th>
                        <th className="px-4 py-3 text-right">Premium Amount</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-navy">
                      {premiumSummary.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/30">
                          <td className="px-4 py-3 font-bold">{item.clientName}</td>
                          <td className="px-4 py-3">{item.policyNumber}</td>
                          <td className="px-4 py-3 text-gray-600">{item.policyName}</td>
                          <td className="px-4 py-3 text-right font-bold">{formatCurrency(item.premiumAmount)}</td>
                          <td className="px-4 py-3 text-gray-500">{formatDate(item.dueDate)}</td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                item.status === "ACTIVE"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold text-navy text-sm">
                  <span>Total Advisory Collections</span>
                  <span>{formatCurrency(premiumTotal)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REPORT 2: Active Clients Report */}
        {activeReportTab === "active-clients" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-navy">Active Clients Report</h2>
                <p className="text-gray-500 text-xs mt-0.5">Asset class mapping and total client breakdown</p>
              </div>
              <button
                onClick={() =>
                  exportToCSV(
                    portfolioStats?.policyTypeStats.map((p) => ({ Category: p.type, "Active Policies": p.count })) || [],
                    "Active_Clients_Distribution"
                  )
                }
                disabled={!portfolioStats}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-navy text-xs font-bold shadow-sm disabled:opacity-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Distribution
              </button>
            </div>

            {isPortfolioLoading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-xs">Generating report data...</p>
              </div>
            ) : !portfolioStats ? (
              <p className="text-gray-400 text-xs py-8 text-center">No portfolio data found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <ReportChart
                    type="bar"
                    data={portfolioStats.policyTypeStats.map((item) => ({
                      name: item.type,
                      value: item.count,
                    }))}
                    title="Active Asset Allocation Counts"
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100/50 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-navy uppercase tracking-wider text-gray-400">
                    Policy Category Distribution
                  </h3>
                  
                  <div className="divide-y divide-gray-200/50 text-xs font-semibold text-navy">
                    {portfolioStats.policyTypeStats.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <span className="capitalize">{(item.type || "").replace(/_/g, " ").toLowerCase()}</span>
                        <span className="px-2.5 py-0.5 bg-sky/15 text-sky-dark rounded-full font-bold">
                          {item.count} plan{item.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REPORT 3: Upcoming Renewals */}
        {activeReportTab === "upcoming-renewals" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-navy">Upcoming Renewals</h2>
                <p className="text-gray-500 text-xs mt-0.5">Track policies due to renew inside custom bounds</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Start Date */}
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-navy bg-white focus:outline-none"
                />
                
                <span className="text-gray-400 text-xs font-bold">to</span>

                {/* End Date */}
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-navy bg-white focus:outline-none"
                />

                <button
                  onClick={() => exportToCSV(renewals || [], `Upcoming_Renewals_${startDate}_to_${endDate}`)}
                  disabled={!renewals || renewals.length === 0}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-navy text-xs font-bold shadow-sm disabled:opacity-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export Renewals
                </button>
              </div>
            </div>

            {isRenewalsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-xs">Generating report data...</p>
              </div>
            ) : !renewals || renewals.length === 0 ? (
              <p className="text-gray-400 text-xs py-8 text-center">No active policies renewing in selected range.</p>
            ) : (
              <div className="overflow-x-auto text-xs font-semibold">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="px-4 py-3">Client Name</th>
                      <th className="px-4 py-3">Contact Info</th>
                      <th className="px-4 py-3">Policy Number</th>
                      <th className="px-4 py-3">Plan Name</th>
                      <th className="px-4 py-3 text-right">Premium Due</th>
                      <th className="px-4 py-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-navy">
                    {renewals.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/30">
                        <td className="px-4 py-3 font-bold">{item.clientName}</td>
                        <td className="px-4 py-3 space-y-0.5">
                          <div>{item.clientPhone}</div>
                          {item.clientEmail && <div className="text-[10px] text-gray-400">{item.clientEmail}</div>}
                        </td>
                        <td className="px-4 py-3">{item.policyNumber}</td>
                        <td className="px-4 py-3 text-gray-600">{item.policyName}</td>
                        <td className="px-4 py-3 text-right font-bold">{formatCurrency(item.premiumAmount)}</td>
                        <td className="px-4 py-3 text-gray-500 font-medium">{formatDate(item.dueDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REPORT 4: Monthly Revenue Overview */}
        {activeReportTab === "revenue-overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-navy">Monthly Revenue Overview</h2>
                <p className="text-gray-500 text-xs mt-0.5">Annual premium volume collection charts</p>
              </div>

              {/* Year Selector */}
              <select
                value={revenueYear}
                onChange={(e) => setRevenueYear(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-navy bg-white cursor-pointer focus:outline-none"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            <div>
              <ReportChart
                type="line"
                data={getRevenueData()}
                title={`Monthly Advisory Premium Collection (₹) - Year ${revenueYear}`}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
