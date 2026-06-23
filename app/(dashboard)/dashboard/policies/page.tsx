"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, FileSpreadsheet, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PolicyData {
  id: string;
  policyNumber: string;
  policyType: string;
  policyName: string;
  premiumAmount: number;
  premiumFreq: string;
  dueDate: string;
  maturityDate: string | null;
  status: string;
  sumAssured: number | null;
  client: {
    name: string;
  };
}

export default function PoliciesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [dueThisMonth, setDueThisMonth] = useState(false);

  // Fetch policies query
  const { data: policies, isLoading, error } = useQuery<PolicyData[]>({
    queryKey: ["policies", search, type, status, dueThisMonth],
    queryFn: async () => {
      const response = await fetch(
        `/api/policies?search=${encodeURIComponent(search)}&type=${type}&status=${status}&dueThisMonth=${dueThisMonth}`
      );
      if (!response.ok) {
        throw new Error("Failed to load policies");
      }
      return response.json();
    },
  });

  // Delete policy mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/policies/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleDelete = (id: string, policyNumber: string) => {
    if (confirm(`Are you sure you want to delete policy ${policyNumber}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadgeClass = (s: string) => {
    switch (s) {
      case "ACTIVE":
        return "bg-success/10 text-success border border-success/20";
      case "LAPSED":
        return "bg-danger/10 text-danger border border-danger/20";
      case "MATURED":
        return "bg-gold/10 text-gold-dark border border-gold/20";
      case "PENDING":
        return "bg-sky/10 text-sky-dark border border-sky/20";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeBadgeClass = (t: string) => {
    switch (t) {
      case "LIC":
        return "bg-danger/10 text-danger border border-danger/20";
      case "MUTUAL_FUND":
        return "bg-sky/10 text-sky-dark border border-sky/20";
      case "HEALTH_INSURANCE":
        return "bg-success/10 text-success border border-success/20";
      case "TERM_INSURANCE":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
            Policies
          </h1>
          <p className="text-gray-500 text-xs md:text-sm">
            Monitor asset allocations and premium collection statuses.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/policies/new"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light transition-all shadow-md"
          >
            <Plus className="w-4.5 h-4.5 mr-2" />
            Add Policy
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-xs bg-gray-50 rounded-xl border border-gray-100">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by policy number or client name..."
            className="w-full pl-9 pr-4 py-2.5 bg-transparent rounded-xl focus:outline-none text-xs text-gray-800"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto text-xs">
          {/* Policy Type Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Type:</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-navy font-semibold focus:outline-none bg-white cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="LIC">LIC</option>
              <option value="MUTUAL_FUND">Mutual Fund</option>
              <option value="HEALTH_INSURANCE">Health Insurance</option>
              <option value="TERM_INSURANCE">Term Insurance</option>
              <option value="ULIP">ULIP</option>
              <option value="PENSION">Pension / Retirement</option>
              <option value="CHILD_PLAN">Child Plan</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-navy font-semibold focus:outline-none bg-white cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="LAPSED">Lapsed</option>
              <option value="MATURED">Matured</option>
              <option value="SURRENDERED">Surrendered</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Due This Month Checkbox */}
          <label className="flex items-center space-x-2 font-semibold text-navy cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dueThisMonth}
              onChange={(e) => setDueThisMonth(e.target.checked)}
              className="rounded text-sky focus:ring-sky border-gray-300 w-4 h-4 cursor-pointer"
            />
            <span>Due This Month</span>
          </label>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Loading policies...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            Failed to load policies. Verify database connection.
          </div>
        ) : !policies || policies.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <FileSpreadsheet className="w-12 h-12 mx-auto stroke-1" />
            <p className="text-sm font-medium">No policies found matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Policy Number</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Premium Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Maturity Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-navy">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold">{p.policyNumber}</td>
                    <td className="px-6 py-4">{p.client.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getTypeBadgeClass(p.policyType)}`}>
                        {p.policyType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      {formatCurrency(p.premiumAmount)}
                      <span className="text-[10px] text-gray-400 font-normal"> / {p.premiumFreq.toLowerCase()}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(p.dueDate)}</td>
                    <td className="px-6 py-4 text-gray-500">{p.maturityDate ? formatDate(p.maturityDate) : "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id, p.policyNumber)}
                        className="p-2 border border-gray-100 hover:border-danger/30 text-danger hover:bg-danger/5 rounded-xl transition-colors"
                        title="Delete Policy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
