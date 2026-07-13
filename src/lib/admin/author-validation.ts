import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const txt = (max = 200) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const authorSchema = z.object({
  name: z.string().trim().min(2, "Enter the author's name").max(120),
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || EMAIL_RE.test(v), "Enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: txt(40),
  designation: txt(120),
  department: txt(120),
  college: txt(160),
  bio: z.string().trim().max(4000).optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
  active: z.coerce.boolean().default(true),
});

export type AuthorFormValues = z.infer<typeof authorSchema>;
