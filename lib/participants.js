import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { isValidEmail, normalizeParticipantRecord, normalizeRegistrationInput } from "@/lib/participantNormalization";

const participantsTable = "participants";

export async function getParticipants() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(participantsTable)
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(normalizeParticipantRecord);
}

export async function saveParticipant(input) {
  const { participant, errors } = validateParticipant(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(participantsTable)
    .insert(participant)
    .select("*")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, participant: data };
}

export async function deleteParticipant(id) {
  const participantId = String(id || "").trim();
  if (!participantId) {
    return { ok: false, error: "Participant id is required." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from(participantsTable)
    .delete()
    .eq("id", participantId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export function validateParticipant(input) {
  const participant = normalizeRegistrationInput(input);

  const errors = {};
  if (!participant.company) errors.company = "Company is required.";
  if (!participant.department) errors.department = "Department is required.";
  if (!participant.name) errors.name = "Name is required.";
  if (!participant.email) errors.email = "Email is required.";
  if (participant.email && !isValidEmail(participant.email)) errors.email = "Please enter a valid email address.";
  if (!participant.privacyAccepted) errors.privacyAccepted = "Privacy consent is required.";

  return { participant, errors };
}
