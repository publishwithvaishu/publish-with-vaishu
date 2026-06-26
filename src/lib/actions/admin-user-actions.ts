"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { setUserBlocked } from "@/lib/admin/users";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const schema = z.object({
  id: z.string().regex(UUID_RE),
  blocked: z.enum(["true", "false"]),
});

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

export async function toggleBlockUserAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = schema.safeParse({
    id: str(formData, "id"),
    blocked: str(formData, "blocked"),
  });
  if (!parsed.success) return;

  await setUserBlocked(parsed.data.id, parsed.data.blocked === "true");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${parsed.data.id}`);
}
