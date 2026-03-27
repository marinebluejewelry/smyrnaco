import type { Metadata } from "next";

// Rendered: "Wholesale Jewelry Partnerships & Collabs | SMYRNA & Co" = 55 chars
export const metadata: Metadata = {
  title: "Wholesale Jewelry Partnerships & Collabs",
  description:
    "SMYRNA partners with brands and retailers worldwide for private label production, custom collections and wholesale handcrafted Anatolian jewelry.",
  keywords: [
    "jewelry partnerships", "wholesale jewelry", "private label jewelry",
    "custom jewelry collections", "Marine Blue Jewelry", "Segara Agung Perthiwi",
    "jewelry manufacturer", "Bali jewelry", "handmade wholesale bracelets",
    "jewelry brand collaboration", "white label jewelry production",
  ],
  openGraph: {
    title: "Wholesale Jewelry Partnerships & Collabs — SMYRNA & Co",
    description:
      "SMYRNA partners with brands and retailers worldwide for private label production, custom collections and wholesale handcrafted Anatolian jewelry.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Jewelry Partnerships & Collabs — SMYRNA & Co",
    description:
      "SMYRNA partners with brands and retailers worldwide for private label production, custom collections and wholesale handcrafted Anatolian jewelry.",
  },
  alternates: {
    canonical: "https://smyrnajewelry.com/partners",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
