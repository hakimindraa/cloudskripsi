-- ==============================================================================
-- CLOUDSKRIPSI: SKEMA DATABASE SUPABASE (POSTGRESQL)
-- 100% Free Tier Compatible
-- Salin dan jalankan script ini di SQL Editor di dashboard Supabase Anda.
-- ==============================================================================

-- 1. PROFILES (Username & Profil Pengguna)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PROJECTS (Mendukung Dual-Workspace: Ruang Kerja Saya & Pasangan)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  owner_label text not null, -- 'Saya' atau 'Pasangan'
  student_name text not null,
  title text not null default 'Judul Skripsi',
  field_of_study text,
  supervisor_1 text,
  supervisor_2 text,
  target_defense_date date,
  current_milestone text default 'BAB 1-3',
  progress_percent integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. DRAFT_REVISIONS (Vault Berkas & Update Progres)
create table if not exists draft_revisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  bab_category text not null, -- 'BAB 1', 'BAB 2', 'BAB 3', 'BAB 4', 'BAB 5', 'FULL', 'LAMPIRAN'
  version_label text not null, -- 'v1.0', 'v2.1'
  file_name text not null,
  file_url text not null, -- Path berkas di Supabase Storage
  file_size_kb integer,
  revision_notes text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. REFERENCES_REPO (Paper Jurnal & URL)
create table if not exists references_repo (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  authors text not null,
  publication_year integer,
  source_url text,
  pdf_url text,
  abstract text,
  target_bab text default 'BAB 2',
  status text default 'to_read', -- 'to_read', 'reading', 'cited'
  apa_citation text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. GPT_NOTES (Arsip Prompt & Sintesis AI)
create table if not exists gpt_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  topic text not null,
  prompt text,
  ai_output text,
  synthesized_note text not null,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. SUPERVISOR_LOGS (Buku Kendali Bimbingan Dosen & Revisi Checklist)
create table if not exists supervisor_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  consultation_date date not null,
  supervisor_name text not null,
  meeting_method text default 'Tatap Muka', -- 'Tatap Muka', 'Email / Chat', 'Zoom'
  feedback_notes text not null,
  action_items jsonb default '[]'::jsonb, -- Array of {id, task, done}
  status text default 'needs_revision', -- 'needs_revision', 'approved'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Aktifkan Row Level Security (RLS) untuk keamanan privasi data
alter table profiles enable row level security;
alter table projects enable row level security;
alter table draft_revisions enable row level security;
alter table references_repo enable row level security;
alter table gpt_notes enable row level security;
alter table supervisor_logs enable row level security;

-- Setup Storage Bucket untuk File Skripsi di Supabase:
-- Buka Dashboard Supabase -> Storage -> New Bucket: 'skripsi-vault' (Public or Authenticated)
