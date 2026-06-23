"use client";

import { useActionState } from "react";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { initialActionState, type ActionState } from "@/lib/forms/types";
import type { AdminBook } from "@/lib/admin/books";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;
type Option = { id: string; name: string };

export function AdminBookForm({
  action,
  authors,
  categories,
  book,
  submitLabel,
}: {
  action: Action;
  authors: Option[];
  categories: { id: string; name: string }[];
  book?: AdminBook;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  const f = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <FormAlert error={state.error} />
      {book && <input type="hidden" name="id" value={book.id} />}

      <FormField
        label="Title"
        name="title"
        defaultValue={book?.title ?? ""}
        required
        error={f.title}
      />
      <FormField
        label="Subtitle"
        name="subtitle"
        defaultValue={book?.subtitle ?? ""}
        error={f.subtitle}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Author"
          name="author_id"
          defaultValue={book?.author_id ?? ""}
          options={authors}
          placeholder="— None —"
        />
        <Select
          label="Category"
          name="category_id"
          defaultValue={book?.category_id ?? ""}
          options={categories}
          placeholder="— None —"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField
          label="Price (₹)"
          name="price"
          type="number"
          inputMode="numeric"
          defaultValue={book ? String(book.price) : ""}
          required
          error={f.price}
        />
        <FormField
          label="Stock"
          name="stock"
          type="number"
          inputMode="numeric"
          defaultValue={book ? String(book.stock) : "0"}
          error={f.stock}
        />
        <FormField
          label="Pages"
          name="pages"
          type="number"
          inputMode="numeric"
          defaultValue={book?.pages ? String(book.pages) : ""}
          error={f.pages}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="ISBN" name="isbn" defaultValue={book?.isbn ?? ""} error={f.isbn} />
        <FormField label="Edition" name="edition" defaultValue={book?.edition ?? ""} error={f.edition} />
        <FormField label="University" name="university" defaultValue={book?.university ?? ""} error={f.university} />
        <FormField label="Course" name="course" defaultValue={book?.course ?? ""} error={f.course} />
        <FormField label="Semester" name="semester" defaultValue={book?.semester ?? ""} error={f.semester} />
        <FormField label="Language" name="language" defaultValue={book?.language ?? ""} error={f.language} />
        <FormField
          label="Publication date"
          name="publication_date"
          type="date"
          defaultValue={book?.publication_date ?? ""}
          error={f.publication_date}
        />
      </div>

      <div>
        <label htmlFor="field-description" className="block text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="field-description"
          name="description"
          rows={4}
          defaultValue={book?.description ?? ""}
          className="mt-1.5 w-full rounded-xl border border-hairline bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </div>

      {/* Cover upload */}
      <div>
        <label htmlFor="field-cover" className="block text-sm font-medium text-ink">
          Cover image
        </label>
        {book?.cover_image && !book.cover_image.includes("placehold.co") && (
          <p className="mt-1 text-xs text-muted">
            A cover is set. Upload a new file to replace it.
          </p>
        )}
        <input
          id="field-cover"
          name="cover"
          type="file"
          accept="image/*"
          className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ink/90"
        />
        <p className="mt-1 text-xs text-muted">
          PNG or JPG, up to 5 MB. Optional — a typographic cover is used otherwise.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 border-t border-hairline pt-5">
        <Checkbox
          name="is_featured"
          label="Featured on homepage"
          defaultChecked={book?.is_featured ?? false}
        />
        <Checkbox
          name="published"
          label="Published (visible in storefront)"
          defaultChecked={book ? book.published : true}
        />
      </div>

      <SubmitButton pendingText="Saving…">{submitLabel}</SubmitButton>
    </form>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: Option[];
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={`field-${name}`} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={`field-${name}`}
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 h-12 w-full rounded-xl border border-hairline bg-bg px-4 text-sm text-ink focus:border-ink focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-hairline"
      />
      {label}
    </label>
  );
}
