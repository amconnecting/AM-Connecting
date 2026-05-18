create table if not exists public.final_submissions (
  id uuid primary key default gen_random_uuid(),
  "groupId" text not null,
  "groupName" text not null,
  "finalDirection" text not null,
  "finalPriorities" text not null,
  "finalTradeOffs" text not null,
  "collaborationLessons" text not null,
  "whatTheGroupUnderstoodBetter" text not null,
  "optionalFileName" text,
  "createdAt" timestamptz not null default now()
);

alter table public.final_submissions enable row level security;

drop policy if exists "Allow public final submission" on public.final_submissions;
create policy "Allow public final submission"
  on public.final_submissions
  for insert
  to anon
  with check (
    "groupId" <> ''
    and "groupName" <> ''
    and "finalDirection" <> ''
    and "finalPriorities" <> ''
    and "finalTradeOffs" <> ''
    and "collaborationLessons" <> ''
    and "whatTheGroupUnderstoodBetter" <> ''
  );

create index if not exists final_submissions_group_id_idx on public.final_submissions ("groupId");
create index if not exists final_submissions_created_at_idx on public.final_submissions ("createdAt" desc);
