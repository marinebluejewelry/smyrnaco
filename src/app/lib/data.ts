// ---------------------------------------------------------------------------
// Static content store – single source of truth for all page copy & assets.
// No CMS. Every page references this file.
// ---------------------------------------------------------------------------

// ── Shared media types ──────────────────────────────────────────────────────

export interface MediaImage {
  id: string;
  /** Path relative to /public/ — used by next/image */
  src: string;
  alt: string;
  /** Optional caption shown on hover */
  caption?: string;
}

// ── Legacy types (kept for backward compat with unused components) ───────────

export interface HeroContent {
  tagline: string;
  headline: string[];
  description: string;
  cta: { label: string; href: string };
}

export interface ShowcaseSection {
  id: string;
  label: string;
  headline: string;
  body: string;
}

export interface FeatureItem {
  id: string;
  index: string;
  title: string;
  description: string;
}

export interface VideoItem {
  id: string;
  src: string;
  srcWebm?: string;
  poster?: string;
  headline?: string;
  caption?: string;
}

// ── Page-specific content types ─────────────────────────────────────────────

export interface HomeContent {
  /** Path to logo image (PNG/WebP) in /public/images/ */
  logoSrc: string;
  headline: string;
  subtitle: string;
  /** Video A — plays once on load */
  videoIntroSrc: string;
  /** Video B — plays on infinite loop after A ends */
  videoLoopSrc: string;
  /** Poster image shown before intro video loads (improves LCP) */
  videoIntroPoster?: string;
  /** Poster image shown before loop video loads */
  videoLoopPoster?: string;
  /** Mobile-specific intro video (portrait aspect ratio) */
  videoIntroSrcMobile?: string;
  /** Mobile-specific loop video (portrait aspect ratio) */
  videoLoopSrcMobile?: string;
  /** Poster for mobile intro video */
  videoIntroPosterMobile?: string;
  /** Poster for mobile loop video */
  videoLoopPosterMobile?: string;
}

export interface WhoWeAreContent {
  headline: string;
  paragraphs: string[];
  images: MediaImage[];
}

export interface ProcessStep {
  id: string;
  tabLabel: string;
  headline: string;
  body: string;
  /** Path to .mp4 video for this step */
  videoSrc: string;
  /** Poster image shown before video loads (improves page speed) */
  posterSrc?: string;
}

export interface HowWeDoItContent {
  headline: string;
  steps: ProcessStep[];
}

export interface ConceptualizingContent {
  headline: string;
  body: string;
}

// ── Site-wide ───────────────────────────────────────────────────────────────

export interface SiteContent {
  brand: string;
  home: HomeContent;
  whoWeAre: WhoWeAreContent;
  howWeDoIt: HowWeDoItContent;
  conceptualizing: ConceptualizingContent;
  footer: { line: string };
  /** @deprecated Legacy — kept for unused single-page components */
  hero?: HeroContent;
  /** @deprecated Legacy */
  sections?: ShowcaseSection[];
  /** @deprecated Legacy */
  features?: FeatureItem[];
  /** @deprecated Legacy */
  videos?: VideoItem[];
  /** @deprecated Legacy */
  gallery?: { eyebrow: string; heading: string; images: MediaImage[] };
}

// ===========================================================================
// Content
// ===========================================================================

