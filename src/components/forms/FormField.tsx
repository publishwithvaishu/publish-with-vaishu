import { cn } from "@/lib/cn";

type Props = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
};

/** Labelled text input with inline error — works in server or client forms. */
export function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  autoComplete,
  required,
  error,
  inputMode,
  hint,
}: Props) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-muted"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-1.5 h-12 w-full rounded-xl border bg-bg px-4 text-sm text-ink shadow-[0_1px_2px_rgba(15,23,42,0.03)] placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-4",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-hairline focus:border-indigo-500 focus:ring-indigo-100",
        )}
      />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
