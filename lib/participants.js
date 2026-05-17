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
  const participant = {
    company: normalizeDisplayText(input.company),
    department: normalizeDisplayText(input.department),
    function: normalizeDisplayText(input.function),
    name: normalizePersonName(input.name),
    seniority: normalizeDisplayText(input.seniority),
    officeLocation: normalizeDisplayText(input.officeLocation),
    email: normalizeEmail(input.email),
    privacyAccepted: Boolean(input.privacyAccepted),
    privacyAcceptedAt: input.privacyAccepted ? new Date().toISOString() : null
  };

  const errors = {};
  if (!participant.company) errors.company = "Company is required.";
  if (!participant.department) errors.department = "Department is required.";
  if (!participant.name) errors.name = "Name is required.";
  if (!participant.email) errors.email = "Email is required.";
  if (participant.email && !isValidEmail(participant.email)) errors.email = "Please enter a valid email address.";
  if (!participant.privacyAccepted) errors.privacyAccepted = "Privacy consent is required.";

  return { participant, errors };
}

function normalizeEmail(value) {
  return normalizeWhitespace(value).toLowerCase();
}

function normalizePersonName(value) {
  return titleCase(normalizeWhitespace(value));
}

function normalizeDisplayText(value) {
  const text = normalizeWhitespace(value);
  if (!text) return "";

  return titleCase(text);
}

function normalizeWhitespace(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function titleCase(value) {
  const acronyms = new Set([
    "AI",
    "AML",
    "BNP",
    "CEO",
    "CFO",
    "COO",
    "CTO",
    "ESG",
    "GDPR",
    "HR",
    "ICT",
    "ING",
    "IT",
    "KBC",
    "KYC",
    "R&D"
  ]);

  return value
    .toLowerCase()
    .split(" ")
    .map((word) => {
      const compact = word.replace(/[.,]/g, "").toUpperCase();
      if (acronyms.has(compact)) return compact;
      return word
        .split("-")
        .map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : part)
        .join("-");
    })
    .join(" ");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
