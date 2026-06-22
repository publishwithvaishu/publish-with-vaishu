import type { Metadata } from "next";
import { EditProfileForm } from "@/components/account/EditProfileForm";
import { requireDbUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Edit profile" };

export default async function EditProfilePage() {
  const user = await requireDbUser();

  return (
    <div className="rounded-2xl border border-hairline p-6">
      <h2 className="text-xl font-semibold tracking-tight text-ink">
        Edit profile
      </h2>
      <p className="mt-1 text-sm text-muted">
        Update your name and contact number.
      </p>
      <div className="mt-6">
        <EditProfileForm
          defaultName={user.name}
          defaultPhone={user.phone ?? ""}
        />
      </div>
    </div>
  );
}
