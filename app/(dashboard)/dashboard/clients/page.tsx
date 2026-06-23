"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Users, Search, UserPlus, Trash2, Eye, Pencil, Loader2, Phone, Mail, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import ClientAvatar from "@/components/dashboard/ClientAvatar";

interface ClientData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  createdAt: string;
  activePoliciesCount: number;
  nextPremiumDue: string | null;
  _count: {
    policies: number;
  };
}

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, overdue, birthday
  const [sort, setSort] = useState("name-asc"); // name-asc, newest, oldest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch clients query
  const { data: clients, isLoading, error } = useQuery<ClientData[]>({
    queryKey: ["clients", search, filter, sort],
    queryFn: async () => {
      const response = await fetch(
        `/api/clients?search=${encodeURIComponent(search)}&filter=${filter}&sort=${sort}`
      );
      if (!response.ok) {
        throw new Error("Failed to load clients");
      }
      return response.json();
    },
  });

  // Delete client mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete client");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete ${name}? This will delete all of their policies, reminders, and documents.`
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Pagination calculation
  const totalItems = clients?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = clients?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
            Clients
          </h1>
          <p className="text-gray-500 text-xs md:text-sm">
            Manage your client portfolio
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-gold hover:bg-gold-dark text-navy text-xs font-bold transition-all shadow-md gap-1.5"
          >
            <UserPlus className="w-4.5 h-4.5" />
            Add Client
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-xs bg-gray-50 rounded-xl border border-gray-200">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, phone, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent focus:outline-none text-xs text-gray-800"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">Filter:</span>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-xs text-navy font-semibold bg-white cursor-pointer"
            >
              <option value="all">All Clients</option>
              <option value="active">Active Policies Only</option>
              <option value="overdue">With Overdue Premiums</option>
              <option value="birthday">Birthdays This Month</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-xs text-navy font-semibold bg-white cursor-pointer"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          /* Loading skeleton state */
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            Failed to load clients. Verify database connection.
          </div>
        ) : !clients || clients.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Users className="w-12 h-12 mx-auto stroke-1" />
            <p className="text-sm font-medium">No clients found. Add your first client.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Active Policies</th>
                    <th className="px-6 py-4">Next Premium Due</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-navy font-medium">
                  {paginatedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50/30 transition-colors">
                      {/* Avatar + Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ClientAvatar name={client.name} />
                          <span className="font-serif font-bold text-sm text-navy">{client.name}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-gray-600">
                        {client.phone}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-500">
                        {client.email || "-"}
                      </td>

                      {/* Active Policies count */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-sky/10 text-sky-dark font-bold">
                          {client.activePoliciesCount}
                        </span>
                      </td>

                      {/* Next Premium Due Date */}
                      <td className="px-6 py-4 text-gray-500">
                        {client.nextPremiumDue ? formatDate(client.nextPremiumDue) : "No dues"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/dashboard/clients/${client.id}`}
                            className="p-2 border border-gray-100 hover:border-sky/30 text-sky-dark hover:bg-sky/5 rounded-xl transition-colors"
                            title="View Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/clients/${client.id}/edit`}
                            className="p-2 border border-gray-100 hover:border-gold/30 text-gold-dark hover:bg-gold/5 rounded-xl transition-colors"
                            title="Edit Profile"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(client.id, client.name)}
                            className="p-2 border border-gray-100 hover:border-danger/30 text-danger hover:bg-danger/5 rounded-xl transition-colors"
                            title="Delete Client"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30 text-xs">
                <span className="text-gray-400 font-semibold">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} clients
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-navy px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
