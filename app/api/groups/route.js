import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { generateGroups } from "@/lib/groups";
import { getParticipants } from "@/lib/participants";

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
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const input = await request.json().catch(() => ({}));
  const groups = generateGroups(input.participants || [], Number(input.groupSize || 5));

  return NextResponse.json({ ok: true, groups });
}

function filterParticipants(participants, searchParams) {
  const company = searchParams.get("company") || "";
  const department = searchParams.get("department") || "";
  const seniority = searchParams.get("seniority") || "";

  return participants.filter((participant) => {
    return (!company || participant.company === company)
      && (!department || participant.department === department)
      && (!seniority || participant.seniority === seniority);
  });
}
