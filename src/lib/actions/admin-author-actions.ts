"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { authorSchema } from "@/lib/admin/author-validation";
import { fieldErrors } from "@/lib/auth/validation";
import { uploadAuthorPhoto } from "@/lib/admin/storage";
import {
  authorNameExists,
  createAuthor,
  updateAuthor,
  getAuthorBookCount,
  deleteAuthor,
  type AuthorWrite,
} from "@/lib/admin/authors";
import type { ActionState } from "@/lib/forms/types";
import type { AuthorFormValues } from "@/lib/admin/author-validation";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const toNull = (v?: string) => {
  const s = (v ?? "").trim();
  return s === "" ? null : s;
};

function extract(fd: FormData) {
  return {
    name: str(fd, "name"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    designation: str(fd, "designation"),
    department: str(fd, "department"),
    college: str(fd, "college"),
    bio: str(fd, "bio"),
    website: str(fd, "website"),
    linkedin: str(fd, "linkedin"),
    display_order: str(fd, "display_order"),
    // Unchecked checkboxes are omitted from FormData → empty string → false.
    active: str(fd, "active") === "on" || str(fd, "active") === "true",
  };
}

function buildWrite(v: AuthorFormValues): AuthorWrite {
  return {
    name: v.name.trim(),
    email: toNull(v.email),
    phone: toNull(v.phone),
    designation: toNull(v.designation),
    department: toNull(v.department),
    college: toNull(v.college),
    bio: toNull(v.bio),
    website: toNull(v.website),
    linkedin: toNull(v.linkedin),
    display_order: v.display_order,
    active: v.active,
  };
}

export async function createAuthorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = authorSchema.safeParse(extract(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  if (await authorNameExists(parsed.data.name)) {
    return { fieldErrors: { name: "An author with this name already exists." } };
  }

  try {
    const photo = await uploadAuthorPhoto(formData.get("photo") as File | null);
    const write = buildWrite(parsed.data);
    write.photo = photo; // null when no file
    await createAuthor(write);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create author." };
  }
  revalidatePath("/admin/authors");
  revalidatePath("/");
  redirect("/admin/authors");
}

export async function updateAuthorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) return { error: "Invalid author." };

  const parsed = authorSchema.safeParse(extract(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  if (await authorNameExists(parsed.data.name, id)) {
    return { fieldErrors: { name: "An author with this name already exists." } };
  }

  try {
    const photo = await uploadAuthorPhoto(formData.get("photo") as File | null);
    const write = buildWrite(parsed.data);
    write.photo = photo ?? undefined; // only replace when a new file was uploaded
    await updateAuthor(id, write);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not update author." };
  }
  revalidatePath("/admin/authors");
  revalidatePath(`/admin/authors/${id}`);
  revalidatePath("/");
  redirect("/admin/authors");
}

export async function deleteAuthorAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) return;

  // Guard: never delete an author who still has books assigned.
  const count = await getAuthorBookCount(id);
  if (count > 0) return;

  await deleteAuthor(id);
  revalidatePath("/admin/authors");
  revalidatePath("/");
}
