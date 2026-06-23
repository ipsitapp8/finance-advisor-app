"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "@/lib/validations";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

type ClientFormValues = z.infer<typeof clientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create client");
      }

      // Success
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.push("/dashboard/clients");
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      {/* Back Link */}
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
          Add New Client Profile
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Enter contact details and personal planning notes to onboard a client.
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
              disabled={isSubmitting}
              className="px-6 py-3 bg-navy hover:bg-navy-light disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center transition-all shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Client...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Client
                </>
              )}
            </button>
            <Link
              href="/dashboard/clients"
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
