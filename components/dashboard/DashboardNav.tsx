"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useUIStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function DashboardNav() {
  const { data: session } = useSession();
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Generate Breadcrumbs from current pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, idx) => {
      const href = "/" + paths.slice(0, idx + 1).join("/");
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      return { name, href, isLast: idx === paths.length - 1 };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0 relative z-30">
      {/* Left side: Hamburger Trigger & Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-800 focus:outline-none p-1 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-600 transition-colors">
            Portal
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span>/</span>
              {crumb.isLast ? (
                <span className="text-gray-800 font-bold">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-gray-600 transition-colors">
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right side: Notification & User Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <Link href="/dashboard/reminders" className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-danger text-white rounded-full flex items-center justify-center font-bold text-[9px] border border-white">
            3
          </span>
        </Link>

        {/* Divider */}
        <span className="h-5 w-px bg-gray-200" />

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none group p-1"
          >
            <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold font-serif group-hover:bg-navy-light transition-all border border-gray-100">
              {getInitials(session?.user?.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-800 leading-tight">
                {session?.user?.name || "Advisor"}
              </p>
              <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5 uppercase tracking-wide">
                {(session?.user as any)?.role || "ADMIN"}
              </p>
            </div>
            <ChevronDown className="w-4.5 h-4.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>

          {/* Dropdown Menu Box */}
          {profileDropdownOpen && (
            <>
              {/* Overlay to close */}
              <div onClick={() => setProfileDropdownOpen(false)} className="fixed inset-0 z-40 bg-transparent" />
              
              <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl border border-gray-100 shadow-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-navy truncate mt-0.5">{session?.user?.email}</p>
                </div>
                
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Portal</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
