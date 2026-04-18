# 🌿 EcoToken — Campus Recycling Rewards

A full-stack web application that incentivizes university students to recycle by earning tokens redeemable for rewards like food vouchers, community service hours, and eco-friendly merchandise.

![Next.js](https://img.shields.io/badge/Next.js_14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

### Student Features
- **Dashboard** — Token balance, items recycled, daily streak stats
- **Recycling History** — Paginated log of all recycling activity
- **Rewards Marketplace** — Browse and redeem tokens for rewards:
  - 🎓 Community service hours certificates
  - ☕ Campus café discount vouchers
  - 🎁 Eco merchandise (tote bags, water bottles, t-shirts)
  - 🌿 Unique experiences (tree planting, garden workshops)
- **Profile** — Token wallet, milestone badges, account info
- **Leaderboard** — Top campus recyclers ranked
- **How It Works** — Onboarding guide with token value table

### Admin / Demo Features
- **Admin Panel** — Manually award tokens to any student (simulates bin verification)
- **QR Code Simulation** — Visual demo of the scan-and-recycle flow

### Technical Highlights
- Magic link + Google OAuth authentication via Supabase
- Row Level Security (RLS) on all database tables
- Automatic streak tracking (48-hour window)
- Transactional token operations (atomic balance updates)
- Mobile-first responsive design with bottom navigation
- Animated page transitions and micro-interactions

---

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Framework    | Next.js 14 (App Router)            |
| Language     | TypeScript                          |
| Styling      | Tailwind CSS + custom design system |
| Auth         | Supabase Auth (magic link + OAuth)  |
| Database     | Supabase PostgreSQL                 |
| ORM          | Prisma                              |
| Icons        | Lucide React                        |
| Deployment   | Vercel + Supabase                   |

---

## Project Structure

```
ecotoken/
├── app/
│   ├── api/
│   │   ├── auth/me/route.ts        # User profile endpoint
│   │   ├── recycling/route.ts      # Recycling CRUD
│   │   ├── rewards/route.ts        # Rewards catalog + redemption
│   │   ├── admin/route.ts          # Admin token awards
│   │   └── leaderboard/route.ts    # Leaderboard data
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── callback/route.ts       # OAuth callback handler
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── history/page.tsx            # Recycling history
│   ├── rewards/page.tsx            # Rewards marketplace
│   ├── profile/page.tsx            # User profile & wallet
│   ├── leaderboard/page.tsx        # Campus leaderboard
│   ├── admin/page.tsx              # Admin token panel
│   ├── how-it-works/page.tsx       # Info page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── page.tsx                    # Public landing page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sidebar + mobile nav
│   │   └── AppShell.tsx            # Auth layout wrapper
│   ├── ui/
│   │   ├── StatCard.tsx            # Dashboard stat card
│   │   ├── EmptyState.tsx          # Empty state placeholder
│   │   └── Spinner.tsx             # Loading spinner
│   └── rewards/
│       └── RewardCard.tsx          # Reward item card
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── supabase-browser.ts         # Browser Supabase client
│   ├── supabase-server.ts          # Server Supabase client
│   └── utils.ts                    # Utility functions
├── prisma/
│   ├── schema.prisma               # Prisma schema
│   └── supabase-schema.sql         # Raw SQL for Supabase
├── types/
│   └── index.ts                    # Shared TypeScript types
├── middleware.ts                    # Auth route protection
├── tailwind.config.ts              # Tailwind theme
├── .env.example                    # Environment template
└── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (for deployment)

### 1. Clone & Install

```bash
git clone <your-repo-url> ecotoken
cd ecotoken
npm install
```

### 2. Set Up Supabase

1. **Create a new Supabase project** at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → Database** and copy:
   - Connection string → `DATABASE_URL` (use the "URI" format; replace `[YOUR-PASSWORD]`)

### 3. Run the Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Paste the contents of `prisma/supabase-schema.sql`
3. Click **Run** — this creates all tables, enums, RLS policies, and seeds the rewards catalog

### 4. Configure Auth Providers

In Supabase dashboard → **Authentication → Providers**:

- **Email**: Enable "Magic Link" sign-in (enabled by default)
- **Google** (optional): Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/), then paste the Client ID and Secret in Supabase

Add your site URL under **Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (dev) or your production URL
- Redirect URLs: `http://localhost:3000/auth/callback`

### 5. Environment Variables

```bash
cp .env.example .env.local
```

Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

> **Note**: If you prefer to manage the schema via Prisma migrations instead of the SQL file, you can run `npx prisma db push` instead. The SQL file and Prisma schema are kept in sync.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Set the **Root Directory** to the project root
4. Add all environment variables from `.env.local`
5. Set the **Build Command** to: `npx prisma generate && next build`
6. Deploy!

### 3. Update Supabase URLs

In Supabase → **Authentication → URL Configuration**:
- Update Site URL to: `https://your-app.vercel.app`
- Add redirect URL: `https://your-app.vercel.app/auth/callback`

---

## Environment Variables Reference

| Variable                         | Description                              | Required |
|----------------------------------|------------------------------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL                     | ✅       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase public anon key                 | ✅       |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase service role key (server only)  | ✅       |
| `DATABASE_URL`                   | PostgreSQL connection string             | ✅       |
| `NEXT_PUBLIC_APP_URL`            | Your app's base URL                      | ✅       |

---

## Demo Walkthrough

1. **Sign up** with any email (magic link) or Google
2. Go to **Admin Panel** → enter your email, select item types, and award yourself tokens
3. Check **Dashboard** to see your updated stats
4. Browse **Rewards Marketplace** and redeem tokens for rewards
5. View **History** to see all recycling entries
6. Check **Leaderboard** to see rankings
7. Visit **Profile** to view your wallet and milestones

---

## Extending the Project

- **Smart bin integration**: Replace the admin panel with IoT sensor webhooks
- **Push notifications**: Remind students about streaks via Supabase Realtime
- **Social sharing**: Let students share achievements on social media
- **University federation**: Multi-campus support with org-level admin
- **Analytics dashboard**: Admin view with charts (recharts/d3)
- **Mobile app**: Wrap with Capacitor or React Native

---

## License

MIT — Built for campus sustainability initiatives.
