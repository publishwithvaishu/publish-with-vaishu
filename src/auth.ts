import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { getUserByEmail } from "@/lib/auth/users";
import { loginSchema } from "@/lib/auth/validation";

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
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (adminEmail && adminHash && email === adminEmail) {
          const ok = await bcrypt.compare(password, adminHash);
          if (!ok) return null;
          return {
            id: "admin",
            name: "Administrator",
            email: adminEmail,
            role: "admin",
          };
        }

        // Customer (unchanged).
        const user = await getUserByEmail(email);
        if (!user?.password_hash) return null;

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
