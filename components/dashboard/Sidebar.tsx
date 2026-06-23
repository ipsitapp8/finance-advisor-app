"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/store";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileSpreadsheet,
  FilePlus,
  Bell,
  FolderOpen,
  TrendingUp,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Clients",
    items: [
      { name: "All Clients", href: "/dashboard/clients", icon: Users },
      { name: "Add Client", href: "/dashboard/clients/new", icon: UserPlus },
    ],
  },
  {
    title: "Policies",
    items: [
      { name: "All Policies", href: "/dashboard/policies", icon: FileSpreadsheet },
      { name: "Add Policy", href: "/dashboard/policies/new", icon: FilePlus },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Reminders", href: "/dashboard/reminders", icon: Bell },
      { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
      { name: "Reports & Charts", href: "/dashboard/reports", icon: TrendingUp },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Panel container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-navy text-gray-300 flex flex-col border-r border-white/5 transition-transform duration-300 md:translate-x-0 md:static shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Branding */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-serif text-lg font-black text-white tracking-tight">
              Pratik Finance <span className="text-gold">CRM</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white md:hidden focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3">
                {group.title}
              </h4>
              <ul className="space-y-1">
                {group.items.map((item, iIdx) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={iIdx}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-l-4",
                          isActive
                            ? "bg-navy-light text-sky-light border-gold font-semibold"
                            : "border-transparent hover:bg-navy-light/40 hover:text-white"
                        )}
                      >
                        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-sky-light" : "text-gray-400")} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
