create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  "contextText" text not null,
  "followUpQuestions" jsonb not null default '[]'::jsonb,
  "createdAt" timestamptz not null default now()
);

alter table public.simulations enable row level security;

alter table public.groups
  add column if not exists "simulationId" uuid references public.simulations(id) on delete set null;

alter table public.decision_snapshots
  add column if not exists "simulationId" uuid references public.simulations(id) on delete set null;

alter table public.final_submissions
  add column if not exists "simulationId" uuid references public.simulations(id) on delete set null;

create index if not exists simulations_created_at_idx on public.simulations ("createdAt" desc);
create index if not exists groups_simulation_id_idx on public.groups ("simulationId");
create index if not exists decision_snapshots_simulation_id_idx on public.decision_snapshots ("simulationId");
create index if not exists final_submissions_simulation_id_idx on public.final_submissions ("simulationId");
