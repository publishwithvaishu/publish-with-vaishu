/**
 * Minimal, dependency-free bar chart in the storefront design language
 * (hairlines, ink bars, no heavy shadows). Hover a bar for its exact value.
 */
export function BarChart({
  data,
  formatValue,
  ariaLabel,
}: {
  data: { label: string; value: number }[];
  formatValue: (v: number) => string;
  ariaLabel: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const step = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div>
      <div
        className="flex h-44 items-end gap-1 border-b border-hairline"
        role="img"
        aria-label={ariaLabel}
      >
        {data.map((d, i) => (
          <div
            key={i}
            className="group relative flex flex-1 cursor-default flex-col justify-end"
            title={`${d.label}: ${formatValue(d.value)}`}
          >
            <div
              className="w-full rounded-t bg-ink/80 transition-colors group-hover:bg-ink"
              style={{
                height: `${Math.max((d.value / max) * 100, d.value > 0 ? 3 : 0)}%`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 truncate text-center text-[9px] text-muted"
          >
            {i % step === 0 ? d.label : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
