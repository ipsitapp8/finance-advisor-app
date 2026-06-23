"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";
import { Loader2, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid email address or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel: Navy Gradient with Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy via-navy-light to-navy-mid relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(56, 189, 248, 0.3) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glowing orb */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-sky/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-md text-center space-y-8">
          {/* Logo */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl font-bold tracking-tight">
              Pratik Finance<span className="text-gold">.</span>
            </h1>
            <div className="w-16 h-0.5 bg-gold/50 mx-auto" />
          </div>

          {/* Tagline */}
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold leading-snug">
              Client Management Portal
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              Access your advisory dashboard to manage client portfolios, track premium collections, monitor policy renewals, and generate performance reports.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
              🔒 256-bit Encrypted
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
              🛡️ JWT Sessions
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
              ✓ MDRT Certified
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center space-y-2">
            <h1 className="font-serif text-3xl font-bold text-navy tracking-tight">
              Pratik Finance<span className="text-gold">.</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium">Client Management Portal</p>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-sky" />
              <h2 className="font-serif text-2xl font-bold text-navy">Welcome Back</h2>
            </div>
            <p className="text-gray-500 text-sm">
              Sign in to your advisor dashboard with your registered credentials.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                placeholder="advisor@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800 bg-gray-50/50"
              />
              {errors.email && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-light/40 focus:border-sky-light transition-all text-sm text-gray-800 bg-gray-50/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Alert */}
            {loginError && (
              <div className="p-3.5 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-navy to-navy-mid hover:from-navy-mid hover:to-navy disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all shadow-lg hover:shadow-navy/20 hover:-translate-y-0.5 duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              This is a secured portal for authorized advisors only.<br />
              Registration is managed by the system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
