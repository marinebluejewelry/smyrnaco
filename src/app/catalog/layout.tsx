import type { Metadata } from "next";

// Rendered: "Bracelets, Necklaces & Earrings Catalog | SMYRNA & Co" = 54 chars
export const metadata: Metadata = {
  title: "Bracelets, Necklaces & Earrings Catalog in 3D — SMYRNA & Co",
  description:
    "Browse SMYRNA's full catalog of handcrafted bracelets, necklaces and earrings. Each piece draws from ancient Anatolian motifs. View every model in 3D.",
  keywords: [
    "jewelry catalog", "handcrafted bracelets", "artisan necklaces", "beaded earrings",
    "Farahavar bracelet", "Simurg necklace", "Hittite jewelry", "Winged Sun bracelet",
    "Haoma bracelet", "Stone Star necklace", "Anahita earrings", "Cunei earrings",
    "electroplated brass", "Japanese glass beads", "Matsuno beads", "Toho beads",
  ],
  openGraph: {
    title: "Bracelets, Necklaces & Earrings Catalog in 3D — SMYRNA & Co",
    description:
      "Browse SMYRNA's full catalog of handcrafted bracelets, necklaces and earrings. Each piece draws from ancient Anatolian motifs. View every model in 3D.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bracelets, Necklaces & Earrings Catalog in 3D — SMYRNA & Co",
    description:
      "Handcrafted bracelets, necklaces, and earrings inspired by ancient heritage. Interactive 3D viewing.",
  },
  alternates: {
    canonical: "https://smyrnajewelry.com/catalog",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
