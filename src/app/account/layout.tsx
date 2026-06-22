import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { AccountNav } from "@/components/account/AccountNav";
import { requireUser } from "@/lib/auth/session";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware also guards /account/*; this is a defence-in-depth check.
  await requireUser();

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-10 sm:py-14">
          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your account
          </h1>
          <AccountNav />
          <div className="max-w-2xl">{children}</div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
