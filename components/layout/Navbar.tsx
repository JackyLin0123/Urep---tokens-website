"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Leaf,
  LayoutDashboard,
  History,
  Gift,
  User,
  Trophy,
  Menu,
  X,
  LogOut,
  Info,
  Shield,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/education",   label: "Learn & Earn", icon: GraduationCap },
  { href: "/history",     label: "History",      icon: History },
  { href: "/rewards",     label: "Rewards",      icon: Gift },
  { href: "/leaderboard", label: "Leaderboard",  icon: Trophy },
  { href: "/profile",     label: "Profile",      icon: User },
  { href: "/how-it-works",label: "How It Works", icon: Info },
];

interface NavbarProps {
  user?: { email: string; name?: string | null; isAdmin?: boolean };
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-surface-100 z-40">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-6 py-5 border-b border-surface-100">
          <div className="w-9 h-9 rounded-xl eco-gradient flex items-center justify-center shadow-glow">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl text-surface-900">EcoToken</span>
        </Link>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-eco-50 text-eco-700 shadow-sm"
                    : "text-surface-500 hover:text-surface-700 hover:bg-surface-50"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </Link>
            );
          })}

          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                pathname.startsWith("/admin")
                  ? "bg-amber-50 text-amber-700"
                  : "text-surface-500 hover:text-surface-700 hover:bg-surface-50"
              }`}
            >
              <Shield className="w-[18px] h-[18px]" />
              Admin Panel
            </Link>
          )}
        </nav>
	
	  {/* Team credit */}
        <div className="px-6 py-2">
          <p className="text-[10px] text-surface-300 tracking-wider uppercase">Built by Green Frame</p>
        </div>
	
        {/* User footer */}
        <div className="px-4 py-4 border-t border-surface-100">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-800 truncate">
                {user?.name || user?.email?.split("@")[0] || "Student"}
              </p>
              <p className="text-xs text-surface-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────────── */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-white/90 backdrop-blur-lg border-b border-surface-100 z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg eco-gradient flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg text-surface-900">EcoToken</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-surface-600 hover:bg-surface-100"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile menu overlay ──────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-14 right-0 w-64 bg-white border-l border-surface-100 h-full shadow-xl p-4 space-y-1 animate-slide-down">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    active
                      ? "bg-eco-50 text-eco-700"
                      : "text-surface-500 hover:bg-surface-50"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {label}
                </Link>
              );
            })}
            {user?.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface-500 hover:bg-surface-50"
              >
                <Shield className="w-[18px] h-[18px]" />
                Admin Panel
              </Link>
            )}
            <hr className="my-2 border-surface-100" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full"
            >
              <LogOut className="w-[18px] h-[18px]" />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* ── Mobile bottom nav ────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-lg border-t border-surface-100 z-40 flex items-center justify-around h-16 px-2 safe-area-bottom">
        {[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[3], NAV_ITEMS[5]].map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? "text-eco-600" : "text-surface-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
