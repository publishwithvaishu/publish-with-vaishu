"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { publisherSchema } from "@/lib/admin/publisher-validation";
import { fieldErrors } from "@/lib/auth/validation";
import { uploadPublisherPhoto } from "@/lib/admin/storage";
import {
  createPublisher,
  updatePublisher,
  deletePublisher,
  type PublisherWrite,
} from "@/lib/admin/publishers";
import type { ActionState } from "@/lib/forms/types";
import type { PublisherFormValues } from "@/lib/admin/publisher-validation";

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
    designation: str(fd, "designation"),
    bio: str(fd, "bio"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    website: str(fd, "website"),
    linkedin: str(fd, "linkedin"),
    twitter: str(fd, "twitter"),
    instagram: str(fd, "instagram"),
    display_order: str(fd, "display_order"),
    // Unchecked checkboxes are omitted from FormData → empty string → false.
    active: str(fd, "active") === "on" || str(fd, "active") === "true",
  };
}

function buildWrite(v: PublisherFormValues): PublisherWrite {
  return {
    name: v.name.trim(),
    designation: toNull(v.designation),
    bio: toNull(v.bio),
    email: toNull(v.email),
    phone: toNull(v.phone),
    website: toNull(v.website),
    linkedin: toNull(v.linkedin),
    twitter: toNull(v.twitter),
    instagram: toNull(v.instagram),
    display_order: v.display_order,
    active: v.active,
  };
}

export async function createPublisherAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = publisherSchema.safeParse(extract(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  try {
    const photo = await uploadPublisherPhoto(
      formData.get("photo") as File | null,
    );
    const write = buildWrite(parsed.data);
    write.photo = photo; // null when no file
    await createPublisher(write);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not create publisher.",
    };
  }
  revalidatePath("/admin/publishers");
  revalidatePath("/");
  redirect("/admin/publishers");
}

export async function updatePublisherAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) return { error: "Invalid publisher." };

  const parsed = publisherSchema.safeParse(extract(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  try {
    const photo = await uploadPublisherPhoto(
      formData.get("photo") as File | null,
    );
    const write = buildWrite(parsed.data);
    write.photo = photo ?? undefined; // only replace when a new file was uploaded
    await updatePublisher(id, write);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not update publisher.",
    };
  }
  revalidatePath("/admin/publishers");
  revalidatePath(`/admin/publishers/${id}`);
  revalidatePath("/");
  redirect("/admin/publishers");
}

export async function deletePublisherAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) return;

  await deletePublisher(id);
  revalidatePath("/admin/publishers");
  revalidatePath("/");
}
