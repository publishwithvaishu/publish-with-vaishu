"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

/** Submit button that shows a loading state while the action is pending. */
export function SubmitButton({
  children,
  pendingText = "Please wait…",
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all duration-200 active:scale-[0.99] tap-target disabled:opacity-60 disabled:active:scale-100",
        variant === "primary"
          ? "bg-primary text-white card-soft hover:bg-indigo-700 hover:shadow-md"
          : "border border-hairline text-ink hover:bg-bg-secondary",
        className,
      )}
    >
      {pending && <Spinner />}
      {pending ? pendingText : children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
