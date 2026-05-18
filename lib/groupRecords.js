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

export async function getGroupOverviewByIdentifier(identifier) {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier) return null;

  const groups = await getAdminGroupOverview();
  return groups.find((group, index) => {
    const aliases = getGroupAliases(group, index);
    return aliases.includes(normalizedIdentifier);
  }) || null;
}

export async function getParticipantGroupByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  const groups = await getAdminGroupOverview();
  return groups.find((group) =>
    group.participants.some((participant) => String(participant.email || "").toLowerCase() === normalizedEmail)
  ) || null;
}

function findByGroup(items, group) {
  const aliases = getGroupAliases(group);
  return items.find((item) => {
    const itemAliases = [
      item.groupId,
      item.groupName
    ].flatMap(getIdentifierAliases);

    return itemAliases.some((alias) => aliases.includes(alias));
  }) || null;
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key];
    groups[value] ||= [];
    groups[value].push(item);
    return groups;
  }, {});
}

function getGroupAliases(group, index = null) {
  const aliases = [
    group.id,
    group.groupName
  ];

  const numberFromName = getTrailingNumber(group.groupName);
  if (numberFromName) {
    aliases.push(String(numberFromName), `group-${numberFromName}`, `Group ${numberFromName}`);
  }

  if (index !== null) {
    aliases.push(String(index + 1), `group-${index + 1}`, `Group ${index + 1}`);
  }

  return aliases.map(normalizeIdentifier).filter(Boolean);
}

function normalizeIdentifier(value) {
  return String(value || "").trim().toLowerCase();
}

function getIdentifierAliases(value) {
  const normalized = normalizeIdentifier(value);
  if (!normalized) return [];

  const match = normalized.match(/(\d+)$/);
  const aliases = [normalized];

  if (match) {
    aliases.push(String(Number(match[1])), `group-${Number(match[1])}`, `group ${Number(match[1])}`);
  }

  return [...new Set(aliases)];
}

function getTrailingNumber(value) {
  const match = String(value || "").match(/(\d+)$/);
  return match ? Number(match[1]) : null;
}
