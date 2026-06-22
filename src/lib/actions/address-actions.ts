"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { addressSchema, fieldErrors } from "@/lib/auth/validation";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/auth/addresses";
import type { ActionState } from "@/lib/forms/types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const checked = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return v === "on" || v === "true";
};

function parseAddress(formData: FormData) {
  return addressSchema.safeParse({
    full_name: str(formData, "full_name"),
    mobile: str(formData, "mobile"),
    email: str(formData, "email"),
    address: str(formData, "address"),
    city: str(formData, "city"),
    state: str(formData, "state"),
    pincode: str(formData, "pincode"),
    is_default: checked(formData, "is_default"),
  });
}

export async function addAddressAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = parseAddress(formData);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrors(parsed.error) };
  }
  await createAddress(user.id, parsed.data);
  revalidatePath("/account/addresses");
  return { ok: true, success: "Address added." };
}

export async function updateAddressAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = str(formData, "id");
  if (!id) return { error: "Missing address." };

  const parsed = parseAddress(formData);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrors(parsed.error) };
  }
  await updateAddress(user.id, id, parsed.data);
  revalidatePath("/account/addresses");
  return { ok: true, success: "Address updated." };
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = str(formData, "id");
  if (id) {
    await deleteAddress(user.id, id);
    revalidatePath("/account/addresses");
  }
}

export async function setDefaultAddressAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = str(formData, "id");
  if (id) {
    await setDefaultAddress(user.id, id);
    revalidatePath("/account/addresses");
  }
}
