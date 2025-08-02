CREATE TABLE IF NOT EXISTS hero_content (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title TEXT NOT NULL,
description TEXT,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Users can view their own hero content
CREATE POLICY "Users can view their own hero content." ON hero_content
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own hero content (only one entry per user)
CREATE POLICY "Users can insert their own hero content." ON hero_content
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own hero content
CREATE POLICY "Users can update their own hero content." ON hero_content
FOR UPDATE USING (auth.uid() = user_id);

-- Optional: Add a unique constraint to ensure only one hero_content entry per user
-- This requires a function and trigger in Supabase, which is more advanced.
-- For simplicity, we'll rely on the UI to manage a single entry for now.

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on each update
CREATE TRIGGER update_hero_content_updated_at
BEFORE UPDATE ON hero_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
