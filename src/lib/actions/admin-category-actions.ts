"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  categoryNameExists,
  createCategory,
  updateCategoryName,
  getCategoryBookCount,
  deleteCategory,
} from "@/lib/admin/categories";
import type { ActionState } from "@/lib/forms/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const nameSchema = z.object({
  name: z.string().trim().min(2, "Enter a category name").max(60),
});

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

export async function createCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = nameSchema.safeParse({ name: str(formData, "name") });
  if (!parsed.success) {
    return { fieldErrors: { name: parsed.error.issues[0]?.message } };
  }
  if (await categoryNameExists(parsed.data.name)) {
    return { fieldErrors: { name: "A category with this name already exists." } };
  }

  try {
    await createCategory(parsed.data.name);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create category." };
  }
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) return { error: "Invalid category." };

  const parsed = nameSchema.safeParse({ name: str(formData, "name") });
  if (!parsed.success) {
    return { fieldErrors: { name: parsed.error.issues[0]?.message } };
  }
  if (await categoryNameExists(parsed.data.name, id)) {
    return { fieldErrors: { name: "A category with this name already exists." } };
  }

  try {
    await updateCategoryName(id, parsed.data.name);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not update category." };
  }
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) return;

  // Guard: never delete a category that still has books assigned.
  const count = await getCategoryBookCount(id);
  if (count > 0) return;

  await deleteCategory(id);
  revalidatePath("/admin/categories");
}
