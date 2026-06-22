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
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700",
      )}
    >
      {error ?? success}
    </div>
  );
}
