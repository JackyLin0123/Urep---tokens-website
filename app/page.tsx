import Link from "next/link";
import { Leaf, Recycle, Coins, Gift, ArrowRight, TreePine, Droplets, Wind } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen eco-gradient-subtle">
      {/* ── Hero ───────────────────────────────── */}
      <header className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-eco-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />

        <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl eco-gradient flex items-center justify-center shadow-glow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl text-surface-900">EcoToken</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/how-it-works" className="btn-ghost text-sm hidden sm:flex">
              How It Works
            </Link>
            <Link href="/auth/login" className="btn-primary text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 lg:pt-28 lg:pb-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-eco-100 text-eco-700 rounded-full text-sm font-medium mb-6">
              <Recycle className="w-4 h-4" />
              Campus Sustainability Initiative
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-surface-950 leading-[1.1] mb-6">
              Recycle More,{" "}
              <span className="text-eco-600">Earn Rewards</span>
            </h1>

            <p className="text-lg text-surface-600 leading-relaxed mb-8 max-w-lg">
              Drop your recyclables on campus, earn EcoTokens, and redeem them
              for food vouchers, community service hours, merchandise, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/login" className="btn-primary text-base px-7 py-3">
                Start Recycling <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/how-it-works" className="btn-secondary text-base px-7 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── How it works (brief) ─────────────── */}
      <section className="relative bg-white border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-display text-3xl text-center text-surface-900 mb-12">
            Three Simple Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Recycle,
                step: "01",
                title: "Recycle on Campus",
                desc: "Drop your recyclables at any participating campus bin and scan the QR code.",
              },
              {
                icon: Coins,
                step: "02",
                title: "Earn Tokens",
                desc: "Each item earns you EcoTokens based on material type. Streaks earn bonus tokens.",
              },
              {
                icon: Gift,
                step: "03",
                title: "Redeem Rewards",
                desc: "Spend tokens on food vouchers, service hours, eco merchandise, and unique experiences.",
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-eco-100 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-eco-600" />
                </div>
                <p className="text-xs font-semibold text-eco-500 uppercase tracking-widest mb-2">
                  Step {step}
                </p>
                <h3 className="font-display text-xl text-surface-900 mb-2">{title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact stats ─────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: TreePine, value: "1,200+", label: "Trees Saved" },
            { icon: Droplets, value: "50,000", label: "Bottles Recycled" },
            { icon: Wind, value: "8 tons", label: "CO₂ Reduced" },
          ].map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="eco-card p-6 text-center"
            >
              <Icon className="w-8 h-8 text-eco-500 mx-auto mb-3" />
              <p className="font-display text-3xl text-surface-900 mb-1">{value}</p>
              <p className="text-sm text-surface-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer className="border-t border-surface-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-eco-500" />
            <span className="text-sm text-surface-500">
              EcoToken © {new Date().getFullYear()} — Campus Sustainability
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-surface-400">
            <Link href="/how-it-works" className="hover:text-eco-600 transition-colors">
              How It Works
            </Link>
            <Link href="/auth/login" className="hover:text-eco-600 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
