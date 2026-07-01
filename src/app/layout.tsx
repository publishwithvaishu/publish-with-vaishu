import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";
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

const siteUrl = getSiteUrl();
const siteName = "Publish With Vaishu";
const siteDescription =
  "An academic publishing house bringing University of Madras syllabus titles — B.Com, BBA, BCA, M.Sc and research publications — to students across India.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Publish With Vaishu — Academic Books, Done Right",
    template: "%s · Publish With Vaishu",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "academic books",
    "University of Madras",
    "B.Com",
    "BBA",
    "BCA",
    "M.Sc",
    "textbooks",
    "Publish With Vaishu",
  ],
  openGraph: {
    type: "website",
    siteName,
    title: "Publish With Vaishu — Academic Books, Done Right",
    description: siteDescription,
    url: siteUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Publish With Vaishu — Academic Books, Done Right",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
