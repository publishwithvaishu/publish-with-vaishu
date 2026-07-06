import type { Metadata } from "next";
import { Inter, Source_Serif_4, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

// Editorial display face for the premium home theme (scoped via .theme-warm).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const siteName = "Publish With Vaishu";
const siteTitle =
  "Publish With Vaishu — Book Publishing in Chennai, India";
const siteDescription =
  "Publish With Vaishu is an academic book publisher in Chennai, India — University of Madras syllabus titles (B.Com, BBA, BCA, M.Sc) and research publications, written by faculty and delivered across India.";
// Default social share image (absolute URL). Replace with a branded 1200×630
// asset when available (see remaining SEO steps).
const ogImage =
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&h=630&q=80";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · Publish With Vaishu",
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  keywords: [
    "Publish With Vaishu",
    "book publishing",
    "book publishing India",
    "book publishing Chennai",
    "Tamil book publishing",
    "self publishing",
    "publish your book",
    "author publishing",
    "ISBN registration",
    "book printing",
    "academic book publisher",
    "University of Madras textbooks",
    "B.Com",
    "BBA",
    "BCA",
    "M.Sc",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "Books & Publishing",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    locale: "en_IN",
    images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

// Site-wide structured data (Organization, WebSite with search, BookStore).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      description: siteDescription,
      email: "support@publishwithvaishu.in",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/books?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BookStore",
      "@id": `${siteUrl}/#bookstore`,
      name: siteName,
      url: siteUrl,
      image: ogImage,
      description: siteDescription,
      priceRange: "₹₹",
      areaServed: "IN",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>{children}</CartProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
