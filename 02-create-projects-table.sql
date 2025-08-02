CREATE TABLE IF NOT EXISTS projects (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
name TEXT NOT NULL,
description TEXT,
status TEXT DEFAULT 'Pending',
start_date DATE,
end_date DATE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Users can view projects associated with their own clients
CREATE POLICY "Users can view projects of their own clients." ON projects
FOR SELECT USING (
  EXISTS (SELECT 1 FROM clients WHERE clients.id = projects.client_id AND clients.user_id = auth.uid())
);

-- Users can insert projects for their own clients
CREATE POLICY "Users can insert projects for their own clients." ON projects
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM clients WHERE clients.id = projects.client_id AND clients.user_id = auth.uid())
);

-- Users can update projects of their own clients
CREATE POLICY "Users can update projects of their own clients." ON projects
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM clients WHERE clients.id = projects.client_id AND clients.user_id = auth.uid())
);

-- Users can delete projects of their own clients
CREATE POLICY "Users can delete projects of their own clients." ON projects
FOR DELETE USING (
  EXISTS (SELECT 1 FROM clients WHERE clients.id = projects.client_id AND clients.user_id = auth.uid())
);
