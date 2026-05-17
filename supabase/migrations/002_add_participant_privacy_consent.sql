alter table public.participants
  add column if not exists "privacyAccepted" boolean not null default false,
  add column if not exists "privacyAcceptedAt" timestamptz;

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
    and "privacyAccepted" = true
  );

create index if not exists participants_email_idx on public.participants (email);
