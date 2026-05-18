import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { normalizeParticipantRecord } from "@/lib/participantNormalization";

const groupsTable = "groups";
const groupMembersTable = "group_members";
const participantsTable = "participants";
const snapshotsTable = "decision_snapshots";
const finalSubmissionsTable = "final_submissions";

export async function saveGeneratedGroupRecords(generatedGroups) {
  const supabase = createSupabaseServerClient();
  const savedGroups = [];

  for (const [index, participants] of generatedGroups.entries()) {
    if (!participants.length) continue;

    const company = participants[0].company || "Unknown";
    const groupName = `Group ${index + 1}`;
    const { data: group, error: groupError } = await supabase
      .from(groupsTable)
      .insert({ company, groupName })
      .select("*")
      .single();

    if (groupError) {
      throw new Error(groupError.message);
    }

    const memberRows = participants
      .filter((participant) => participant.id)
      .map((participant) => ({
        groupId: group.id,
        participantId: participant.id
      }));

    if (memberRows.length) {
      const { error: membersError } = await supabase
        .from(groupMembersTable)
        .insert(memberRows);

      if (membersError) {
        throw new Error(membersError.message);
      }
    }

    savedGroups.push({ ...group, participants });
  }

  return savedGroups;
}

export async function getAdminGroupOverview() {
  const supabase = createSupabaseServerClient();
  const [groupsResult, membersResult, participantsResult, snapshotsResult, submissionsResult] = await Promise.all([
    supabase.from(groupsTable).select("*").order("createdAt", { ascending: false }),
    supabase.from(groupMembersTable).select("*"),
    supabase.from(participantsTable).select("*"),
    supabase.from(snapshotsTable).select("*").order("createdAt", { ascending: false }),
    supabase.from(finalSubmissionsTable).select("*").order("createdAt", { ascending: false })
  ]);

  const error = groupsResult.error || membersResult.error || participantsResult.error || snapshotsResult.error || submissionsResult.error;
  if (error) {
    throw new Error(error.message);
  }

  const participantsById = new Map((participantsResult.data || []).map((participant) => [
    participant.id,
    normalizeParticipantRecord(participant)
  ]));
  const membersByGroupId = groupBy(membersResult.data || [], "groupId");
  const snapshots = snapshotsResult.data || [];
  const submissions = submissionsResult.data || [];

  return (groupsResult.data || []).map((group) => ({
    ...group,
    participants: (membersByGroupId[group.id] || [])
      .map((member) => participantsById.get(member.participantId))
      .filter(Boolean),
    snapshot: findByGroup(snapshots, group),
    finalSubmission: findByGroup(submissions, group)
  }));
}

function findByGroup(items, group) {
  return items.find((item) => item.groupId === group.id || item.groupId === group.groupName || item.groupName === group.groupName) || null;
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key];
    groups[value] ||= [];
    groups[value].push(item);
    return groups;
  }, {});
}
