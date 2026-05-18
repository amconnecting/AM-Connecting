import { createSupabaseServerClient } from "@/lib/supabaseServer";

const retentionDays = 60;

export async function deleteExpiredEventData() {
  const supabase = createSupabaseServerClient();
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

  const results = {};

  results.finalSubmissions = await deleteOlderThan(supabase, "final_submissions", cutoffDate);
  results.decisionSnapshots = await deleteOlderThan(supabase, "decision_snapshots", cutoffDate);
  results.groups = await deleteOlderThan(supabase, "groups", cutoffDate);
  results.simulations = await deleteOlderThan(supabase, "simulations", cutoffDate);
  results.participants = await deleteOlderThan(supabase, "participants", cutoffDate);

  return {
    cutoffDate,
    deleted: results
  };
}

async function deleteOlderThan(supabase, table, cutoffDate) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .lt("createdAt", cutoffDate)
    .select("id");

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return data?.length || 0;
}
