export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading">
        <svg
          className="h-7 w-7 animate-spin text-gold"
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
            className="opacity-20"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}
