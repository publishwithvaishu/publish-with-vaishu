"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  fieldErrors,
} from "@/lib/auth/validation";
import { createUser, emailExists, getUserByEmail, setPassword } from "@/lib/auth/users";
import { createToken, consumeToken } from "@/lib/auth/tokens";
import { sendEmail, verifyEmailContent, resetPasswordContent } from "@/lib/email/mailer";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { getSiteUrl } from "@/lib/site-url";
import type { ActionState } from "@/lib/forms/types";

const siteUrl = () => getSiteUrl();
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

async function sendVerificationEmail(userId: string, email: string) {
  const token = await createToken({
    userId,
    email,
    type: "verify",
    ttlMinutes: 60 * 24,
  });
  const url = `${siteUrl()}/verify-email?token=${token}`;
  const content = verifyEmailContent(url);
  await sendEmail({ to: email, ...content });
}

// ---------------------------------------------------------------------------
//  Register
// ---------------------------------------------------------------------------
export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ip = await getClientIp();
  const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.success) {
    return { error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` };
  }

  const parsed = registerSchema.safeParse({
    name: str(formData, "name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    password: str(formData, "password"),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrors(parsed.error) };
  }

  const { name, email, phone, password } = parsed.data;

  if (await emailExists(email)) {
    return { fieldErrors: { email: "An account with this email already exists." } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    phone: phone || null,
    passwordHash,
  });

  // Never let an email-provider issue (outage, unverified sender domain, etc.)
  // fail an otherwise-successful registration. The account is created; the user
  // can request a fresh verification link from their account page.
  try {
    await sendVerificationEmail(user.id, email);
  } catch (e) {
    console.error("Verification email failed to send:", e);
  }

  // Send them to sign in (also signals the verification email was sent).
  redirect("/login?registered=1");
}

// ---------------------------------------------------------------------------
//  Login
// ---------------------------------------------------------------------------
export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ip = await getClientIp();
  const email = str(formData, "email");
  const rl = rateLimit(`login:${ip}:${email}`, 10, 15 * 60 * 1000);
  if (!rl.success) {
    return { error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` };
  }

  const parsed = loginSchema.safeParse({
    email,
    password: str(formData, "password"),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrors(parsed.error) };
  }

  const callbackUrl = str(formData, "callbackUrl") || "/account";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error; // re-throw the redirect
  }
  return {};
}

// ---------------------------------------------------------------------------
//  Logout
// ---------------------------------------------------------------------------
export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

// ---------------------------------------------------------------------------
//  Forgot password — always responds the same way (no email enumeration)
// ---------------------------------------------------------------------------
export async function forgotPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ip = await getClientIp();
  const rl = rateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.success) {
    return { error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` };
  }

  const parsed = forgotPasswordSchema.safeParse({ email: str(formData, "email") });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const user = await getUserByEmail(parsed.data.email);
  if (user) {
    // Keep the response identical whether or not the email actually sends, so
    // an email-provider issue never breaks the flow or leaks account existence.
    try {
      const token = await createToken({
        userId: user.id,
        email: user.email,
        type: "reset",
        ttlMinutes: 60,
      });
      const url = `${siteUrl()}/reset-password?token=${token}`;
      await sendEmail({ to: user.email, ...resetPasswordContent(url) });
    } catch (e) {
      console.error("Password reset email failed to send:", e);
    }
  }

  return {
    success:
      "If an account exists for that email, we've sent a password reset link.",
  };
}

// ---------------------------------------------------------------------------
//  Reset password
// ---------------------------------------------------------------------------
export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: str(formData, "token"),
    password: str(formData, "password"),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrors(parsed.error) };
  }

  const result = await consumeToken(parsed.data.token, "reset");
  if (!result) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const hash = await bcrypt.hash(parsed.data.password, 10);
  await setPassword(result.userId, hash);

  redirect("/login?reset=1");
}
