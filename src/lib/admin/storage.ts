import "server-only";
import { randomUUID } from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "covers";

async function ensureBucket() {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
    });
    // Ignore "already exists" races.
    if (error && !/exist/i.test(error.message)) throw new Error(error.message);
  }
}

/**
 * Upload an image to the public `covers` Supabase Storage bucket and return
 * its public URL. Returns null when no file is provided.
 */
async function uploadImage(
  file: File | null,
  label: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) {
    throw new Error(`${label} must be an image file.`);
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`${label} must be under 5 MB.`);
  }

  await ensureBucket();
  const supabase = getSupabaseAdminClient();

  const ext =
    (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";
  const path = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Upload a book cover. Returns its public URL (null if no file). */
export function uploadCover(file: File | null): Promise<string | null> {
  return uploadImage(file, "Cover");
}

/**
 * Upload additional book images (e.g. back cover) for the detail-page
 * gallery. Skips empty file entries; returns only the successful URLs.
 */
export async function uploadCovers(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const url = await uploadImage(file, "Additional image");
    if (url) urls.push(url);
  }
  return urls;
}

/** Upload an author photo. Returns its public URL (null if no file). */
export function uploadAuthorPhoto(file: File | null): Promise<string | null> {
  return uploadImage(file, "Photo");
}
