// Minimal OpenNext config for Cloudflare Pages
// No R2 incremental cache needed — static brand site with no ISR/SSR
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
