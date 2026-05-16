import { createClient } from "@supabase/supabase-js";

export async function requireAdmin(request) {
  const token = getBearerToken(request) || request.cookies?.get("am_admin_token")?.value;
  return requireAdminToken(token);
}

export async function requireAdminToken(token) {
  if (!token) {
    return { ok: false, status: 401, error: "Missing admin session." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 500, error: "Missing Supabase auth environment variables." };
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { ok: false, status: 401, error: "Invalid admin session." };
  }

  if (!isAdminUser(data.user)) {
    return { ok: false, status: 403, error: "This user is not an admin." };
  }

  return { ok: true, user: data.user };
}

function getBearerToken(request) {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  return scheme?.toLowerCase() === "bearer" ? token : "";
}

function isAdminUser(user) {
  const adminEmails = String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const role = user.app_metadata?.role || user.user_metadata?.role;
  const email = user.email?.toLowerCase();

  return role === "admin" || adminEmails.includes(email);
}
