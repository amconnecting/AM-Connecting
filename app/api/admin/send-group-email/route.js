import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { createGroupEmailPayload } from "@/lib/emailDrafts";
import { getGroupOverviewByIdentifier } from "@/lib/groupRecords";
import { isTooLarge, tooLargeResponse } from "@/lib/requestGuards";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
    }

    const input = await request.json().catch(() => ({}));
    if (isTooLarge(input, 5000)) {
      return NextResponse.json(tooLargeResponse(), { status: 413 });
    }

    const groupId = String(input.groupId || "").trim();
    if (!groupId) {
      return NextResponse.json({ ok: false, error: "Group id is required." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || "AM-Connecting <noreply@am-connecting.com>";
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY." }, { status: 500 });
    }

    const group = await getGroupOverviewByIdentifier(groupId);
    if (!group) {
      return NextResponse.json({ ok: false, error: "Group not found." }, { status: 404 });
    }

    const recipients = group.participants
      .map((participant) => String(participant.email || "").trim().toLowerCase())
      .filter(Boolean);

    if (!recipients.length) {
      return NextResponse.json({ ok: false, error: "This group has no participant email addresses." }, { status: 400 });
    }

    const baseUrl = getBaseUrl(request);
    const groupNumber = getGroupNumber(group.groupName);
    const followUpUrl = `${baseUrl}/follow-up/${group.id}`;
    const { subject, text } = createGroupEmailPayload({
      groupNumber,
      groupName: group.groupName,
      group: group.participants,
      simulation: group.simulation,
      teamsLink: input.teamsLink,
      deadline: input.deadline,
      followUpUrl
    });

    for (const recipient of recipients) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from,
          to: recipient,
          subject,
          text
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return NextResponse.json({ ok: false, error: error.message || `Email could not be sent to ${recipient}.` }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, sentTo: recipients.length });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

function getBaseUrl(request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (configuredUrl) {
    return configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`;
  }

  return new URL(request.url).origin;
}

function getGroupNumber(groupName) {
  const match = String(groupName || "").match(/(\d+)$/);
  return match ? Number(match[1]) : "";
}
