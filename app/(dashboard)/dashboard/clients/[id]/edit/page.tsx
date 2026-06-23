"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "@/lib/validations";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

type ClientFormValues = z.infer<typeof clientSchema>;

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch client details
  const { data: client, isLoading, error } = useQuery({
    queryKey: ["client-edit", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${params.id}`);
      if (!response.ok) throw new Error("Failed to load client profile");
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: "",
      notes: "",
    },
  });

  // Pre-load form fields once data loads
  useEffect(() => {
    if (client) {
      setValue("name", client.name);
      setValue("phone", client.phone);
      setValue("email", client.email || "");
      setValue("address", client.address || "");
      if (client.dateOfBirth) {
        const formattedDate = new Date(client.dateOfBirth).toISOString().split("T")[0];
        setValue("dateOfBirth", formattedDate);
      } else {
        setValue("dateOfBirth", "");
      }
      setValue("notes", client.notes || "");
    }
  }, [client, setValue]);

  // Update client mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update client");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-profile", params.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.push(`/dashboard/clients/${params.id}`);
    },
    onError: (err: any) => {
      setSubmitError(err.message || "Something went wrong.");
    },
  });

  const onSubmit = (data: ClientFormValues) => {
    setSubmitError(null);
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center space-y-3 text-gray-400 min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm">Loading client profile...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-6 text-center space-y-4">
        <h3 className="font-serif text-xl font-bold text-navy">Error Loading Profile</h3>
        <p className="text-gray-500 text-sm">Failed to retrieve client details for editing.</p>
        <Link href="/dashboard/clients" className="inline-flex items-center text-xs font-semibold text-sky-dark hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      {/* Back Link */}
      <Link
        href={`/dashboard/clients/${params.id}`}
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dossier
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
          Edit Client Profile
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Modify contact details and personal planning notes for {client.name}.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 md:p-8 border border-gray-100 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Amit Sharma"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
            />
            {errors.name && (
              <p className="text-xs text-danger mt-1.5 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
              />
              {errors.phone && (
                <p className="text-xs text-danger mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="e.g. amit@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
              />
              {errors.email && (
                <p className="text-xs text-danger mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Date of Birth & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date of birth */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
              />
            </div>
            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Residential Address
              </label>
              <input
                type="text"
                {...register("address")}
                placeholder="e.g. Flat 402, Sunshine Heights, Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
              />
            </div>
          </div>

          {/* Planning Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Advisory Planning Notes
            </label>
            <textarea
              rows={4}
              {...register("notes")}
              placeholder="Enter details on client financial goals, liabilities, or general background..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800 resize-none"
            />
          </div>

          {submitError && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-3 bg-navy hover:bg-navy-light disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center transition-all shadow-md"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Client...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
            <Link
              href={`/dashboard/clients/${params.id}`}
              className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-navy font-semibold text-sm rounded-xl transition-all"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
