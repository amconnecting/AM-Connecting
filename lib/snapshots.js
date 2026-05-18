import { createSupabaseServerClient } from "@/lib/supabaseServer";

const snapshotsTable = "decision_snapshots";

export async function saveDecisionSnapshot(input) {
  const { snapshot, errors } = validateDecisionSnapshot(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(snapshotsTable)
    .insert(snapshot)
    .select("*")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, snapshot: data };
}

export async function getDecisionSnapshots() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(snapshotsTable)
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getDecisionSnapshotByGroupId(groupId) {
  const normalizedGroupId = cleanText(groupId);
  if (!normalizedGroupId) return null;

  const snapshots = await getDecisionSnapshots();
  const groupName = toGroupName(normalizedGroupId);
  return snapshots.find((snapshot) => snapshot.groupId === normalizedGroupId || snapshot.groupName === groupName) || null;
}

export function validateDecisionSnapshot(input) {
  const snapshot = {
    groupId: cleanText(input.groupId),
    groupName: cleanText(input.groupName),
    mainPriority: cleanText(input.mainPriority),
    biggestTradeOff: cleanText(input.biggestTradeOff),
    temporaryDirection: cleanText(input.temporaryDirection),
    collaborationInsight: cleanText(input.collaborationInsight),
    boardPhotoUrl: cleanText(input.boardPhotoUrl || input.boardPhotoName),
    boardPhotoName: cleanText(input.boardPhotoName || input.boardPhotoUrl)
  };

  const errors = {};
  if (!snapshot.groupId) errors.groupId = "Group ID is required.";
  if (!snapshot.groupName) errors.groupName = "Group name is required.";
  if (!snapshot.mainPriority) errors.mainPriority = "Main priority is required.";
  if (!snapshot.biggestTradeOff) errors.biggestTradeOff = "Biggest trade-off is required.";
  if (!snapshot.temporaryDirection) errors.temporaryDirection = "Temporary direction is required.";
  if (!snapshot.collaborationInsight) errors.collaborationInsight = "Collaboration insight is required.";

  return { snapshot, errors };
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function toGroupName(groupId) {
  const match = String(groupId || "").match(/(\d+)$/);
  return match ? `Group ${match[1]}` : groupId;
}
