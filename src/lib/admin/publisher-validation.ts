import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const txt = (max = 200) =>
  z.string().trim().max(max).optional().or(z.literal(""));
const url = (max = 300) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "Enter a valid URL")
    .optional()
    .or(z.literal(""));

export const publisherSchema = z.object({
  name: z.string().trim().min(2, "Enter the publisher's name").max(120),
  designation: txt(120),
  bio: z.string().trim().max(4000).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || EMAIL_RE.test(v), "Enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: txt(40),
  website: url(),
  linkedin: url(),
  twitter: url(),
  instagram: url(),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
  active: z.coerce.boolean().default(true),
});

export type PublisherFormValues = z.infer<typeof publisherSchema>;
