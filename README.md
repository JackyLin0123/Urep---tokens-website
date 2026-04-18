# 🌿 EcoToken — Campus Recycling Rewards

A full-stack web application that incentivizes university students to recycle by earning tokens redeemable for food vouchers, eco-friendly merchandise, and unique experiences.

🔗 **Live Demo**: [urep-tokens-website-dpi5.vercel.app](https://urep-tokens-website-dpi5.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js_14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

### Student Features
- **Dashboard** — Token balance, items recycled, daily streak stats at a glance
- **Recycling History** — Paginated log of all recycling activity with date, item type, and tokens earned
- **Rewards Marketplace** — Browse and redeem tokens for rewards:
  - ☕ Campus café discount vouchers ($5 / $10)
  - 🎁 Eco merchandise (tote bags, water bottles, t-shirts, bamboo cutlery)
  - 🌿 Unique experiences (tree planting, garden workshops)
- **Profile** — Token wallet, milestone badges, account info
- **Leaderboard** — Top campus recyclers ranked with podium display
- **How It Works** — Onboarding guide with token value table and FAQ

### Admin / Demo Features
- **Admin Panel** — Manually award tokens to any student (simulates bin verification)
- **QR Code Simulation** — Visual demo of the scan-and-recycle flow

### Authentication
- **Magic Link** — Passwordless email sign-in via Supabase
- **Google OAuth** — One-click Google sign-in
- Mobile-first responsive design with bottom navigation

---

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Framework    | Next.js 14 (App Router)            |
| Language     | TypeScript                          |
| Styling      | Tailwind CSS + custom design system |
| Auth         | Supabase Auth (Magic Link + Google OAuth) |
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
│   │   ├── auth/me/route.ts        # User profile (auto-create on first login)
│   │   ├── recycling/route.ts      # Recycling CRUD + streak tracking
│   │   ├── rewards/route.ts        # Rewards catalog + atomic redemption
│   │   ├── admin/route.ts          # Admin token awards
│   │   └── leaderboard/route.ts    # Leaderboard data
│   ├── auth/
│   │   ├── login/page.tsx          # Login (Magic Link + Google OAuth)
│   │   └── callback/route.ts       # Auth callback (verifyOtp + exchangeCode)
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
- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (for deployment)
- A [Google Cloud](https://console.cloud.google.com) project (for Google OAuth, optional)

### 1. Clone & Install

```bash
git clone https://github.com/JackyLin0123/Urep---tokens-website.git
cd Urep---tokens-website
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **Settings → API Keys** and copy:
   - **Publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Secret key** → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → General** and note the **Project ID**, your URL is:
   ```
   https://[PROJECT_ID].supabase.co
   ```
4. Click the green **Connect** button at the top → copy the **URI** connection string → `DATABASE_URL`

### 3. Run the Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Paste the contents of `prisma/supabase-schema.sql`
3. Click **Run** — this creates all tables, enums, RLS policies, and seeds the rewards catalog

### 4. Configure Authentication

#### Magic Link (Email)
- Supabase → **Authentication** → **Email Templates** → **Magic Link**
- Set the Body to:
  ```html
  <h2>Magic Link</h2>
  <p>Follow this link to login:</p>
  <p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">Log In</a></p>
  ```

#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com) → create/select a project
2. **Google Auth Platform** → **Branding** → fill App name (`EcoToken`), support email, developer email → Save
3. **Clients** → **+ CREATE CLIENT** → Web application
4. Add **Authorized redirect URI**:
   ```
   https://[PROJECT_ID].supabase.co/auth/v1/callback
   ```
5. Copy the **Client ID** and **Client Secret**
6. Supabase → **Authentication** → **Providers** → **Google** → Enable → paste Client ID & Secret → Save

#### URL Configuration
- Supabase → **Authentication** → **URL Configuration**
- **Site URL**: `https://your-vercel-domain.vercel.app`
- **Redirect URLs**: `https://your-vercel-domain.vercel.app/auth/callback`

### 5. Environment Variables

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Locally

```bash
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → Import your GitHub repo
2. Set **Build Command** to:
   ```
   npx prisma generate && next build
   ```
3. Add all environment variables from `.env.local` (change `NEXT_PUBLIC_APP_URL` to your Vercel domain)
4. Deploy

### 3. Post-Deployment

1. Update Supabase **URL Configuration** with your Vercel production domain
2. Update Supabase **Magic Link email template** (if not done already)
3. Add Vercel domain to Google OAuth **Authorized redirect URIs** (if using Google login)

---

## Environment Variables Reference

| Variable                         | Description                              | Required |
|----------------------------------|------------------------------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL                     | ✅       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase publishable key                 | ✅       |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase secret key (server only)        | ✅       |
| `DATABASE_URL`                   | PostgreSQL connection string (via Connect button) | ✅ |
| `NEXT_PUBLIC_APP_URL`            | Your app's base URL                      | ✅       |

---

## Demo Walkthrough

1. **Sign up** with any email (Magic Link) or Google
2. Go to **Admin Panel** → enter your email, select items, award yourself tokens
3. Check **Dashboard** to see updated stats and streak
4. Browse **Rewards Marketplace** and redeem tokens
5. View **History** to see all recycling entries
6. Check **Leaderboard** to see campus rankings
7. Visit **Profile** to view your wallet and milestones

---

## Token Values

| Item            | Tokens |
|-----------------|--------|
| Plastic Bottle  | 5      |
| Aluminum Can    | 5      |
| Glass Bottle    | 7      |
| Paper           | 3      |
| Cardboard       | 4      |
| Electronics     | 15     |
| Textile         | 10     |
| Compost         | 3      |
| Other           | 2      |

---

## Extending the Project

- **Smart bin integration** — Replace admin panel with IoT sensor webhooks
- **Push notifications** — Streak reminders via Supabase Realtime
- **Social sharing** — Share achievements on social media
- **Multi-campus support** — University federation with org-level admin
- **Analytics dashboard** — Admin charts with recharts/d3
- **Mobile app** — Wrap with Capacitor or React Native

---

## License

MIT — Built for campus sustainability initiatives.
