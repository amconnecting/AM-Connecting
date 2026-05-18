create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  "groupName" text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  "groupId" uuid not null references public.groups(id) on delete cascade,
  "participantId" uuid not null references public.participants(id) on delete cascade
);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

alter table public.decision_snapshots
  add column if not exists "boardPhotoUrl" text;

alter table public.final_submissions
  add column if not exists "optionalFileUrl" text;

create index if not exists groups_company_idx on public.groups (company);
create index if not exists groups_created_at_idx on public.groups ("createdAt" desc);
create index if not exists group_members_group_id_idx on public.group_members ("groupId");
create index if not exists group_members_participant_id_idx on public.group_members ("participantId");
create index if not exists decision_snapshots_group_id_idx on public.decision_snapshots ("groupId");
create index if not exists final_submissions_group_id_idx on public.final_submissions ("groupId");
