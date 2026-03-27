import type { Metadata } from "next";

// Rendered: "Our Heritage — Ancient Anatolian Craft Story | SMYRNA & Co" = 58 chars
export const metadata: Metadata = {
  title: "Our Heritage — Ancient Anatolian Craft Story",
  description:
    "SMYRNA is a jewelry house rooted in ancient Anatolian craft traditions. Born in the workshops of Izmir, we bridge millennia of artistry with modern design.",
  keywords: [
    "about SMYRNA", "SMYRNA jewelry history", "Anatolian craft traditions",
    "Izmir jewelry", "Smyrna ancient city", "artisan jewelry brand",
    "handcrafted jewelry story", "responsible jewelry sourcing",
    "Hittite craft heritage", "ancient jewelry heritage",
    "sustainable luxury jewelry", "jewelry brand philosophy",
  ],
  openGraph: {
    title: "Our Heritage — Ancient Anatolian Craft Story — SMYRNA",
    description:
      "SMYRNA is a jewelry house rooted in ancient Anatolian craft traditions. Born in the workshops of Izmir, we bridge millennia of artistry with modern design.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Heritage — Ancient Anatolian Craft Story — SMYRNA",
    description:
      "SMYRNA is a jewelry house rooted in ancient Anatolian craft traditions. Born in the workshops of Izmir, we bridge millennia of artistry with modern design.",
  },
  alternates: {
    canonical: "https://smyrnajewelry.com/about-us",
  },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
