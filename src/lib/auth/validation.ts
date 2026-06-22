import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => EMAIL_RE.test(v), "Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

const phoneSchema = z
  .string()
  .trim()
  .max(20, "Phone number is too long")
  .optional()
  .or(z.literal(""));

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: phoneSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordSchema,
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    path: ["newPassword"],
    message: "New password must be different",
  });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Invalid reset link"),
  password: passwordSchema,
});

export const addressSchema = z.object({
  full_name: z.string().trim().min(2, "Enter the recipient's name").max(80),
  mobile: z.string().trim().min(7, "Enter a valid mobile number").max(20),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || EMAIL_RE.test(v), "Enter a valid email")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().min(5, "Enter the street address").max(300),
  city: z.string().trim().min(2, "Enter the city").max(80),
  state: z.string().trim().min(2, "Enter the state").max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  is_default: z.boolean().optional().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;

/** Flatten a ZodError into a { field: message } map for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}
