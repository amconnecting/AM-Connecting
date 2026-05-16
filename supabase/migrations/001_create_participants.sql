create extension if not exists "pgcrypto";

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  department text not null,
  "function" text,
  name text not null,
  seniority text,
  "officeLocation" text,
  email text not null,
  "createdAt" timestamptz not null default now()
);

alter table public.participants enable row level security;

drop policy if exists "Allow public participant registration" on public.participants;
create policy "Allow public participant registration"
  on public.participants
  for insert
  to anon
  with check (
    company <> ''
    and department <> ''
    and name <> ''
    and email <> ''
  );

create index if not exists participants_company_idx on public.participants (company);
create index if not exists participants_department_idx on public.participants (department);
create index if not exists participants_seniority_idx on public.participants (seniority);
create index if not exists participants_created_at_idx on public.participants ("createdAt" desc);
