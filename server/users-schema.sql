-- Users Table for Authentication
-- Run this in Supabase SQL Editor

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'readonly')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Add trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy (allow all for now)
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true);

-- Insert sample users with bcrypt password hashes
-- Admin: username=admin, password=FunP@rk201345
-- Viewer: username=viewer, password=FunP@rk201345

INSERT INTO users (username, password_hash, full_name, role) VALUES
('admin', '$2b$10$iB/tw0eBxSW7EXy.uaYBc.RAYXnv/aTQdjrADEtGYrAprCJBnyufC', 'Administrator', 'admin'),
('viewer', '$2b$10$iB/tw0eBxSW7EXy.uaYBc.RAYXnv/aTQdjrADEtGYrAprCJBnyufC', 'Read Only User', 'readonly');
