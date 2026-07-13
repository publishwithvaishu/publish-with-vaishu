import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Publisher } from "@/lib/types";

export interface PublisherWrite {
  name: string;
  designation: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  display_order: number;
  active: boolean;
  photo?: string | null;
}

export async function getPublishers(): Promise<Publisher[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("publishers")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Publisher[]) ?? [];
}

export async function getPublisherDetail(
  id: string,
): Promise<Publisher | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("publishers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Publisher) ?? null;
}

export async function createPublisher(write: PublisherWrite): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("publishers")
    .insert(write)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function updatePublisher(
  id: string,
  write: PublisherWrite,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const patch: Record<string, unknown> = { ...write };
  // Keep the existing photo when no new file was uploaded.
  if (write.photo === undefined) delete patch.photo;
  const { error } = await supabase
    .from("publishers")
    .update(patch)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deletePublisher(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("publishers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
