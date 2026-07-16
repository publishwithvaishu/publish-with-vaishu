import Image from "next/image";

// Deep, on-brand cover tints for the dark theme (used for the typographic
// fallback cover when a book has no uploaded image).
const TINTS = [
  "#151b26",
  "#1a1f2b",
  "#141a25",
  "#181c28",
  "#12171f",
  "#1b2030",
  "#141b22",
  "#171d29",
];

function pickTint(seed: string) {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum = (sum + seed.charCodeAt(i)) % 997;
  return TINTS[sum % TINTS.length];
}

// A real cover is any image URL that is NOT one of our placeholder services.
function isRealCover(url: string | null): url is string {
  if (!url) return false;
  return !url.includes("placehold.co");
}

type Props = {
  title: string;
  coverImage: string | null;
  label?: string | null; // course / category, shown as a small kicker
  author?: string | null;
  variant?: "card" | "detail" | "mini";
  sizes?: string;
  priority?: boolean;
};

/**
 * Book cover. Renders an actual uploaded cover image (e.g. Supabase Storage
 * or Cloudinary) when one exists; otherwise a designed typographic cover so
 * the catalogue never shows empty placeholder blocks.
 */
export function BookCover({
  title,
  coverImage,
  label,
  author,
  variant = "card",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: Props) {
  if (isRealCover(coverImage)) {
    return (
      <Image
        src={coverImage}
        alt={`Cover of ${title}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }

  // Compact cover for small thumbnails (e.g. the cart).
  if (variant === "mini") {
    return (
      <div
        className="flex h-full items-center justify-center p-2 text-center"
        style={{ backgroundColor: pickTint(title) }}
      >
        <span className="line-clamp-3 font-serif text-[10px] leading-tight text-ink">
          {title}
        </span>
      </div>
    );
  }

  const isDetail = variant === "detail";

  return (
    <div
      className="flex h-full flex-col justify-between p-4 sm:p-5"
      style={{ backgroundColor: pickTint(title) }}
    >
      {label && (
        <span
          className={`uppercase tracking-[0.12em] text-muted ${
            isDetail ? "text-xs" : "text-[10px]"
          }`}
        >
          {label}
        </span>
      )}

      <h3
        className={`font-serif text-ink ${
          isDetail
            ? "text-2xl leading-snug"
            : "line-clamp-5 text-[15px] leading-snug"
        }`}
      >
        {title}
      </h3>

      <div className="space-y-1.5">
        <div className="h-px w-8 bg-ink/25" />
        {author && (
          <span
            className={`block text-muted ${isDetail ? "text-sm" : "text-[11px]"}`}
          >
            {author}
          </span>
        )}
        <span
          className={`block uppercase tracking-[0.14em] text-muted/70 ${
            isDetail ? "text-[10px]" : "text-[8px]"
          }`}
        >
          Publish With Vaishu
        </span>
      </div>
    </div>
  );
}
