import { NextResponse } from "next/server";
import { getParticipantGroupByEmail } from "@/lib/groupRecords";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const input = await request.json().catch(() => ({}));
    const email = String(input.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }

    const group = await getParticipantGroupByEmail(email);
    if (!group) {
      return NextResponse.json({ ok: false, error: "No group found for this email yet." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      group: {
        id: group.id,
        company: group.company,
        groupName: group.groupName,
        participants: group.participants.map((participant) => ({
          name: participant.name,
          function: participant.function,
          team: participant.department
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
