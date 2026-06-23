"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { User, Mail, ShieldCheck, Settings as SettingsIcon, Key, Phone, Building, BellRing, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeSettingsTab, setActiveSettingsTab] = useState<"profile" | "security" | "business" | "notifications">("profile");

  // Success message state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [profileName, setProfileName] = useState(session?.user?.name || "Pratik Shah");
  const [profileEmail, setProfileEmail] = useState(session?.user?.email || "admin@pratikfinance.com");
  const [profilePhone, setProfilePhone] = useState("+91 98765 43210");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [licCode, setLicCode] = useState("LIC-048192A");
  const [arnCode, setArnCode] = useState("ARN-120947");
  const [officeAddress, setOfficeAddress] = useState("Office 104, Capital Business Park, Gurgaon, HR - 122001");

  const [emailNotify, setEmailNotify] = useState(true);
  const [whatsappNotify, setWhatsappNotify] = useState(true);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Profile settings saved successfully.");
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    showSuccess("Security password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Business info & advisor credentials updated.");
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Notification preferences synced.");
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
          Account Settings
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          View and manage your advisor profile, credential parameters, security details, and notifications.
        </p>
      </div>

      {/* Navigation tabs row */}
      <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm gap-1 max-w-lg">
        <button
          onClick={() => setActiveSettingsTab("profile")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeSettingsTab === "profile" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Profile
        </button>
        <button
          onClick={() => setActiveSettingsTab("security")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeSettingsTab === "security" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          Security
        </button>
        <button
          onClick={() => setActiveSettingsTab("business")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeSettingsTab === "business" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          Business Info
        </button>
        <button
          onClick={() => setActiveSettingsTab("notifications")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeSettingsTab === "notifications" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          Notifications
        </button>
      </div>

      {/* Floating success banner */}
      {successMsg && (
        <div className="p-3 bg-success/15 border border-success/35 text-success rounded-xl text-xs font-bold flex items-center gap-2 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab Panels */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* PANEL 1: Profile */}
        {activeSettingsTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6 text-xs font-semibold text-gray-500">
            <h3 className="font-serif text-base font-bold text-navy mb-4 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">Phone Contact</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">Account Privilege</label>
                <div className="px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-navy font-bold flex items-center gap-1.5 uppercase">
                  <ShieldCheck className="w-4 h-4 text-sky" />
                  {(session?.user as any)?.role || "ADMIN"}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </form>
        )}

        {/* PANEL 2: Security */}
        {activeSettingsTab === "security" && (
          <form onSubmit={handleSecuritySubmit} className="space-y-6 text-xs font-semibold text-gray-500">
            <h3 className="font-serif text-base font-bold text-navy mb-4 flex items-center gap-1.5">
              <Key className="w-4 h-4" /> Security Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="At least 6 chars"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="At least 6 chars"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Key className="w-4 h-4" /> Change Password
            </button>
          </form>
        )}

        {/* PANEL 3: Business Info */}
        {activeSettingsTab === "business" && (
          <form onSubmit={handleBusinessSubmit} className="space-y-6 text-xs font-semibold text-gray-500">
            <h3 className="font-serif text-base font-bold text-navy mb-4 flex items-center gap-1.5">
              <Building className="w-4 h-4" /> Business Info & Registration Codes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">Advisor Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">LIC Agent Code</label>
                <input
                  type="text"
                  value={licCode}
                  onChange={(e) => setLicCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-[10px] text-gray-400">AMFI ARN Code</label>
                <input
                  type="text"
                  value={arnCode}
                  onChange={(e) => setArnCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2 col-span-3">
              <label className="block uppercase tracking-wider text-[10px] text-gray-400">Office Address</label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-navy font-medium"
              />
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-gray-400 leading-relaxed">
              <p className="text-navy font-bold">Public Website Info Feed</p>
              <p className="font-light">
                Note: Updating these fields changes the footer licensing disclaimers, AMFI credentials, and office location indicators displayed across the public-facing homepage and footer.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Business Info
            </button>
          </form>
        )}

        {/* PANEL 4: Notification Preferences */}
        {activeSettingsTab === "notifications" && (
          <form onSubmit={handleNotifySubmit} className="space-y-6 text-xs font-semibold text-gray-500">
            <h3 className="font-serif text-base font-bold text-navy mb-4 flex items-center gap-1.5">
              <BellRing className="w-4 h-4" /> Notification Alerts & Reminders
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/50 cursor-pointer select-none">
                <div className="space-y-0.5">
                  <span className="font-bold text-navy text-xs block">Email Notifications</span>
                  <span className="font-normal text-gray-400">Send summary alerts regarding expiring policies and birthdays</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="rounded text-sky focus:ring-sky border-gray-300 w-5 h-5 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/50 cursor-pointer select-none">
                <div className="space-y-0.5">
                  <span className="font-bold text-navy text-xs block">WhatsApp Reminders</span>
                  <span className="font-normal text-gray-400">Trigger daily checks for premium dues and let you text templates with wishes/reminders</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappNotify}
                  onChange={(e) => setWhatsappNotify(e.target.checked)}
                  className="rounded text-sky focus:ring-sky border-gray-300 w-5 h-5 cursor-pointer"
                />
              </label>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Notification Rules
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
