import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow verification/CI builds to use a separate output directory so a
  // production `next build` never clobbers the running dev server's `.next`
  // cache (which can leave the dev server serving a 404 stylesheet).
  // Run a safe verification build with: NEXT_DIST_DIR=.next-verify next build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      // Real book covers / author photos uploaded to Supabase Storage
      // (public bucket URLs look like https://<ref>.supabase.co/storage/v1/...).
      { protocol: "https", hostname: "*.supabase.co" },
      // Book covers uploaded via Cloudinary (later milestone).
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Hero image.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
