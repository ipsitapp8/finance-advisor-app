"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileSpreadsheet,
  FolderOpen,
  Bell,
  Trash2,
  Download,
  Loader2,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import DocumentUploader from "@/components/dashboard/DocumentUploader";

interface ClientDetail {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  dateOfBirth: string | null;
  notes: string | null;
  createdAt: string;
  policies: Array<{
    id: string;
    policyNumber: string;
    policyType: string;
    policyName: string;
    premiumAmount: number;
    dueDate: string;
    status: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  }>;
  reminders: Array<{
    id: string;
    type: string;
    title: string;
    description: string | null;
    dueDate: string;
    isRead: boolean;
  }>;
}

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"policies" | "documents" | "reminders">("policies");

  // Fetch client details
  const { data: client, isLoading, error } = useQuery<ClientDetail>({
    queryKey: ["client-profile", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to load client dossier");
      }
      return response.json();
    },
  });

  // Client deletion
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/clients/${params.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.push("/dashboard/clients");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this client? All policies, files, and reminders will be deleted.")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center space-y-3 text-gray-400 min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm">Loading client dossier...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-6 text-center space-y-4">
        <h3 className="font-serif text-xl font-bold text-navy">Client Dossier Error</h3>
        <p className="text-gray-500 text-sm">We could not retrieve details for this client profile.</p>
        <Link href="/dashboard/clients" className="inline-flex items-center text-xs font-semibold text-sky-dark hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Back to Clients list */}
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Clients
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Dossier Card */}
        <div className="lg:col-span-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="space-y-2 text-center pb-6 border-b border-gray-50">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-light to-navy text-white flex items-center justify-center font-bold text-lg font-serif mx-auto">
              {client.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
            </div>
            <h2 className="font-serif text-xl font-bold text-navy">{client.name}</h2>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky/10 text-sky-dark text-[10px] font-bold uppercase tracking-wider">
              Client
            </span>
          </div>

          {/* Details */}
          <div className="space-y-4 text-xs">
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
              <span>{client.phone}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
              <span className="truncate">{client.email || "No email address"}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
              <span>DOB: {client.dateOfBirth ? formatDate(client.dateOfBirth) : "-"}</span>
            </div>

            <div className="flex items-start text-gray-600">
              <MapPin className="w-4 h-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{client.address || "No address listed"}</span>
            </div>
          </div>

          {/* Planning Notes */}
          <div className="space-y-2 border-t border-gray-50 pt-4 text-xs">
            <h4 className="font-bold text-navy uppercase tracking-wider text-[10px] text-gray-400">Advisory Notes</h4>
            <p className="text-gray-600 leading-relaxed font-light">{client.notes || "No notes entered for this client."}</p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-50 pt-4 flex flex-col gap-2">
            <Link
              href={`/dashboard/clients/${client.id}/edit`}
              className="w-full py-2.5 bg-navy hover:bg-navy-light text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
            >
              Edit Profile
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="w-full py-2.5 border border-danger/20 hover:bg-danger/5 text-danger font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Dossier
            </button>
          </div>
        </div>

        {/* Right Column: Tab View */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs Selector Navigation */}
          <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab("policies")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "policies" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Policies ({client.policies.length})
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "documents" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Documents ({client.documents.length})
            </button>
            <button
              onClick={() => setActiveTab("reminders")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "reminders" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Bell className="w-4 h-4" />
              Reminders ({client.reminders.length})
            </button>
          </div>

          {/* Active Tab Panel render */}
          {activeTab === "policies" && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-navy">Policies & Portfolio</h3>
                <Link
                  href="/dashboard/policies/new"
                  className="px-3 py-1.5 rounded-lg bg-navy hover:bg-navy-light text-white text-[10px] font-bold"
                >
                  Add Policy
                </Link>
              </div>

              {client.policies.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  No policies active for this client.
                </div>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="pb-3">Policy No.</th>
                        <th className="pb-3">Product Name</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3 text-right">Premium</th>
                        <th className="pb-3">Premium Due</th>
                        <th className="pb-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-navy">
                      {client.policies.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/20">
                          <td className="py-3 font-semibold">{p.policyNumber}</td>
                          <td className="py-3 text-gray-600">{p.policyName}</td>
                          <td className="py-3 uppercase text-[10px] font-bold text-gray-400">{p.policyType.replace("_", " ")}</td>
                          <td className="py-3 text-right font-bold">{formatCurrency(p.premiumAmount)}</td>
                          <td className="py-3 font-medium text-gray-500">{formatDate(p.dueDate)}</td>
                          <td className="py-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                p.status === "ACTIVE"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Document locker list (7 cols) */}
              <div className="md:col-span-7 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-navy">Document Cabinet</h3>

                {client.documents.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No files uploaded in client cabinet.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 text-xs">
                    {client.documents.map((doc) => (
                      <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-bold text-navy truncate">{doc.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {formatDate(doc.uploadedAt)} • {(doc.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <a
                          href={doc.fileUrl}
                          download
                          className="p-1.5 border border-gray-100 hover:border-gray-200 text-sky-dark hover:bg-gray-50 rounded-lg shrink-0"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload panel (5 cols) */}
              <div className="md:col-span-5">
                <DocumentUploader clientId={client.id} />
              </div>
            </div>
          )}

          {activeTab === "reminders" && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-navy">Reminders & Tasks</h3>

              {client.reminders.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  No reminders scheduled for this client.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 text-xs">
                  {client.reminders.map((r) => (
                    <div key={r.id} className="py-4 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              r.type === "PREMIUM_DUE" || r.type === "PREMIUM_OVERDUE"
                                ? "bg-danger/10 text-danger"
                                : "bg-gold/10 text-gold-dark"
                            }`}
                          >
                            {r.type.replace("_", " ")}
                          </span>
                          <h4 className="font-bold text-navy">{r.title}</h4>
                        </div>
                        {r.description && <p className="text-gray-500 font-light leading-relaxed">{r.description}</p>}
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Due: {formatDate(r.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
