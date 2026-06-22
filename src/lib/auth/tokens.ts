import "server-only";
import { randomBytes } from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type TokenType = "verify" | "reset";

/** Create a single-use token for email verification or password reset. */
export async function createToken(params: {
  userId: string;
  email: string;
  type: TokenType;
  ttlMinutes: number;
}): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + params.ttlMinutes * 60 * 1000,
  ).toISOString();

  const { error } = await supabase.from("auth_tokens").insert({
    user_id: params.userId,
    email: params.email.toLowerCase(),
    token,
    type: params.type,
    expires_at: expiresAt,
  });
  if (error) throw new Error(error.message);
  return token;
}

/**
 * Validate and consume a token. Returns the owning user id/email, or null if
 * the token is missing, wrong type, already used, or expired.
 */
export async function consumeToken(
  token: string,
  type: TokenType,
): Promise<{ userId: string; email: string } | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("auth_tokens")
    .select("id, user_id, email, type, expires_at, used_at")
    .eq("token", token)
    .eq("type", type)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  if (data.used_at) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // Mark used (best-effort single use).
  const { error: updateError } = await supabase
    .from("auth_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", data.id)
    .is("used_at", null);
  if (updateError) throw new Error(updateError.message);

  return { userId: data.user_id as string, email: data.email as string };
}
