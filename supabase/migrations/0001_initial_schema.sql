-- ============================================================================
-- MatchFlow — Initial multi-tenant schema + Row Level Security
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type tenant_status as enum ('trial', 'active', 'suspended', 'cancelled');
create type user_role as enum ('tenant_admin', 'manager', 'employee', 'viewer');
create type platform_role as enum ('super_admin', 'support');
create type data_source_type as enum ('bank_of_palestine', 'jawwal_pay', 'paypal', 'erp', 'internal_records', 'manual_upload');
create type data_source_status as enum ('connected', 'error', 'disabled', 'pending_setup');
create type transaction_origin as enum ('external', 'internal');
create type transaction_status as enum ('pending', 'matched', 'unmatched', 'flagged');
create type reconciliation_status as enum ('in_progress', 'completed', 'failed');
create type match_status as enum ('matched', 'discrepancy', 'unmatched');
create type match_type as enum ('auto', 'manual');

-- ---------- TENANTS ----------
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status tenant_status not null default 'trial',
  plan text not null default 'starter',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- PLATFORM ADMINS (kept fully separate from tenant users) ----------
create table platform_admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role platform_role not null default 'support',
  created_at timestamptz not null default now()
);

-- ---------- TENANT USER PROFILES ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  full_name text not null,
  email text not null,
  role user_role not null default 'employee',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_tenant_id_idx on profiles(tenant_id);

-- ---------- DATA SOURCES (per-tenant integration configs) ----------
create table data_sources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  type data_source_type not null,
  name text not null,
  status data_source_status not null default 'pending_setup',
  config jsonb not null default '{}'::jsonb, -- non-secret config only; credentials live in Supabase Vault
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index data_sources_tenant_id_idx on data_sources(tenant_id);

-- ---------- TRANSACTIONS (unified ledger: external feeds + internal records) ----------
create table transactions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  data_source_id uuid references data_sources(id) on delete set null,
  origin transaction_origin not null,
  external_id text,               -- id/reference from the source system, used for idempotent ingestion
  amount numeric(18,2) not null,
  currency text not null default 'ILS',
  transaction_date date not null,
  description text,
  raw_data jsonb not null default '{}'::jsonb,
  status transaction_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index transactions_tenant_id_idx on transactions(tenant_id);
create index transactions_tenant_status_idx on transactions(tenant_id, status);
-- Prevent duplicate ingestion of the same external record from the same source
create unique index transactions_source_external_id_uidx
  on transactions(tenant_id, data_source_id, external_id)
  where external_id is not null;

-- ---------- RECONCILIATIONS (a matching run over a period) ----------
create table reconciliations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status reconciliation_status not null default 'in_progress',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index reconciliations_tenant_id_idx on reconciliations(tenant_id);

-- ---------- RECONCILIATION MATCHES (pairings produced by a run) ----------
create table reconciliation_matches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  reconciliation_id uuid not null references reconciliations(id) on delete cascade,
  external_transaction_id uuid references transactions(id) on delete cascade,
  internal_transaction_id uuid references transactions(id) on delete cascade,
  status match_status not null default 'unmatched',
  match_type match_type not null default 'auto',
  confidence_score numeric(5,2),
  discrepancy_amount numeric(18,2),
  notes text,
  matched_by uuid references profiles(id) on delete set null,
  matched_at timestamptz not null default now()
);
create index reconciliation_matches_tenant_id_idx on reconciliation_matches(tenant_id);
create index reconciliation_matches_reconciliation_id_idx on reconciliation_matches(reconciliation_id);

-- ---------- AUDIT LOGS (append-only) ----------
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade, -- null = platform-level action
  actor_id uuid, -- not FK-enforced so logs survive user deletion
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_tenant_id_idx on audit_logs(tenant_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- SECURITY DEFINER so RLS policies can consult profiles/platform_admins
-- without those lookups re-triggering RLS on themselves (avoids recursion).
-- ============================================================================

create or replace function auth_tenant_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select tenant_id from profiles where id = auth.uid();
$$;

create or replace function auth_is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from platform_admins where id = auth.uid());
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table tenants enable row level security;
alter table platform_admins enable row level security;
alter table profiles enable row level security;
alter table data_sources enable row level security;
alter table transactions enable row level security;
alter table reconciliations enable row level security;
alter table reconciliation_matches enable row level security;
alter table audit_logs enable row level security;

-- TENANTS
create policy "tenants_select_own_or_admin" on tenants
  for select using (id = auth_tenant_id() or auth_is_super_admin());

create policy "tenants_all_super_admin" on tenants
  for all using (auth_is_super_admin()) with check (auth_is_super_admin());

-- PLATFORM_ADMINS: visible/manageable only by super admins (or self-read)
create policy "platform_admins_self_or_admin" on platform_admins
  for select using (id = auth.uid() or auth_is_super_admin());

create policy "platform_admins_manage_super_admin" on platform_admins
  for all using (auth_is_super_admin()) with check (auth_is_super_admin());

-- PROFILES
create policy "profiles_select_same_tenant_or_admin" on profiles
  for select using (tenant_id = auth_tenant_id() or auth_is_super_admin());

create policy "profiles_update_self" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_admin_manage" on profiles
  for all using (auth_is_super_admin()) with check (auth_is_super_admin());

-- Tenant-scoped business tables: same isolation pattern throughout
create policy "data_sources_tenant_isolation" on data_sources
  for all using (tenant_id = auth_tenant_id() or auth_is_super_admin())
  with check (tenant_id = auth_tenant_id() or auth_is_super_admin());

create policy "transactions_tenant_isolation" on transactions
  for all using (tenant_id = auth_tenant_id() or auth_is_super_admin())
  with check (tenant_id = auth_tenant_id() or auth_is_super_admin());

create policy "reconciliations_tenant_isolation" on reconciliations
  for all using (tenant_id = auth_tenant_id() or auth_is_super_admin())
  with check (tenant_id = auth_tenant_id() or auth_is_super_admin());

create policy "reconciliation_matches_tenant_isolation" on reconciliation_matches
  for all using (tenant_id = auth_tenant_id() or auth_is_super_admin())
  with check (tenant_id = auth_tenant_id() or auth_is_super_admin());

-- AUDIT LOGS: append-only — no update/delete policy means no one can alter history
create policy "audit_logs_select_tenant_or_admin" on audit_logs
  for select using (tenant_id = auth_tenant_id() or auth_is_super_admin());

create policy "audit_logs_insert_any_authenticated" on audit_logs
  for insert with check (tenant_id = auth_tenant_id() or auth_is_super_admin());

-- ============================================================================
-- updated_at maintenance
-- ============================================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_tenants_updated_at before update on tenants
  for each row execute function set_updated_at();
create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger trg_data_sources_updated_at before update on data_sources
  for each row execute function set_updated_at();
create trigger trg_transactions_updated_at before update on transactions
  for each row execute function set_updated_at();
