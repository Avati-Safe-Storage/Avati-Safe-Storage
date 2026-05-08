create extension if not exists pgcrypto;

create table if not exists public.quotation_requests (
  id uuid primary key default gen_random_uuid(),
  quotation_id text not null unique,
  full_name text not null,
  phone text not null,
  email text not null,
  storage_type text not null,
  number_of_boxes integer not null default 0,
  estimated_volume numeric not null default 0,
  storage_duration text not null,
  pickup_required boolean not null default false,
  insurance_required boolean not null default false,
  pickup_location text,
  additional_notes text,
  pricing_breakdown jsonb not null,
  total_estimate numeric not null,
  valid_until timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists quotation_requests_email_idx on public.quotation_requests (email);
create index if not exists quotation_requests_created_at_idx on public.quotation_requests (created_at desc);
