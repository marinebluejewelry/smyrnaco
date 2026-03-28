import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // Image optimisation — next/image
  // ---------------------------------------------------------------------------
  images: {
    // For static export, images must be unoptimised (no server runtime).
    // Use external tools (squoosh, sharp, imagemagick) to pre-optimise.
    // Remove `unoptimized` if you deploy to Vercel (which has a built-in loader).
    unoptimized: true,

    // Accepted formats — browsers that support these get smaller files
    formats: ["image/avif", "image/webp"],
  },

  // ---------------------------------------------------------------------------
  // Static export — no server runtime needed
  // ---------------------------------------------------------------------------
  // Uncomment for fully static builds (e.g. GitHub Pages, S3, Netlify):
  // output: "export",

  // ---------------------------------------------------------------------------
  // Headers — cache control for static assets still served by Pages.
  // Videos and models are served from R2 CDN (cache headers set there).
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
