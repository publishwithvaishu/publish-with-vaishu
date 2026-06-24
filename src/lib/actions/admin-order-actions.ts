"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { adminUpdateOrderStatus } from "@/lib/admin/orders";
import type { ActionState } from "@/lib/forms/types";
import type { OrderStatus } from "@/lib/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const statusEnum = z.enum([
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
]);

const schema = z.object({
  id: z.string().regex(UUID_RE, "Invalid order"),
  status: statusEnum,
  note: z.string().trim().max(300).optional().or(z.literal("")),
  courier_name: z.string().trim().max(120).optional().or(z.literal("")),
  tracking_number: z.string().trim().max(120).optional().or(z.literal("")),
  tracking_url: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "Enter a valid URL")
    .optional()
    .or(z.literal("")),
});

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

export async function updateOrderStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    id: str(formData, "id"),
    status: str(formData, "status"),
    note: str(formData, "note"),
    courier_name: str(formData, "courier_name"),
    tracking_number: str(formData, "tracking_number"),
    tracking_url: str(formData, "tracking_url"),
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { error: first };
  }

  const d = parsed.data;
  try {
    await adminUpdateOrderStatus(d.id, {
      status: d.status as OrderStatus,
      note: d.note || null,
      // Only send courier fields when shipping (keeps other transitions clean).
      ...(d.status === "shipped"
        ? {
            courier_name: d.courier_name || null,
            tracking_number: d.tracking_number || null,
            tracking_url: d.tracking_url || null,
          }
        : {}),
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not update order.",
    };
  }

  revalidatePath(`/admin/orders/${d.id}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${d.id}`);
  return { ok: true, success: `Order marked as ${d.status}.` };
}
