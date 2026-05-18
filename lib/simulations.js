import { createSupabaseServerClient } from "@/lib/supabaseServer";

const simulationsTable = "simulations";

export const defaultFollowUpContext = {
  title: "AM-Connecting Simulation",
  company: "",
  contextText: "NovaBank notices that older customers increasingly struggle with digital onboarding. Support waiting times continue to rise, and more customer cases move between teams before customers get clarity.",
  followUpQuestions: [
    "Which previous priority still makes sense?",
    "Which assumption should be reconsidered?",
    "Which trade-off has become more difficult?",
    "What should your group adapt?"
  ]
};

export async function createSimulation(input = {}) {
  const simulation = normalizeSimulationInput(input);
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(simulationsTable)
    .insert(simulation)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getSimulations() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(simulationsTable)
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export function normalizeSimulationInput(input = {}) {
  const questions = Array.isArray(input.followUpQuestions)
    ? input.followUpQuestions
    : String(input.followUpQuestions || "")
      .split("\n")
      .map((question) => question.trim())
      .filter(Boolean);

  return {
    title: cleanText(input.title) || defaultFollowUpContext.title,
    company: cleanText(input.company),
    contextText: cleanText(input.contextText) || defaultFollowUpContext.contextText,
    followUpQuestions: questions.length ? questions : defaultFollowUpContext.followUpQuestions
  };
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}
