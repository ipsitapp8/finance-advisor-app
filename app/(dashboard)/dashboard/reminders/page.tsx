"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bell, Clock, Check, AlertTriangle, Gift, FileText, Loader2, Calendar, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ReminderData {
  id: string;
  type: string;
  title: string;
  description: string | null;
  dueDate: string;
  isRead: boolean;
  createdAt: string;
  client: {
    name: string;
    phone: string;
  };
}

export default function RemindersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"upcoming" | "overdue" | "all">("upcoming");

  // Auto-generate reminders on page load
  useEffect(() => {
    const triggerGenerate = async () => {
      try {
        await fetch("/api/reminders/generate", { method: "POST" });
        queryClient.invalidateQueries({ queryKey: ["reminders"] });
      } catch (err) {
        console.error("Failed to trigger reminder auto-generation:", err);
      }
    };
    triggerGenerate();
  }, [queryClient]);

  // Fetch reminders query
  const { data: reminders, isLoading, error } = useQuery<ReminderData[]>({
    queryKey: ["reminders"],
    queryFn: async () => {
      const response = await fetch("/api/reminders");
      if (!response.ok) throw new Error("Failed to load reminders");
      return response.json();
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const response = await fetch("/api/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead }),
      });
      if (!response.ok) throw new Error("Failed to update reminder");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PREMIUM_DUE":
        return <Clock className="w-5 h-5 text-warning" />;
      case "PREMIUM_OVERDUE":
        return <AlertTriangle className="w-5 h-5 text-danger" />;
      case "BIRTHDAY":
        return <Gift className="w-5 h-5 text-sky" />;
      case "POLICY_RENEWAL":
      case "POLICY_MATURITY":
        return <FileText className="w-5 h-5 text-gold" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "PREMIUM_DUE":
        return "bg-warning/10 text-warning border-warning/20";
      case "PREMIUM_OVERDUE":
        return "bg-danger/10 text-danger border-danger/20";
      case "BIRTHDAY":
        return "bg-sky/10 text-sky-dark border-sky/20";
      case "POLICY_RENEWAL":
      case "POLICY_MATURITY":
        return "bg-gold/10 text-gold-dark border-gold/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  // Filter logic based on tabs
  const getFilteredReminders = () => {
    if (!reminders) return [];
    
    // Sort all by dueDate ascending
    const sorted = [...reminders].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    if (activeTab === "upcoming") {
      // Unread reminders with due date today or in future
      return sorted.filter((r) => !r.isRead && !isPastDue(r.dueDate));
    }
    if (activeTab === "overdue") {
      // Unread reminders with due date in the past
      return sorted.filter((r) => !r.isRead && isPastDue(r.dueDate));
    }
    return sorted; // all reminders
  };

  const filteredReminders = getFilteredReminders();

  const getWhatsAppLink = (reminder: ReminderData) => {
    const formattedPhone = reminder.client.phone.replace(/[^0-9]/g, "");
    const cleanPhone = formattedPhone.startsWith("91") ? formattedPhone : `91${formattedPhone}`;
    let message = "";

    if (reminder.type === "BIRTHDAY") {
      message = `Dear ${reminder.client.name},\nWishing you a very Happy Birthday! 🎂 May this year bring you good health, happiness, and prosperity.\n\nWarm regards,\nPratik Shah`;
    } else if (reminder.type === "PREMIUM_DUE" || reminder.type === "PREMIUM_OVERDUE") {
      message = `Dear ${reminder.client.name},\nThis is a friendly reminder that the premium for your insurance policy is due/overdue. Kindly make the payment of premium online or contact me for assistance.\n\nRegards,\nPratik Shah`;
    } else {
      message = `Dear ${reminder.client.name},\nReminder regarding: ${reminder.title}. Please let me know if we can discuss this soon.\n\nRegards,\nPratik Shah`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
          Reminders
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Track premium renewals, policy maturity timelines, birthdays, and advisory follow-ups.
        </p>
      </div>

      {/* Tabs selector */}
      <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm gap-1 max-w-md">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all",
            activeTab === "upcoming" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          )}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("overdue")}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all",
            activeTab === "overdue" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          )}
        >
          Overdue
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all",
            activeTab === "all" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          )}
        >
          All Reminders
        </button>
      </div>

      {/* Reminders List rendering */}
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center space-y-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading reminders...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center text-gray-400 text-sm">
          Failed to load reminders.
        </div>
      ) : filteredReminders.length === 0 ? (
        <div className="p-12 text-center text-gray-400 space-y-3">
          <Bell className="w-12 h-12 mx-auto stroke-1" />
          <p className="text-sm font-medium">No reminders in this view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReminders.map((reminder) => {
            const overdue = isPastDue(reminder.dueDate) && !reminder.isRead;
            return (
              <div
                key={reminder.id}
                className={cn(
                  "bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-l-4",
                  reminder.isRead
                    ? "border-l-gray-300 opacity-60"
                    : overdue
                    ? "border-l-danger bg-danger/[0.01]"
                    : reminder.type === "BIRTHDAY"
                    ? "border-l-sky"
                    : "border-l-warning"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="shrink-0">{getTypeIcon(reminder.type)}</div>
                      <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold border uppercase", getTypeBadgeClass(reminder.type))}>
                        {reminder.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    
                    {!reminder.isRead && (
                      <span className="w-2 h-2 rounded-full bg-danger shrink-0 mt-1" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className={cn("font-serif text-sm font-bold text-navy", reminder.isRead && "line-through text-gray-400")}>
                      {reminder.title}
                    </h3>
                    {reminder.description && (
                      <p className="text-xs text-gray-500 leading-relaxed font-light">
                        {reminder.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-3 border-t border-gray-50">
                  <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-400 font-semibold gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due: {formatDate(reminder.dueDate)}
                    </span>
                    <span>Client: {reminder.client.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mark Read/Unread */}
                    {!reminder.isRead ? (
                      <button
                        onClick={() => markReadMutation.mutate({ id: reminder.id, isRead: true })}
                        disabled={markReadMutation.isPending}
                        className="flex-1 py-2 bg-success/10 hover:bg-success/20 text-success border border-success/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Mark Done
                      </button>
                    ) : (
                      <button
                        onClick={() => markReadMutation.mutate({ id: reminder.id, isRead: false })}
                        disabled={markReadMutation.isPending}
                        className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 text-gray-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        Reopen
                      </button>
                    )}

                    {/* Send WhatsApp */}
                    <a
                      href={getWhatsAppLink(reminder)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-success hover:bg-success-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      Send WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
