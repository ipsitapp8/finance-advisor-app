"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { policySchema } from "@/lib/validations";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

type PolicyFormValues = z.infer<typeof policySchema>;

interface ClientSelectOption {
  id: string;
  name: string;
}

export default function NewPolicyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch client list for dropdown selection
  const { data: clients, isLoading: loadingClients } = useQuery<ClientSelectOption[]>({
    queryKey: ["clients-select"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      if (!response.ok) {
        throw new Error("Failed to load clients list");
      }
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema) as any,
    defaultValues: {
      policyNumber: "",
      policyType: "LIC",
      policyName: "",
      premiumAmount: 0,
      premiumFreq: "ANNUAL",
      startDate: "",
      dueDate: "",
      maturityDate: "",
      status: "ACTIVE",
      sumAssured: undefined,
      notes: "",
      clientId: "",
    },
  });

  const onSubmit = async (data: PolicyFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to issue policy");
      }

      // Success
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.push("/dashboard/policies");
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      {/* Back link */}
      <Link
        href="/dashboard/policies"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Policies
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
          Issue New Policy File
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Select a client, specify plan characteristics, premium rates, and dates to log policy records.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 md:p-8 border border-gray-100 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Client Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Select Client Dossier <span className="text-danger">*</span>
            </label>
            <select
              {...register("clientId")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
            >
              <option value="">-- Choose Client --</option>
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-xs text-danger mt-1.5 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.clientId.message}
              </p>
            )}
          </div>

          {/* Policy Name & Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Policy Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Plan / Policy Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                {...register("policyName")}
                placeholder="e.g. Jeevan Anand Plan 915"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
              />
              {errors.policyName && (
                <p className="text-xs text-danger mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.policyName.message}
                </p>
              )}
            </div>

            {/* Policy Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Policy Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                {...register("policyNumber")}
                placeholder="e.g. LIC-120984712"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
              />
              {errors.policyNumber && (
                <p className="text-xs text-danger mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.policyNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Type & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Policy Type <span className="text-danger">*</span>
              </label>
              <select
                {...register("policyType")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
              >
                <option value="LIC">LIC</option>
                <option value="MUTUAL_FUND">Mutual Fund (SIP)</option>
                <option value="HEALTH_INSURANCE">Health Insurance</option>
                <option value="TERM_INSURANCE">Term Insurance</option>
                <option value="ULIP">ULIP</option>
                <option value="PENSION">Pension / Retirement</option>
                <option value="CHILD_PLAN">Child Plan</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Policy Status <span className="text-danger">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
              >
                <option value="ACTIVE">Active</option>
                <option value="LAPSED">Lapsed</option>
                <option value="MATURED">Matured</option>
                <option value="SURRENDERED">Surrendered</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          {/* Premium & Frequency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Premium Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Premium Amount (₹) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                step="any"
                {...register("premiumAmount")}
                placeholder="e.g. 24500"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
              />
              {errors.premiumAmount && (
                <p className="text-xs text-danger mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.premiumAmount.message}
                </p>
              )}
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Premium Frequency <span className="text-danger">*</span>
              </label>
              <select
                {...register("premiumFreq")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="HALF_YEARLY">Half Yearly</option>
                <option value="ANNUAL">Annual</option>
                <option value="ONE_TIME">One Time</option>
              </select>
            </div>
          </div>

          {/* Cover protected Sum Assured */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Sum Assured / Life Cover Protected (₹)
            </label>
            <input
              type="number"
              step="any"
              {...register("sumAssured")}
              placeholder="e.g. 500000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800"
            />
            {errors.sumAssured && (
              <p className="text-xs text-danger mt-1.5 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.sumAssured.message}
              </p>
            )}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-xs text-gray-800"
              />
              {errors.startDate && (
                <p className="text-xs text-danger mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.startDate.message}
                </p>
              )}
            </div>

            {/* Premium Due Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Premium Due Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-xs text-gray-800"
              />
              {errors.dueDate && (
                <p className="text-xs text-danger mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.dueDate.message}
                </p>
              )}
            </div>

            {/* Maturity Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Maturity Date
              </label>
              <input
                type="date"
                {...register("maturityDate")}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-xs text-gray-800"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Policy Specific Notes
            </label>
            <textarea
              rows={3}
              {...register("notes")}
              placeholder="Enter details on nominees, special clauses, riders, etc..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light text-sm text-gray-800 resize-none"
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
                  Saving Policy...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Policy
                </>
              )}
            </button>
            <Link
              href="/dashboard/policies"
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
