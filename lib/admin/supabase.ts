"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, MEDIA_BUCKET, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

let client: SupabaseClient | null = null;

/** The browser Supabase client for the admin panel, or null when Supabase is not set up yet. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  client ??= createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}

const publicPrefix = () => `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/`;

/** Storage path of an uploaded image, or null for images that are not in our bucket (like /public files). */
export function storagePathFromUrl(url: string): string | null {
  const prefix = publicPrefix();
  return url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) : null;
}

/** Uploads one image and returns its public URL plus its size in pixels. */
export async function uploadImage(file: File, folder: string): Promise<{ url: string; width: number; height: number }> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not set up");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (JPG, PNG or WebP).");
  if (file.size > 10 * 1024 * 1024) throw new Error("This image is bigger than 10 MB. Please use a smaller one.");

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
  const path = `${folder}/${Date.now()}-${base.slice(0, 40)}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);

  let width = 0;
  let height = 0;
  try {
    const bitmap = await createImageBitmap(file);
    width = bitmap.width;
    height = bitmap.height;
    bitmap.close();
  } catch {
    // Size is only needed for the logo and hero photo; skip if the browser can't read it
  }

  return { url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl, width, height };
}

/** Deletes images from storage. Ignores images that live in /public. */
export async function deleteImages(urls: string[]): Promise<void> {
  const supabase = getSupabase();
  const paths = urls.map(storagePathFromUrl).filter((p): p is string => Boolean(p));
  if (!supabase || paths.length === 0) return;
  await supabase.storage.from(MEDIA_BUCKET).remove(paths);
}
