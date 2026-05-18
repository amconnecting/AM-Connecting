import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminGroupOverview } from "@/lib/groupRecords";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
    }

    const groups = await getAdminGroupOverview();
    return NextResponse.json({ ok: true, groups });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
