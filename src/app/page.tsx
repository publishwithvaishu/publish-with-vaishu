import { DarkHeader } from "@/components/home/dark/DarkHeader";
import { DarkSearchBar } from "@/components/home/dark/DarkSearchBar";
import { CatalogExplorer } from "@/components/home/dark/CatalogExplorer";
import { DarkAuthors } from "@/components/home/dark/DarkAuthors";
import { DarkPublisher } from "@/components/home/dark/DarkPublisher";
import { DarkServices } from "@/components/home/dark/DarkServices";
import { DarkFooter } from "@/components/home/dark/DarkFooter";
import { DarkMobileNav } from "@/components/home/dark/DarkMobileNav";
import { Reveal } from "@/components/ui/Reveal";
import { getBooks, getCategories } from "@/lib/queries";

// Homepage reads live data per request from Supabase.
export const dynamic = "force-dynamic";

export default function HomePage() {
  // `theme-dark` scopes the premium dark/gold storefront theme to the home
  // page only — every other route (books, cart, checkout, account, admin)
  // keeps its existing look and functionality untouched.
  return (
    <div className="theme-dark min-h-screen bg-canvas">
      <DarkHeader />

      <main className="pb-28 md:pb-4">
        <DarkSearchBar />
        <Storefront />

        <Reveal>
          <DarkAuthors />
        </Reveal>
        <Reveal>
          <DarkPublisher />
        </Reveal>
        <Reveal>
          <DarkServices />
        </Reveal>
      </main>

      <DarkFooter />
      <DarkMobileNav />
    </div>
  );
}

/**
 * Fetches the live catalog with the EXISTING queries (getBooks/getCategories
 * — no new APIs) and hands it to the client-side explorer, which does all
 * filtering/sorting in the browser.
 */
async function Storefront() {
  const [{ books }, categories] = await Promise.all([
    getBooks({ page: 1, pageSize: 100 }),
    getCategories(),
  ]);

  return <CatalogExplorer books={books} categories={categories} />;
}
