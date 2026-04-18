-- ═══════════════════════════════════════════════
-- EcoToken — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- ── Enums ────────────────────────────────────────

CREATE TYPE "ItemType" AS ENUM (
  'PLASTIC_BOTTLE', 'ALUMINUM_CAN', 'GLASS_BOTTLE',
  'PAPER', 'CARDBOARD', 'ELECTRONICS',
  'TEXTILE', 'COMPOST', 'OTHER'
);

CREATE TYPE "RewardCategory" AS ENUM (
  'SERVICE_HOURS', 'FOOD_VOUCHER', 'MERCHANDISE', 'EXPERIENCE'
);

CREATE TYPE "RedemptionStatus" AS ENUM (
  'PENDING', 'FULFILLED', 'EXPIRED', 'CANCELLED'
);

-- ── Users ────────────────────────────────────────

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  name            TEXT,
  avatar_url      TEXT,
  university      TEXT,
  token_balance   INTEGER DEFAULT 0,
  total_recycled  INTEGER DEFAULT 0,
  current_streak  INTEGER DEFAULT 0,
  longest_streak  INTEGER DEFAULT 0,
  last_recycled_at TIMESTAMPTZ,
  is_admin        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Recycling Logs ──────────────────────────────

CREATE TABLE recycling_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type       "ItemType" NOT NULL,
  quantity        INTEGER DEFAULT 1,
  tokens_earned   INTEGER NOT NULL,
  bin_location    TEXT,
  verified_by     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recycling_logs_user ON recycling_logs(user_id);
CREATE INDEX idx_recycling_logs_date ON recycling_logs(created_at);

-- ── Rewards Catalog ─────────────────────────────

CREATE TABLE rewards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        "RewardCategory" NOT NULL,
  token_cost      INTEGER NOT NULL,
  image_url       TEXT,
  stock           INTEGER,
  is_active       BOOLEAN DEFAULT TRUE,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Redemptions ─────────────────────────────────

CREATE TABLE redemptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id       UUID NOT NULL REFERENCES rewards(id),
  tokens_cost     INTEGER NOT NULL,
  status          "RedemptionStatus" DEFAULT 'PENDING',
  code            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_redemptions_user ON redemptions(user_id);

-- ── Row Level Security ──────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycling_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can read their own recycling logs
CREATE POLICY "Users can view own logs"
  ON recycling_logs FOR SELECT USING (auth.uid()::text = user_id::text);

-- All authenticated users can view rewards
CREATE POLICY "Anyone can view active rewards"
  ON rewards FOR SELECT USING (is_active = true);

-- Users can view their own redemptions
CREATE POLICY "Users can view own redemptions"
  ON redemptions FOR SELECT USING (auth.uid()::text = user_id::text);

-- ── Seed Rewards Catalog ────────────────────────

INSERT INTO rewards (name, description, category, token_cost, stock, metadata) VALUES
  ('Community Service Certificate — 2 Hours', 'Official certificate recognizing 2 hours of environmental community service. Accepted by most university programs.', 'SERVICE_HOURS', 50, NULL, '{"hours": 2}'),
  ('Community Service Certificate — 5 Hours', 'Official certificate recognizing 5 hours of environmental community service.', 'SERVICE_HOURS', 120, NULL, '{"hours": 5}'),
  ('Campus Café $5 Voucher', 'Redeemable at any participating campus café or dining hall.', 'FOOD_VOUCHER', 30, 200, '{"discount": 5, "currency": "USD"}'),
  ('Campus Café $10 Voucher', 'Redeemable at any participating campus café or dining hall.', 'FOOD_VOUCHER', 55, 100, '{"discount": 10, "currency": "USD"}'),
  ('EcoToken T-Shirt', 'Organic cotton t-shirt with the EcoToken logo. Available in S/M/L/XL.', 'MERCHANDISE', 80, 50, '{"sizes": ["S","M","L","XL"]}'),
  ('Reusable Tote Bag', 'Durable canvas tote bag made from recycled materials.', 'MERCHANDISE', 40, 100, null),
  ('Stainless Steel Water Bottle', 'Double-walled insulated 500ml bottle. Keeps drinks cold 24h / hot 12h.', 'MERCHANDISE', 70, 75, '{"capacity_ml": 500}'),
  ('Tree Planting in Your Name', 'We plant a tree through our partner org and send you a certificate with GPS coordinates.', 'EXPERIENCE', 100, NULL, '{"trees": 1}'),
  ('Campus Garden Workshop', 'Join a hands-on workshop at the campus sustainability garden.', 'EXPERIENCE', 25, 20, '{"duration_hours": 2}'),
  ('Bamboo Cutlery Set', 'Portable bamboo fork, knife, spoon, and chopstick set with carrying pouch.', 'MERCHANDISE', 35, 60, null);

-- ── Helper function: update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
