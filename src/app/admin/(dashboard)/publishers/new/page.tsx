import type { Metadata } from "next";
import Link from "next/link";
import { AdminPublisherForm } from "@/components/admin/AdminPublisherForm";
import { createPublisherAction } from "@/lib/actions/admin-publisher-actions";

export const metadata: Metadata = { title: "Add publisher — Admin" };

export default function NewPublisherPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Add publisher
        </h1>
        <Link
          href="/admin/publishers"
          className="text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
      <div className="max-w-3xl rounded-2xl border border-hairline p-6">
        <AdminPublisherForm
          action={createPublisherAction}
          submitLabel="Create publisher"
        />
      </div>
    </div>
  );
}
