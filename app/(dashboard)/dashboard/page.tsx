"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, FileSpreadsheet, Coins, AlertTriangle, ArrowRight, Bell, Calendar, Plus, MessageSquare } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import ReportChart from "@/components/dashboard/ReportChart";
import ClientAvatar from "@/components/dashboard/ClientAvatar";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardStats {
  totalClients: number;
  activePolicies: number;
  premiumsDueThisMonth: number;
  overduePremiums: number;
  recentClients: Array<{
    id: string;
    name: string;
    phone: string;
    createdAt: string;
  }>;
  upcomingReminders: Array<{
    id: string;
    type: string;
    title: string;
    dueDate: string;
    client: {
      name: string;
    };
  }>;
  birthdaysThisMonth: Array<{
    id: string;
    name: string;
    phone: string;
    dateOfBirth: string;
  }>;
  policyTypeStats: Array<{
    name: string;
    value: number;
  }>;
  monthlyPremiumCollection: Array<{
    name: string;
    value: number;
  }>;
}

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to load dashboard metrics");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        {/* KPI Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white border border-gray-100 rounded-2xl" />
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-80 bg-white border border-gray-100 rounded-2xl" />
          <div className="lg:col-span-5 h-80 bg-white border border-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto">
          <Bell className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-navy">Error Loading Metrics</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          We could not fetch data from the database. Please verify your connection or seed status.
        </p>
      </div>
    );
  }

  // Get current date string for WhatsApp message
  const getWhatsAppLink = (phone: string, name: string) => {
    const formattedPhone = phone.replace(/[^0-9]/g, "");
    const cleanPhone = formattedPhone.startsWith("91") ? formattedPhone : `91${formattedPhone}`;
    const text = encodeURIComponent(
      `Dear ${name},\nWishing you a very Happy Birthday! 🎂 May this year bring you good health, happiness, and prosperity.\n\nWarm regards,\nPratik Shah`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
            Advisory Dashboard
          </h1>
          <p className="text-gray-500 text-xs md:text-sm">
            Overview of your active clients, policies under advisory, and upcoming premium collections.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Client
          </Link>
          <Link
            href="/dashboard/policies/new"
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-navy text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Policy
          </Link>
        </div>
      </div>

      {/* 1. Top Stats Row (4 StatCards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          description="Registered portfolios"
          icon={<Users className="w-5 h-5 text-sky-dark" />}
          trend="+5%"
          trendType="up"
        />
        <StatCard
          title="Active Policies"
          value={stats.activePolicies}
          description="In-force plans"
          icon={<FileSpreadsheet className="w-5 h-5 text-gold-dark" />}
          trend="+2%"
          trendType="up"
        />
        <StatCard
          title="Premiums Due This Month"
          value={formatCurrency(stats.premiumsDueThisMonth)}
          description="Current monthly pipeline"
          icon={<Coins className="w-5 h-5 text-success" />}
          trend="Expected"
          trendType="neutral"
        />
        <StatCard
          title="Overdue Premiums"
          value={formatCurrency(stats.overduePremiums)}
          description="Unpaid past due premiums"
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          trend="-1.2%"
          trendType="down"
        />
      </div>

      {/* 2. Second Row Charts (Line chart 60%, Donut chart 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ReportChart
            type="line"
            data={stats.monthlyPremiumCollection}
            title="Monthly Premium Collection (Annualized Trend)"
          />
        </div>
        <div className="lg:col-span-5">
          <ReportChart
            type="pie"
            data={stats.policyTypeStats}
            title="Policy Type Distribution"
          />
        </div>
      </div>

      {/* 3. Third Row (Upcoming Reminders 50%, Recent Clients 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Upcoming Reminders */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-navy">Upcoming Reminders</h3>
              <Link
                href="/dashboard/reminders"
                className="inline-flex items-center text-xs font-bold text-sky-dark hover:underline"
              >
                View All
                <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.upcomingReminders.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">No upcoming reminders.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {stats.upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-navy truncate">{reminder.client.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky/10 text-sky-dark border border-sky/10">
                          {reminder.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-gray-500 truncate">{reminder.title}</p>
                    </div>
                    <span className="text-gray-400 font-semibold shrink-0 text-[10px]">
                      {formatDate(reminder.dueDate)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Clients Added */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-navy">Recent Clients Added</h3>
              <Link
                href="/dashboard/clients"
                className="inline-flex items-center text-xs font-bold text-sky-dark hover:underline"
              >
                View All
                <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.recentClients.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">No clients registered.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {stats.recentClients.map((client) => (
                  <div key={client.id} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ClientAvatar name={client.name} />
                      <div className="min-w-0">
                        <h4 className="font-bold text-navy truncate">{client.name}</h4>
                        <p className="text-gray-400 text-[10px]">{client.phone}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 font-semibold shrink-0 text-[10px]">
                      Added: {formatDate(client.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Birthday Reminders Widget */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
          🎂 Birthdays This Month
        </h3>
        
        {stats.birthdaysThisMonth.length === 0 ? (
          <p className="text-gray-400 text-xs">No client birthdays recorded in the current calendar month.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stats.birthdaysThisMonth.map((client) => (
              <div
                key={client.id}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between gap-3 border border-gray-100/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ClientAvatar name={client.name} className="w-10 h-10 text-sm" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-navy truncate">{client.name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {new Date(client.dateOfBirth).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>

                <a
                  href={getWhatsAppLink(client.phone, client.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-success/15 hover:bg-success/20 text-success border border-success/20 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  Wishes
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
