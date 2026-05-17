export function normalizeRegistrationInput(input) {
  return {
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
}

export function normalizeParticipantRecord(participant) {
  return {
    ...participant,
    company: normalizeDisplayText(participant.company),
    department: normalizeDisplayText(participant.department),
    function: normalizeDisplayText(participant.function),
    name: normalizePersonName(participant.name),
    seniority: normalizeDisplayText(participant.seniority),
    officeLocation: normalizeDisplayText(participant.officeLocation),
    email: normalizeEmail(participant.email)
  };
}

export function normalizeDisplayText(value) {
  const text = normalizeWhitespace(value);
  if (!text) return "";

  return text
    .split(" ")
    .map(normalizeWord)
    .join(" ");
}

export function normalizeEmail(value) {
  return normalizeWhitespace(value).toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizePersonName(value) {
  return normalizeDisplayText(value);
}

function normalizeWhitespace(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeWord(word) {
  const parts = word.split("-");
  return parts.map(normalizeWordPart).join("-");
}

function normalizeWordPart(part) {
  if (!part) return part;

  const clean = part.replace(/[.,]/g, "");
  const upper = clean.toUpperCase();
  const acronyms = getAcronyms();

  if (acronyms.has(upper)) {
    return upper;
  }

  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

function getAcronyms() {
  return new Set([
    "AI",
    "AML",
    "API",
    "B2B",
    "BNP",
    "CEO",
    "CFO",
    "COO",
    "CRM",
    "CTO",
    "ESG",
    "FAQ",
    "GDPR",
    "HR",
    "ICT",
    "ING",
    "IT",
    "KBC",
    "KPI",
    "KYC",
    "MVP",
    "PR",
    "QA",
    "R&D",
    "ROI",
    "SDR",
    "SEO",
    "UI",
    "UX",
    "VAT"
  ]);
}
