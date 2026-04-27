-- ============================================================================
-- Avery — Supabase Schema
--
-- Run this in the Supabase SQL Editor (Database > SQL Editor) when first
-- setting up. Idempotent — safe to re-run.
--
-- Four tables:
--   sessions     — one row per conversation
--   messages     — one row per user/assistant turn (token + latency telemetry)
--   tool_calls   — one row per tool execution (full audit trail)
--   leads        — denormalized founder-facing pipeline view
-- ============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── sessions ─────────────────────────────────────────────────────────────
create table if not exists sessions (
  id                  uuid primary key default uuid_generate_v4(),
  created_at          timestamptz not null default now(),
  visitor_fingerprint text,
  utm_source          text,
  utm_campaign        text,
  status              text not null default 'active'
                       check (status in ('active','booked','lead_captured','abandoned'))
);

create index if not exists idx_sessions_created_at on sessions(created_at desc);
create index if not exists idx_sessions_status on sessions(status);

-- ─── messages ─────────────────────────────────────────────────────────────
create table if not exists messages (
  id                  bigserial primary key,
  session_id          uuid not null references sessions(id) on delete cascade,
  created_at          timestamptz not null default now(),
  role                text not null check (role in ('user','assistant','system')),
  content             text not null,
  input_tokens        int,
  output_tokens       int,
  cache_read_tokens   int,
  cache_write_tokens  int,
  latency_ms          int
);

create index if not exists idx_messages_session_id on messages(session_id, created_at);

-- ─── tool_calls ───────────────────────────────────────────────────────────
create table if not exists tool_calls (
  id          bigserial primary key,
  session_id  uuid not null references sessions(id) on delete cascade,
  created_at  timestamptz not null default now(),
  tool_name   text not null,
  input       jsonb,
  output      jsonb,
  duration_ms int not null,
  succeeded   boolean not null,
  error       text
);

create index if not exists idx_tool_calls_session_id on tool_calls(session_id, created_at);
create index if not exists idx_tool_calls_tool_name on tool_calls(tool_name, created_at);

-- ─── leads ────────────────────────────────────────────────────────────────
create table if not exists leads (
  id            bigserial primary key,
  session_id    uuid not null references sessions(id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  name          text,
  email         text not null unique,
  reason        text,
  booking_id    bigint,
  booking_time  timestamptz,
  status        text not null default 'lead'
                check (status in ('lead','booked','no_show','closed_won','closed_lost'))
);

create index if not exists idx_leads_status on leads(status, created_at desc);
create index if not exists idx_leads_email on leads(email);

-- ─── Row-Level Security ───────────────────────────────────────────────────
-- Tighten access for the public/anon role: nothing.
-- Service role (used by our /api/chat route) has full access by default.

alter table sessions enable row level security;
alter table messages enable row level security;
alter table tool_calls enable row level security;
alter table leads enable row level security;

-- No public policies — every read/write goes through our server-side service-role client.

-- ─── Convenience view: pipeline ───────────────────────────────────────────
create or replace view pipeline as
select
  l.id                                        as lead_id,
  l.created_at                                as captured_at,
  l.name,
  l.email,
  l.status,
  l.booking_time,
  l.reason,
  s.utm_source,
  s.utm_campaign,
  (select count(*) from messages m where m.session_id = s.id) as message_count,
  (select count(*) from tool_calls t where t.session_id = s.id) as tool_call_count
from leads l
join sessions s on s.id = l.session_id
order by l.created_at desc;
