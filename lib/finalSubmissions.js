import { createSupabaseServerClient } from "@/lib/supabaseServer";

const finalSubmissionsTable = "final_submissions";
const snapshotsTable = "decision_snapshots";

export async function saveFinalSubmission(input) {
  const { submission, errors } = validateFinalSubmission(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(finalSubmissionsTable)
    .insert(submission)
    .select("*")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  await markSnapshotFinalReceived(supabase, submission.groupId, submission.groupName);

  return { ok: true, submission: data };
}

export function validateFinalSubmission(input) {
  const submission = {
    groupId: cleanText(input.groupId),
    groupName: cleanText(input.groupName),
    finalDirection: cleanText(input.finalDirection),
    finalPriorities: cleanText(input.finalPriorities),
    finalTradeOffs: cleanText(input.finalTradeOffs),
    collaborationLessons: cleanText(input.collaborationLessons),
    whatTheGroupUnderstoodBetter: cleanText(input.whatTheGroupUnderstoodBetter),
    optionalFileUrl: cleanText(input.optionalFileUrl || input.optionalFileName),
    optionalFileName: cleanText(input.optionalFileName || input.optionalFileUrl)
  };

  const errors = {};
  if (!submission.groupId) errors.groupId = "Group ID is required.";
  if (!submission.groupName) errors.groupName = "Group name is required.";
  if (!submission.finalDirection) errors.finalDirection = "Final direction is required.";
  if (!submission.finalPriorities) errors.finalPriorities = "Final priorities are required.";
  if (!submission.finalTradeOffs) errors.finalTradeOffs = "Final trade-offs are required.";
  if (!submission.collaborationLessons) errors.collaborationLessons = "Collaboration lessons are required.";
  if (!submission.whatTheGroupUnderstoodBetter) errors.whatTheGroupUnderstoodBetter = "What the group understood better is required.";

  return { submission, errors };
}

async function markSnapshotFinalReceived(supabase, groupId, groupName) {
  const now = new Date().toISOString();

  await supabase
    .from(snapshotsTable)
    .update({
      finalSubmissionReceived: true,
      finalSubmissionReceivedAt: now
    })
    .or(`groupId.eq.${groupId},groupName.eq.${groupName}`);
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}
