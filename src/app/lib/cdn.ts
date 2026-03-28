// ---------------------------------------------------------------------------
// CDN path resolver — serves from local /public in dev, CDN in production.
//
// Set NEXT_PUBLIC_CDN in your environment (e.g. Cloudflare Pages dashboard)
// to point at your R2 public URL. When unset, assets load locally.
//
// Example:
//   NEXT_PUBLIC_CDN=https://cdn.smyrnajewelry.com
//   modelPath("foo.glb")  → "https://cdn.smyrnajewelry.com/models/foo.glb"
//   videoPath("bar.mp4")  → "https://cdn.smyrnajewelry.com/videos/bar.mp4"
// ---------------------------------------------------------------------------

const CDN = process.env.NEXT_PUBLIC_CDN || "";

/** Desktop models — full-quality .glb files. */
export function modelPath(filename: string): string {
  return CDN ? `${CDN}/models/${filename}` : `/models/${filename}`;
}

/** Mobile-optimised models — smaller geometry, same filenames. */
export function mobileModelPath(filename: string): string {
  return CDN ? `${CDN}/models-mobile/${filename}` : `/models-mobile/${filename}`;
}

/** Video assets — hero intros, process videos, etc. */
export function videoPath(filename: string): string {
  return CDN ? `${CDN}/videos/${filename}` : `/videos/${filename}`;
}
