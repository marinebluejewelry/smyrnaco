// ---------------------------------------------------------------------------
// Model path resolver — serves from local /public in dev, CDN in production.
//
// Set NEXT_PUBLIC_MODEL_CDN in your environment (e.g. Vercel dashboard) to
// point at your CDN base URL. When unset, models load from /models/ locally.
//
// Examples:
//   GitHub raw:  https://raw.githubusercontent.com/marinebluejewelry/smyrnaco/main/public/models
//   Cloudflare R2: https://assets.smyrnajewelry.com/models
// ---------------------------------------------------------------------------

const CDN_BASE = process.env.NEXT_PUBLIC_MODEL_CDN || "";

export function modelPath(filename: string): string {
  if (CDN_BASE) return `${CDN_BASE}/${filename}`;
  return `/models/${filename}`;
}

/** Mobile-optimised models — smaller geometry, same filenames. */
export function mobileModelPath(filename: string): string {
  if (CDN_BASE) return `${CDN_BASE.replace("/models", "/models-mobile")}/${filename}`;
  return `/models-mobile/${filename}`;
}
