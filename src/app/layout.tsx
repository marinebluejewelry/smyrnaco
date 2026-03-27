import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import { BottomMenu } from "@/app/components/dom/BottomMenu";
import { ShopNowCTA } from "@/app/components/dom/ShopNowCTA";

import "./globals.css";

// ---------------------------------------------------------------------------
// Font — Questrial (single font sitewide).
// Exposed as CSS custom property for use across all components.
// ---------------------------------------------------------------------------

const questrial = Questrial({
  variable: "--font-sans",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SMYRNA | Handcrafted Concept Jewelry Design & Production",
    template: "%s | SMYRNA",
  },
  description:
    "SMYRNA crafts artisan jewelry inspired by ancient Anatolian heritage. Handmade bracelets, necklaces and earrings in electroplated brass and glass beads.",
  keywords: [
    "SMYRNA", "handcrafted jewelry", "artisan bracelets", "handmade necklaces",
    "earrings", "Anatolian jewelry", "Hittite inspired", "ancient motifs",
    "Farahavar", "Simurg", "beaded bracelets", "electroplated brass jewelry",
    "Japanese glass beads", "luxury handmade jewelry", "wholesale jewelry",
    "jewelry manufacturer", "Izmir jewelry",
  ],
  openGraph: {
    type: "website",
    siteName: "SMYRNA",
    title: "SMYRNA | Handcrafted Concept Jewelry Design & Production",
    description:
      "SMYRNA crafts artisan jewelry inspired by ancient Anatolian heritage. Handmade bracelets, necklaces and earrings in electroplated brass and glass beads.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMYRNA | Handcrafted Concept Jewelry Design & Production",
    description:
      "SMYRNA crafts artisan jewelry inspired by ancient Anatolian heritage. Handmade bracelets, necklaces and earrings in electroplated brass and glass beads.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  alternates: {
    canonical: "https://smyrnajewelry.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${questrial.variable} antialiased flex flex-col overflow-hidden`}>
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
        <ShopNowCTA />
        <BottomMenu />
      </body>
    </html>
  );
}
