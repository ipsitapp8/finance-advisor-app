"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validations";
import { z } from "zod";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message. Please try again.");
      }

      setSubmitSuccess(true);
      reset();
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold text-navy">Message Sent!</h3>
          <p className="text-gray-600 text-sm">
            Thank you for reaching out. We have received your inquiry and will contact you within 24 business hours.
          </p>
        </div>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="w-full py-3 bg-navy text-white font-semibold rounded-full hover:bg-navy-light transition-all"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto">
      <h3 className="font-serif text-2xl font-bold text-navy mb-2">Request a Call Back</h3>
      <p className="text-gray-500 text-sm mb-6">
        Please fill in the form details below and we will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
            placeholder="e.g. Rajesh Kumar"
          />
          {errors.name && (
            <p className="text-xs text-danger mt-1.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email & Phone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
              placeholder="e.g. rajesh@example.com"
            />
            {errors.email && (
              <p className="text-xs text-danger mt-1.5 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800"
              placeholder="e.g. 9876543210"
            />
            {errors.phone && (
              <p className="text-xs text-danger mt-1.5 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Your Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800 resize-none"
            placeholder="Tell us about your financial planning goals or queries..."
          />
          {errors.message && (
            <p className="text-xs text-danger mt-1.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {errors.message.message}
            </p>
          )}
        </div>

        {submitError && (
          <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold disabled:opacity-50 text-navy font-semibold rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-gold/25"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Consultation Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
