import type { NextAuthConfig } from "next-auth";

const PROTECTED_PREFIXES = ["/account", "/orders", "/checkout"];

/**
 * Edge-safe base config (no bcrypt / Node-only imports) — used by middleware
 * for route protection. The Credentials provider is added in `auth.ts`, which
 * runs only in the Node runtime.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id as string;
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isProtected = PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      );
      // Returning false on a protected route redirects to the sign-in page
      // (with a callbackUrl) automatically.
      if (isProtected) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
