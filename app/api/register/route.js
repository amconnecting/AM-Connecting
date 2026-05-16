import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getParticipants, saveParticipant } from "@/lib/participants";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
    }

    const participants = await getParticipants();
    return NextResponse.json({ ok: true, participants });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const input = await request.json().catch(() => ({}));
    const result = await saveParticipant(input);

    if (!result.ok) {
      return NextResponse.json(result, { status: result.errors ? 400 : 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
