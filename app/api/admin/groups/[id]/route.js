import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { updateGroupSimulation } from "@/lib/groupRecords";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
    }

    const { id } = await params;
    const input = await request.json().catch(() => ({}));
    const result = await updateGroupSimulation(id, input.simulationId);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
