export function createEmailDraft(groupNumber, group, options = {}) {
  const simulationTitle = options.simulationTitle || "[simulation title]";
  const teamsLink = options.teamsLink || "[Teams link placeholder]";
  const deadline = options.deadline || "[deadline placeholder]";
  const followUpLink = options.followUpLink || "";
  const memberList = group
    .map((participant) => `- ${participant.name} (${participant.department}, ${participant.function}, ${participant.seniority}) - ${participant.email}`)
    .join("\n");
  const followUpText = followUpLink ? `\nYour follow-up page:\n${followUpLink}\n` : "";

  return `Subject: Your AM-Connecting Simulation Group

Body:
Hello team,

You have been assigned to Group ${groupNumber} for the AM-Connecting business simulation.

Your group members are:
${memberList}

Your simulation:
${simulationTitle}

Your next step:
Please schedule a short online meeting using the Teams link below:
${teamsLink}
${followUpText}

Deadline for preparation or follow-up:
${deadline}

Kind regards,
AM-Connecting`;
}

export function createGroupEmailPayload({ groupNumber, groupName, group, simulation, teamsLink, deadline, followUpUrl }) {
  const subject = "Your AM-Connecting Simulation Group";
  const title = simulation?.title || "AM-Connecting Simulation";
  const memberList = group
    .map((participant) => `- ${participant.name} (${participant.department || "-"}, ${participant.function || "-"}, ${participant.seniority || "-"})`)
    .join("\n");

  const text = `Hello team,

You have been assigned to ${groupName || `Group ${groupNumber}`} for the AM-Connecting business simulation.

Your group members are:
${memberList}

Your simulation:
${title}

Your next step:
Please schedule a short online meeting using the Teams link below:
${teamsLink || "[Teams link placeholder]"}

${followUpUrl ? `Your follow-up page:\n${followUpUrl}\n\n` : ""}Deadline for preparation or follow-up:
${deadline || "[deadline placeholder]"}

Kind regards,
AM-Connecting`;

  return { subject, text };
}
