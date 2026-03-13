import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { BottomMenu } from "@/app/components/dom/BottomMenu";
import { ShopNowCTA } from "@/app/components/dom/ShopNowCTA";
import "./globals.css";

// ---------------------------------------------------------------------------
// Fonts — Inter (body sans) + Playfair Display (headline serif).
// Both exposed as CSS custom properties for use across all components.
// ---------------------------------------------------------------------------

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMYRNA — Brand Showcase",
  description:
    "A high-end immersive brand showcase featuring 3D visuals and scroll-driven storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased flex flex-col min-h-screen`}>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <ShopNowCTA />
        <BottomMenu />
      </body>
    </html>
  );
}
