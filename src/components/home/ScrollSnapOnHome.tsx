"use client";

import { useEffect } from "react";

/**
 * Enables gentle section-to-section scroll-snap ONLY while the home page is
 * mounted (see `html.home-scroll-snap` in globals.css). The class is added
 * on mount and removed on unmount, so navigating to any other page is
 * completely unaffected — no scoping leakage, no functionality touched.
 */
export function ScrollSnapOnHome() {
  useEffect(() => {
    document.documentElement.classList.add("home-scroll-snap");
    return () => {
      document.documentElement.classList.remove("home-scroll-snap");
    };
  }, []);

  return null;
}
