"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      });

      if (authError) throw authError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
    if (authError) setError(authError.message);
  };

  return (
    <div className="min-h-screen eco-gradient-subtle flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-eco-200/20 rounded-full blur-3xl" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-eco-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="eco-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl eco-gradient flex items-center justify-center shadow-glow">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-surface-900">EcoToken</h1>
              <p className="text-xs text-surface-400">Campus Recycling Rewards</p>
            </div>
          </div>

          {sent ? (
            /* ── Magic link sent confirmation ──── */
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-eco-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-eco-600" />
              </div>
              <h2 className="font-display text-xl text-surface-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-sm text-surface-500 mb-6">
                We sent a sign-in link to{" "}
                <span className="font-semibold text-surface-700">{email}</span>.
                Click it to log in.
              </p>
              <button
                onClick={() => setSent(false)}
                className="btn-ghost text-sm"
              >
                Use a different email
              </button>
            </div>
          ) : (
            /* ── Login form ────────────────────── */
            <>
              <h2 className="font-display text-xl text-surface-900 mb-1">
                Welcome Back
              </h2>
              <p className="text-sm text-surface-500 mb-6">
                Sign in with your university email to start earning tokens.
              </p>

              {/* Google OAuth button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full btn-secondary mb-4 py-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-surface-200" />
                <span className="text-xs text-surface-400 uppercase tracking-wider">
                  or use email
                </span>
                <div className="flex-1 h-px bg-surface-200" />
              </div>

              {/* Email form */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-surface-700 mb-1.5"
                  >
                    University Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-eco-500/40 focus:border-eco-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send Magic Link"
                  )}
                </button>
              </form>

              <p className="mt-5 text-xs text-center text-surface-400">
                By signing in, you agree to our sustainability pledge.
                <br />
                We recommend using your .edu email for full access.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
