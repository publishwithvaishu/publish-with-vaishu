import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AddressInput } from "@/lib/auth/validation";

export interface Address {
  id: string;
  user_id: string;
  full_name: string | null;
  mobile: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  is_default: boolean;
  created_at: string;
}

export async function listAddresses(userId: string): Promise<Address[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Address[]) ?? [];
}

export async function getAddress(
  userId: string,
  id: string,
): Promise<Address | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Address) ?? null;
}

/** Clear the default flag on all of a user's addresses (except `keepId`). */
async function clearDefaults(userId: string, keepId?: string) {
  const supabase = getSupabaseAdminClient();
  let q = supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true);
  if (keepId) q = q.neq("id", keepId);
  const { error } = await q;
  if (error) throw new Error(error.message);
}

export async function createAddress(
  userId: string,
  input: AddressInput,
): Promise<Address> {
  const supabase = getSupabaseAdminClient();

  // First address for a user always becomes the default.
  const existing = await listAddresses(userId);
  const makeDefault = input.is_default || existing.length === 0;
  if (makeDefault) await clearDefaults(userId);

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      full_name: input.full_name,
      mobile: input.mobile,
      email: input.email || null,
      address: input.address,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      is_default: makeDefault,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Address;
}

export async function updateAddress(
  userId: string,
  id: string,
  input: AddressInput,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (input.is_default) await clearDefaults(userId, id);

  const { error } = await supabase
    .from("addresses")
    .update({
      full_name: input.full_name,
      mobile: input.mobile,
      email: input.email || null,
      address: input.address,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      is_default: input.is_default ?? false,
    })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function deleteAddress(userId: string, id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const wasDefault = (await getAddress(userId, id))?.is_default;

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  // Promote another address to default if we removed the default one.
  if (wasDefault) {
    const remaining = await listAddresses(userId);
    if (remaining.length > 0) await setDefaultAddress(userId, remaining[0]!.id);
  }
}

export async function setDefaultAddress(
  userId: string,
  id: string,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  await clearDefaults(userId, id);
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}
