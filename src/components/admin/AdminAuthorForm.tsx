"use client";

import { useActionState } from "react";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { initialActionState, type ActionState } from "@/lib/forms/types";
import type { Author } from "@/lib/types";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export function AdminAuthorForm({
  action,
  author,
  submitLabel,
}: {
  action: Action;
  author?: Author;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  const f = state.fieldErrors ?? {};
  const hasPhoto = !!author?.photo && !author.photo.includes("placehold.co");

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <FormAlert error={state.error} />
      {author && <input type="hidden" name="id" value={author.id} />}

      <FormField
        label="Name"
        name="name"
        defaultValue={author?.name ?? ""}
        required
        error={f.name}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={author?.email ?? ""}
          error={f.email}
          hint="Authors receive order notifications here"
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={author?.phone ?? ""}
          error={f.phone}
        />
        <FormField
          label="Designation"
          name="designation"
          defaultValue={author?.designation ?? ""}
          error={f.designation}
        />
        <FormField
          label="Department"
          name="department"
          defaultValue={author?.department ?? ""}
          error={f.department}
        />
      </div>

      <FormField
        label="College / Institution"
        name="college"
        defaultValue={author?.college ?? ""}
        error={f.college}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Website"
          name="website"
          defaultValue={author?.website ?? ""}
          error={f.website}
          placeholder="https://…"
        />
        <FormField
          label="LinkedIn"
          name="linkedin"
          defaultValue={author?.linkedin ?? ""}
          error={f.linkedin}
          placeholder="https://…"
        />
      </div>

      <div>
        <label htmlFor="field-bio" className="block text-sm font-medium text-ink">
          Bio
        </label>
        <textarea
          id="field-bio"
          name="bio"
          rows={4}
          defaultValue={author?.bio ?? ""}
          className="mt-1.5 w-full rounded-xl border border-hairline bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="field-photo" className="block text-sm font-medium text-ink">
          Photo
        </label>
        {hasPhoto && (
          <p className="mt-1 text-xs text-muted">
            A photo is set. Upload a new file to replace it.
          </p>
        )}
        <input
          id="field-photo"
          name="photo"
          type="file"
          accept="image/*"
          className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ink/90"
        />
        <p className="mt-1 text-xs text-muted">PNG or JPG, up to 5 MB. Optional.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={String(author?.display_order ?? 0)}
          error={f.display_order}
          hint="Lower shows first in the homepage authors section."
        />
        <div className="flex items-center gap-3 pt-7">
          <input
            id="field-active"
            name="active"
            type="checkbox"
            defaultChecked={author ? author.active : true}
            className="h-4 w-4 rounded border-hairline text-primary focus:ring-primary"
          />
          <label htmlFor="field-active" className="text-sm text-ink">
            Active (visible on the site)
          </label>
        </div>
      </div>

      <SubmitButton pendingText="Saving…">{submitLabel}</SubmitButton>
    </form>
  );
}
