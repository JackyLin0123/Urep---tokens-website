-- ═══════════════════════════════════════════════
-- EcoToken — Education Hub Schema
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- ── Quiz completion tracking ────────────────────

CREATE TABLE user_quiz_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id         TEXT NOT NULL,
  score           INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  tokens_earned   INTEGER NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, quiz_id)
);

CREATE INDEX idx_quiz_results_user ON user_quiz_results(user_id);

-- ── Video watch tracking ────────────────────────

CREATE TABLE user_watched_videos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id        TEXT NOT NULL,
  tokens_earned   INTEGER NOT NULL DEFAULT 0,
  watched_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, video_id)
);

CREATE INDEX idx_watched_videos_user ON user_watched_videos(user_id);

-- ── Row Level Security ──────────────────────────

ALTER TABLE user_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watched_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz results"
  ON user_quiz_results FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own quiz results"
  ON user_quiz_results FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own watched videos"
  ON user_watched_videos FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own watched videos"
  ON user_watched_videos FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
