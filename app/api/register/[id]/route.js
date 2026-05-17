import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteParticipant } from "@/lib/participants";

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const result = await deleteParticipant(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
