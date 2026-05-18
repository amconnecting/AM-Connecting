import { NextResponse } from "next/server";
import { saveFinalSubmission } from "@/lib/finalSubmissions";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const input = await request.json().catch(() => ({}));
    const result = await saveFinalSubmission(input);

    if (!result.ok) {
      return NextResponse.json(result, { status: result.errors ? 400 : 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
