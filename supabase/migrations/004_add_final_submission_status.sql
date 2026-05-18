alter table public.decision_snapshots
  add column if not exists "finalSubmissionReceived" boolean not null default false,
  add column if not exists "finalSubmissionReceivedAt" timestamptz;
