import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Called by the admin panel after every save, so the public pages show the change
 * on their next visit instead of waiting for the regular refresh.
 * Only works with the signed-in admin's login token.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return Response.json({ ok: false, error: "Supabase is not set up" }, { status: 503 });

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ ok: false, error: "Not signed in" }, { status: 401 });

  // Ask Supabase whether this login belongs to the admin
  const check = await fetch(`${supabaseUrl}/rest/v1/rpc/is_admin`, {
    method: "POST",
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
  });
  const isAdmin = check.ok && (await check.json()) === true;
  if (!isAdmin) return Response.json({ ok: false, error: "Not allowed" }, { status: 403 });

  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
