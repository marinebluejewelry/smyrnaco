import type { Metadata } from "next";

// Rendered: "Contact Us — Wholesale & Custom Jewelry Orders | SMYRNA & Co" = 57 chars
export const metadata: Metadata = {
  title: "Contact Us — Wholesale & Custom Jewelry Orders",
  description:
    "Get in touch with SMYRNA for wholesale partnerships, private label production, custom jewelry commissions or general inquiries. We work with brands worldwide.",
  keywords: [
    "contact SMYRNA", "jewelry wholesale inquiry", "custom jewelry order",
    "private label jewelry contact", "jewelry partnership inquiry",
    "handcrafted jewelry wholesale", "jewelry manufacturer contact",
    "SMYRNA & Co contact",
  ],
  openGraph: {
    title: "Contact — Wholesale & Custom Jewelry Orders — SMYRNA",
    description:
      "Get in touch with SMYRNA for wholesale partnerships, private label production, custom jewelry commissions or general inquiries. We work with brands worldwide.",
  },
  twitter: {
    card: "summary",
    title: "Contact — Wholesale & Custom Jewelry Orders — SMYRNA",
    description:
      "Get in touch with SMYRNA for wholesale partnerships, private label production, custom jewelry commissions or general inquiries. We work with brands worldwide.",
  },
  alternates: {
    canonical: "https://smyrnajewelry.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
