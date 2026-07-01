import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { getUserByEmail } from "@/lib/auth/users";
import { loginSchema } from "@/lib/auth/validation";

// The admin is a single-owner, env-based account with no `users` row. It still
// needs a valid UUID-shaped session id so anything that validates ids (and
// Postgres) never chokes on it. This sentinel id never collides with real users.
const ADMIN_USER_ID = "ad000000-0000-4000-8000-000000000000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Admin: single owner account via env (ADMIN_EMAIL + ADMIN_PASSWORD_HASH).
        // Normalise the hash: hosting env UIs (and some shells) can store a
        // bcrypt hash with backslash-escaped "$" ("\$2b\$..."), or wrapped in
        // quotes. bcrypt.compare then always fails and admin login breaks in
        // production while working locally. Valid bcrypt hashes never contain
        // backslashes or quotes, so stripping them is safe and admin-only.
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminHash = process.env.ADMIN_PASSWORD_HASH?.trim()
          .replace(/^["']|["']$/g, "")
          .replace(/\\/g, "");
        if (adminEmail && adminHash && email === adminEmail) {
          const ok = await bcrypt.compare(password, adminHash);
          if (!ok) return null;
          return {
            id: ADMIN_USER_ID,
            name: "Administrator",
            email: adminEmail,
            role: "admin",
          };
        }

        // Customer (unchanged, except blocked accounts cannot sign in).
        const user = await getUserByEmail(email);
        if (!user?.password_hash) return null;
        if (user.blocked) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "customer",
        };
      },
    }),
  ],
});
