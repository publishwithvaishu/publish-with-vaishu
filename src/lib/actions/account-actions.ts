"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireUser } from "@/lib/auth/session";
import { getUserById, updateProfile, setPassword } from "@/lib/auth/users";
import { createToken } from "@/lib/auth/tokens";
import { sendEmail, verifyEmailContent } from "@/lib/email/mailer";
import {
  profileSchema,
  changePasswordSchema,
  fieldErrors,
} from "@/lib/auth/validation";
import type { ActionState } from "@/lib/forms/types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    name: str(formData, "name"),
    phone: str(formData, "phone"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  await updateProfile(user.id, {
    name: parsed.data.name,
    phone: parsed.data.phone || null,
  });
  revalidatePath("/account");
  return { success: "Profile updated." };
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const sessionUser = await requireUser();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: str(formData, "currentPassword"),
    newPassword: str(formData, "newPassword"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const user = await getUserById(sessionUser.id);
  if (!user?.password_hash) {
    return { error: "Unable to update password. Please sign in again." };
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password_hash,
  );
  if (!valid) {
    return { fieldErrors: { currentPassword: "Current password is incorrect." } };
  }

  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  await setPassword(user.id, hash);
  return { success: "Password changed successfully." };
}

export async function resendVerificationAction(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  void prev;
  void formData;
  const sessionUser = await requireUser();
  const user = await getUserById(sessionUser.id);
  if (!user) return { error: "Please sign in again." };
  if (user.email_verified) return { success: "Your email is already verified." };

  const token = await createToken({
    userId: user.id,
    email: user.email,
    type: "verify",
    ttlMinutes: 60 * 24,
  });
  await sendEmail({
    to: user.email,
    ...verifyEmailContent(`${siteUrl()}/verify-email?token=${token}`),
  });
  return { success: "Verification email sent. Check your inbox." };
}
