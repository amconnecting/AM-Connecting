export function createEmailDraft(groupNumber, group) {
  const memberList = group
    .map((participant) => `- ${participant.name} (${participant.department}, ${participant.function}, ${participant.seniority}) - ${participant.email}`)
    .join("\n");

  return `Subject: Your AM-Connecting Challenge Group

Body:
Hello team,

You have been assigned to Group ${groupNumber} for the AM-Connecting challenge.

Your group members are:
${memberList}

Your challenge:
[challenge title]

Your next step:
Please schedule a short online meeting using the Teams link below:
[Teams link placeholder]

Deadline for digital submission:
[deadline placeholder]

Kind regards,
AM-Connecting`;
}
