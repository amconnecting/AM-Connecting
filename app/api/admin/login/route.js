import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request) {
  const { email, password } = await request.json().catch(() => ({}));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ ok: false, error: "Missing Supabase auth environment variables." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ ok: false, error: error?.message || "Could not sign in." }, { status: 401 });
  }

  const admin = await requireAdminToken(data.session.access_token);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const response = NextResponse.json({ ok: true, user: { email: admin.user.email } });
  response.cookies.set("am_admin_token", data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: data.session.expires_in || 3600
  });

  return response;
}
