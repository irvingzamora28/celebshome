-- supabase/migrations/20250203000000_create_Articles.sql
CREATE TABLE articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  celebrity_id BIGINT NOT NULL REFERENCES celebrities(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  format TEXT NOT NULL,
  sources JSONB,
  local_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);