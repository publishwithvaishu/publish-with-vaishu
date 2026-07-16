import { cn } from "@/lib/cn";

/** Inline success / error banner for forms. */
export function FormAlert({
  error,
  success,
}: {
  error?: string | null;
  success?: string | null;
}) {
  if (!error && !success) return null;
  const isError = !!error;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        isError
          ? "border-red-400/30 bg-red-500/10 text-red-300"
          : "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
      )}
    >
      {error ?? success}
    </div>
  );
}
