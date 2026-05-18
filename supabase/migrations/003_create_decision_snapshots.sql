create table if not exists public.decision_snapshots (
  id uuid primary key default gen_random_uuid(),
  "groupId" text not null,
  "groupName" text not null,
  "mainPriority" text not null,
  "biggestTradeOff" text not null,
  "temporaryDirection" text not null,
  "collaborationInsight" text not null,
  "boardPhotoName" text,
  "createdAt" timestamptz not null default now()
);

alter table public.decision_snapshots enable row level security;

drop policy if exists "Allow public decision snapshot submission" on public.decision_snapshots;
create policy "Allow public decision snapshot submission"
  on public.decision_snapshots
  for insert
  to anon
  with check (
    "groupId" <> ''
    and "groupName" <> ''
    and "mainPriority" <> ''
    and "biggestTradeOff" <> ''
    and "temporaryDirection" <> ''
    and "collaborationInsight" <> ''
  );

create index if not exists decision_snapshots_group_id_idx on public.decision_snapshots ("groupId");
create index if not exists decision_snapshots_created_at_idx on public.decision_snapshots ("createdAt" desc);
