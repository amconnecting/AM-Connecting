import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteExpiredEventData } from "@/lib/retention";

export const runtime = "nodejs";

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") || "";

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized cleanup request." }, { status: 401 });
  }

  try {
    const result = await deleteExpiredEventData();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  try {
    const result = await deleteExpiredEventData();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
