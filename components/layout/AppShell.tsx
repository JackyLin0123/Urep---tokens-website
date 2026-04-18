"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Navbar from "./Navbar";
import type { UserProfile } from "@/types";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<UserProfile> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile from our API
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const profile = await res.json();
            setUser(profile);
          } else {
            setUser({
              email: session.user.email ?? "",
              name: session.user.user_metadata?.name,
            });
          }
        } catch {
          setUser({
            email: session.user.email ?? "",
            name: session.user.user_metadata?.name,
          });
        }
      }
    }
    loadUser();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar user={user ? { email: user.email ?? "", name: user.name, isAdmin: user.isAdmin } : undefined} />
      {/* Main content area with sidebar offset on desktop */}
      <main className="lg:pl-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
