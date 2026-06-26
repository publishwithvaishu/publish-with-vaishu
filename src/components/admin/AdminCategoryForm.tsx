"use client";

import { useActionState } from "react";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { initialActionState, type ActionState } from "@/lib/forms/types";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export function AdminCategoryForm({
  action,
  category,
  submitLabel,
}: {
  action: Action;
  category?: { id: string; name: string; slug: string };
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormAlert error={state.error} />
      {category && <input type="hidden" name="id" value={category.id} />}
      <FormField
        label="Category name"
        name="name"
        defaultValue={category?.name ?? ""}
        required
        error={state.fieldErrors?.name}
        hint="e.g. B.Com, BBA, Conference Proceedings"
      />
      {category && (
        <p className="text-xs text-muted">
          URL slug <code className="text-ink">{category.slug}</code> stays the
          same so storefront links keep working.
        </p>
      )}
      <SubmitButton pendingText="Saving…">{submitLabel}</SubmitButton>
    </form>
  );
}
