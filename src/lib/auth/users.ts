import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  phone: string | null;
  email_verified: string | null;
  created_at: string;
}

const USER_COLUMNS =
  "id, name, email, password_hash, phone, email_verified, created_at";

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select(USER_COLUMNS)
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DbUser) ?? null;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select(USER_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DbUser) ?? null;
}

export async function emailExists(email: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return !!data;
}

export async function createUser(input: {
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
}): Promise<DbUser> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      password_hash: input.passwordHash,
    })
    .select(USER_COLUMNS)
    .single();
  if (error) throw new Error(error.message);
  return data as DbUser;
}

export async function updateProfile(
  id: string,
  input: { name: string; phone: string | null },
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("users")
    .update({ name: input.name, phone: input.phone })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setPassword(id: string, hash: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("users")
    .update({ password_hash: hash })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function markEmailVerified(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("users")
    .update({ email_verified: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
