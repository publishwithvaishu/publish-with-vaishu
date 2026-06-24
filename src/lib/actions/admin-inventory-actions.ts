"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { adjustStock } from "@/lib/admin/inventory";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const schema = z.object({
  id: z.string().regex(UUID_RE),
  qty: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(1).max(100000),
  ),
  reason: z.string().trim().max(200).optional().or(z.literal("")),
});

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

async function adjust(formData: FormData, sign: 1 | -1): Promise<void> {
  await requireAdmin();
  const parsed = schema.safeParse({
    id: str(formData, "id"),
    qty: str(formData, "qty"),
    reason: str(formData, "reason"),
  });
  if (!parsed.success) return;

  const { id, qty, reason } = parsed.data;
  const defaultReason = sign > 0 ? "Stock added" : "Stock removed";
  await adjustStock(id, sign * qty, reason ? reason : defaultReason);

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/books");
  revalidatePath("/books");
}

export async function addStockAction(formData: FormData): Promise<void> {
  await adjust(formData, 1);
}

export async function removeStockAction(formData: FormData): Promise<void> {
  await adjust(formData, -1);
}
