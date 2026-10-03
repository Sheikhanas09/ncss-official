// Supabase settings come from environment variables (see .env.example).
// When they are missing, the site simply uses the starter content in /data.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Public storage bucket that holds every uploaded image. */
export const MEDIA_BUCKET = "media";

/** Table with one JSON document per content collection. */
export const CONTENT_TABLE = "site_content";
