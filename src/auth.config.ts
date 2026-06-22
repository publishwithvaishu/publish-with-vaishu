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
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "customer" | undefined;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = request.nextUrl;

      // Admin area: require the admin role; redirect others to admin login.
      if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") return true;
        if (role === "admin") return true;
        return Response.redirect(new URL("/admin/login", request.nextUrl));
      }

      // Customer-protected areas (unchanged): require any signed-in user.
      const isProtected = PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      );
      if (isProtected) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
