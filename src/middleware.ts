import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge middleware enforces route protection via the `authorized` callback.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/account/:path*", "/orders/:path*", "/checkout/:path*"],
};
