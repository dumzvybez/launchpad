-- ============================================================
-- Launchpad Certificate Verification — Supabase Schema (v5.76)
-- ============================================================
--
-- Run this in the Supabase SQL Editor to create the certificates table
-- with Row Level Security (RLS) policies.
--
-- Table: certificates
-- Purpose: Stores certificate metadata for public verification.
-- Only public fields are stored — no email, phone, or progress data.
-- ============================================================

-- Create the certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  holder_name TEXT NOT NULL,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('language', 'career')),
  language_completed TEXT,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (required)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Public read access (anon key can SELECT)
-- This allows the verify page to look up any certificate by ID.
CREATE POLICY "Public can read certificates" ON certificates
  FOR SELECT
  USING (true);

-- RLS Policy 2: Only service role can INSERT
-- The anon/publishable key CANNOT insert rows directly.
-- All certificate creation must go through the server-side API endpoint
-- (/api/certificates/create) which uses the service role key.
CREATE POLICY "Only service role can insert certificates" ON certificates
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policy 3: Only service role can UPDATE or DELETE
CREATE POLICY "Only service role can update certificates" ON certificates
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Only service role can delete certificates" ON certificates
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Index for fast lookups by ID (primary key already creates one, but
-- this is explicit for documentation purposes).
CREATE INDEX IF NOT EXISTS idx_certificates_id ON certificates(id);

-- ============================================================
-- Environment Variables (set in Vercel → Project Settings):
--
-- SUPABASE_URL              — your project URL (https://xxx.supabase.co)
-- SUPABASE_ANON_KEY         — publishable key (safe for frontend)
-- SUPABASE_SERVICE_ROLE_KEY — secret key (server-side ONLY)
--
-- The anon key is used for the verify page (read-only).
-- The service role key is used for certificate creation (server-side).
-- ============================================================
