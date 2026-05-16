import { createSupabaseServerClient } from "@/lib/supabaseServer";

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

  return data || [];
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

export function validateParticipant(input) {
  const participant = {
    company: String(input.company || "").trim(),
    department: String(input.department || "").trim(),
    function: String(input.function || "").trim(),
    name: String(input.name || "").trim(),
    seniority: String(input.seniority || "").trim(),
    officeLocation: String(input.officeLocation || "").trim(),
    email: String(input.email || "").trim().toLowerCase()
  };

  const errors = {};
  if (!participant.company) errors.company = "Company is required.";
  if (!participant.department) errors.department = "Department is required.";
  if (!participant.name) errors.name = "Name is required.";
  if (!participant.email) errors.email = "Email is required.";

  return { participant, errors };
}
