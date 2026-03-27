import type { Metadata } from "next";

// Rendered: "Our Craftsmanship — From Design to Assembly | SMYRNA & Co" = 57 chars
export const metadata: Metadata = {
  title: "Our Craftsmanship — From Design to Assembly",
  description:
    "How SMYRNA jewelry is made — from concept design and casting through electroplating, colour printing and hand assembly. Ancient craft, modern method.",
  keywords: [
    "jewelry making process", "handcrafted jewelry production", "jewelry design process",
    "lost wax casting", "electroplating jewelry", "jewelry printing",
    "hand assembled jewelry", "artisan craftsmanship", "jewelry manufacturing",
    "brass casting", "jewelry plating process", "jewelry handiwork",
  ],
  openGraph: {
    title: "Our Craftsmanship — From Design to Assembly — SMYRNA",
    description:
      "How SMYRNA jewelry is made — from concept design and casting through electroplating, colour printing and hand assembly. Ancient craft, modern method.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Craftsmanship — From Design to Assembly — SMYRNA",
    description:
      "How SMYRNA jewelry is made — from concept design and casting through electroplating, colour printing and hand assembly. Ancient craft, modern method.",
  },
  alternates: {
    canonical: "https://smyrnajewelry.com/how-we-do-it",
  },
};

export default function HowWeDoItLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
