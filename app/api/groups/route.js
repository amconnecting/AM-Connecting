import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { generateGroups } from "@/lib/groups";
import { saveGeneratedGroupRecords } from "@/lib/groupRecords";
import { getParticipants } from "@/lib/participants";
import { normalizeDisplayText } from "@/lib/participantNormalization";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
    }

    const { searchParams } = new URL(request.url);
    const participants = await getParticipants();
    const filtered = filterParticipants(participants, searchParams);
    const groups = generateGroups(filtered, Number(searchParams.get("groupSize") || 5));

    return NextResponse.json({ ok: true, groups });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
    }

    const input = await request.json().catch(() => ({}));
    const groups = generateGroups(input.participants || [], Number(input.groupSize || 5));
    const savedGroups = await saveGeneratedGroupRecords(groups, input.simulation || {});

    return NextResponse.json({ ok: true, groups, savedGroups });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

function filterParticipants(participants, searchParams) {
  const company = normalizeDisplayText(searchParams.get("company"));
  const department = normalizeDisplayText(searchParams.get("department"));
  const seniority = normalizeDisplayText(searchParams.get("seniority"));

  return participants.filter((participant) => {
    return (!company || participant.company === company)
      && (!department || participant.department === department)
      && (!seniority || participant.seniority === seniority);
  });
}
