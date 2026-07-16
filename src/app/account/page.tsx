import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { VerifyEmailBanner } from "@/components/account/VerifyEmailBanner";
import { requireDbUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profile" };

export default async function AccountPage() {
  const user = await requireDbUser();
  const verified = !!user.email_verified;

  const memberSince = new Date(user.created_at).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {!verified && <VerifyEmailBanner />}

      <div className="rounded-2xl border border-hairline p-6">
        <dl className="divide-y divide-hairline">
          <Row label="Name" value={user.name} />
          <Row
            label="Email"
            value={
              <span className="inline-flex items-center gap-2">
                {user.email}
                {verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-200">
                    Unverified
                  </span>
                )}
              </span>
            }
          />
          <Row label="Phone" value={user.phone || "—"} />
          <Row label="Member since" value={memberSince} />
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button href="/account/edit">Edit profile</Button>
        <Button href="/account/addresses" variant="outline">
          Manage addresses
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