const siteContent: SiteContent = {
  brand: "SMYRNA",

  // ── Homepage ────────────────────────────────────────────────────────────
  home: {
    logoSrc: "/images/smyrna-logo-white.png",
    headline: "Redefine Elegance.",
    subtitle: "Crafted for the Bold",
    videoIntroSrc: "/videos/smyrna-intro.mp4",
    videoLoopSrc: "/videos/smyrna-loop.mp4",
    videoIntroPoster: "",  // TODO: add poster image path
    videoLoopPoster: "",   // TODO: add poster image path
    videoIntroSrcMobile: "",   // TODO: add mobile intro video path
    videoLoopSrcMobile: "",    // TODO: add mobile loop video path
    videoIntroPosterMobile: "", // TODO: add mobile intro poster
    videoLoopPosterMobile: "",  // TODO: add mobile loop poster
  },

  // ── Who We Are ──────────────────────────────────────────────────────────
  whoWeAre: {
    headline: "Who We Are",
    paragraphs: [
      "SMYRNA is a jewelry house rooted in the ancient craft traditions of Anatolia, reimagined through a contemporary lens. We believe that adornment is not decoration — it is identity.",
      "Every piece in our collection is the culmination of hundreds of hours of deliberate refinement. Our artisans work at the intersection of tradition and technology, ensuring every curve, every edge, every finish meets an uncompromising standard.",
      "We source only what the earth offers at its finest — rare alloys, ethically harvested stones, and composites engineered for permanence. The material is never secondary to the form; it is the form.",
    ],
    images: [
      {
        id: "img-detail-1",
        src: "/images/who-we-are-img1.webp",
        alt: "Close-up of surface texture showing brushed metal finish",
        caption: "Brushed alloy — 0.3mm grain, hand-finished.",
      },
      {
        id: "img-detail-2",
        src: "/images/who-we-are-img2.webp",
        alt: "Product silhouette against gradient background",
        caption: "Silhouette study — form reduced to its essence.",
      },
      {
        id: "img-wide-1",
        src: "/images/who-we-are-img3.webp",
        alt: "Panoramic studio shot of the full collection",
        caption: "The complete collection, arranged by material family.",
      },
      {
        id: "img-detail-3",
        src: "/images/who-we-are-img4.webp",
        alt: "Extreme close-up of edge detail",
        caption: "Edge geometry — precision within 0.01mm tolerance.",
      },
      {
        id: "img-detail-4",
        src: "/images/who-we-are-img1.webp",
        alt: "Product in natural light",
        caption: "How light transforms the surface throughout the day.",
      },
    ],
  },

  // ── How We Do It ────────────────────────────────────────────────────────
  howWeDoIt: {
    headline: "How We Do It",
    steps: [
      {
        id: "step-design",
        tabLabel: "Design",
        headline: "Concept to Blueprint",
        body: "Every piece begins as a sketch — a dialogue between intuition and mathematics. Our designers translate abstract ideas into precise technical drawings, balancing organic beauty with structural integrity. Each design undergoes dozens of iterations before it earns a place in production.",
        videoSrc: "/videos/how-we-do-step1.mp4",
        posterSrc: "",  // TODO: add poster image path
      },
      {
        id: "step-casting",
        tabLabel: "Casting",
        headline: "Molten Precision",
        body: "Using the lost-wax casting method perfected over millennia, we transform precious metals into three-dimensional form. Temperature, timing, and material purity are controlled to the fraction of a degree. The result: flawless castings that capture every microscopic detail of the original wax model.",
        videoSrc: "/videos/how-we-do-step2.mp4",
        posterSrc: "",  // TODO: add poster image path
      },
      {
        id: "step-polishing",
        tabLabel: "Polishing",
        headline: "Surface Alchemy",
        body: "Polishing is where raw metal becomes jewelry. Through progressive stages — from coarse abrasion to mirror-finishing compounds — each surface achieves its intended character. Some pieces demand a brushed matte; others, a liquid-chrome reflection. The artisan decides, guided by decades of touch memory.",
        videoSrc: "/videos/how-we-do-step3.mp4",
        posterSrc: "",  // TODO: add poster image path
      },
      {
        id: "step-setting",
        tabLabel: "Setting",
        headline: "Stone Meets Metal",
        body: "Setting is the most nerve-wracking stage: a single slip can shatter a stone worth thousands. Our setters work under magnification, using hand tools to gently coax metal around each gem until it is held with invisible security. The stone should appear to float, defying gravity and expectation.",
        videoSrc: "/videos/how-we-do-step4.mp4",
        posterSrc: "",  // TODO: add poster image path
      },
    ],
  },

  // ── Conceptualizing ─────────────────────────────────────────────────────
  conceptualizing: {
    headline: "Conceptualizing",
    body: "Watch as raw elements assemble into form. This interactive visualization demonstrates the structural logic behind our braided collection — three strands of precious beads weaving together into a unified whole. Scroll to control the assembly. Drag to rotate.",
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footer: {
    line: "SMYRNA — Where Form Meets Purpose",
  },

  // ── Legacy data (kept so old components still compile) ──────────────────
  hero: {
    tagline: "Crafted for the Bold",
    headline: ["Redefine", "Elegance."],
    description: "A showcase of form, material and light — where timeless design meets modern craft.",
    cta: { label: "Explore Collection", href: "#features" },
  },
  sections: [
    { id: "showcase-1", label: "01 — Material", headline: "Sculpted Precision", body: "Every surface is intentional." },
    { id: "showcase-2", label: "02 — Form", headline: "Fluid Structure", body: "Organic curvature meets mathematical certainty." },
    { id: "showcase-3", label: "03 — Light", headline: "Living Reflection", body: "Surfaces breathe with ambient light." },
  ],
  features: [
    { id: "feat-craftsmanship", index: "01", title: "Craftsmanship", description: "Each piece is the result of hundreds of hours of deliberate refinement." },
    { id: "feat-materials", index: "02", title: "Materials", description: "We source only what the earth offers at its finest." },
    { id: "feat-sustainability", index: "03", title: "Sustainability", description: "Luxury without legacy is empty." },
  ],
  videos: [
    { id: "video-hero-reel", src: "/videos/hero-reel.mp4", srcWebm: "/videos/test-1.webm", poster: "/images/video-poster.jpg", headline: "The Making", caption: "A glimpse into the process behind every piece." },
  ],
  gallery: {
    eyebrow: "Visual Diary",
    heading: "Captured in detail.",
    images: [
      { id: "img-detail-1", src: "/images/web_cowrie_pointed_arctic_rust.webp", alt: "Close-up of surface texture", caption: "Brushed alloy — 0.3mm grain." },
      { id: "img-detail-2", src: "/images/web_runes_cowrie_arctic_rust.webp", alt: "Product silhouette", caption: "Silhouette study." },
      { id: "img-wide-1", src: "/images/web_solo_1_duablas_arctic_rust.webp", alt: "Full collection", caption: "Complete collection." },
      { id: "img-detail-3", src: "/images/web_solo_horizon_3_arctic_rust.webp", alt: "Edge detail", caption: "Edge geometry." },
      { id: "img-detail-4", src: "/images/web_cowrie_pointed_arctic_rust.webp", alt: "Natural light", caption: "Light transforms." },
    ],
  },
};

export default siteContent;
