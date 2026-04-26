-- Users table (extends Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_spent INTEGER DEFAULT 0, -- minutes
  modules TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Leaderboard view (materialized for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard AS
SELECT 
  u.id,
  u.display_name,
  u.email,
  COALESCE(SUM(up.time_spent), 0) as total_time,
  COUNT(CASE WHEN up.time_spent > 0 THEN 1 END) as active_days,
  MAX(up.date) as last_active
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY u.id, u.display_name, u.email
ORDER BY total_time DESC;

-- Refresh leaderboard function
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Auto-refresh leaderboard trigger
CREATE OR REPLACE FUNCTION trigger_refresh_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM refresh_leaderboard();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh leaderboard on progress updates
DROP TRIGGER IF EXISTS refresh_leaderboard_trigger ON user_progress;
CREATE TRIGGER refresh_leaderboard_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_progress
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_leaderboard();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date ON user_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_time ON leaderboard(total_time DESC);