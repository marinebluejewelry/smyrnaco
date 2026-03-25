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
  logoSrc: string;
  headline: string;
  subtitle: string;
  videoIntroSrc: string;
  videoLoopSrc: string;
  videoIntroPoster?: string;
  videoLoopPoster?: string;
  videoIntroSrcMobile?: string;
  videoLoopSrcMobile?: string;
  videoIntroPosterMobile?: string;
  videoLoopPosterMobile?: string;
}

// ── Projects (replaces Who We Are) ──────────────────────────────────────────

export interface ProjectTab {
  id: string;
  tabLabel: string;
  headline: string;
  body: string;
  /** Filename of .glb model in /public/models/ */
  modelFilename: string;
}

export interface ProjectCategory {
  id: string;
  /** Display label for the primary tab ("Bracelets", "Necklaces", etc.) */
  label: string;
  tabs: ProjectTab[];
}

export interface ProjectsContent {
  headline: string;
  categories: ProjectCategory[];
}

// ── Partners (new page) ─────────────────────────────────────────────────────

export interface PartnerTab {
  id: string;
  tabLabel: string;
  headline: string;
  body: string;
  images: MediaImage[];
}

export interface PartnersContent {
  headline: string;
  tabs: PartnerTab[];
  partnership: {
    headline: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

// ── How We Do It ────────────────────────────────────────────────────────────

export interface ProcessStep {
  id: string;
  tabLabel: string;
  headline: string;
  body: string;
  videoSrc: string;
  posterSrc?: string;
}

export interface HowWeDoItContent {
  headline: string;
  steps: ProcessStep[];
}

// ── About Us (replaces Conceptualizing) ─────────────────────────────────────

export interface AboutUsContent {
  headline: string;
  paragraphs: string[];
  scrollHint: string;
  completionText: string;
  completionHref: string;
}

// ── Site-wide ───────────────────────────────────────────────────────────────

export interface SiteContent {
  brand: string;
  home: HomeContent;
  projects: ProjectsContent;
  partners: PartnersContent;
  howWeDoIt: HowWeDoItContent;
  aboutUs: AboutUsContent;
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
    videoIntroSrc: "/videos/herointro.mp4",
    videoLoopSrc: "/videos/heroloop.mp4",
    videoIntroPoster: "",
    videoLoopPoster: "",
    videoIntroSrcMobile: "/videos/mobileintro.mp4",
    videoLoopSrcMobile: "/videos/mobileloop.mp4",
    videoIntroPosterMobile: "",
    videoLoopPosterMobile: "",
  },

  // ── Projects ──────────────────────────────────────────────────────────
  projects: {
    headline: "Projects",
    categories: [
      {
        id: "cat-bracelets",
        label: "Bracelets",
        tabs: [
          {
            id: "bracelet-farahavar",
            tabLabel: "Farahavar",
            headline: "Farahavar Bracelet",
            body: "Inspired by the winged Faravahar symbol of ancient Persia, this bracelet translates divine guardianship into wearable form. Precision-cast wings unfurl from a central disc, finished with hand-polished edges that catch light at every angle.",
            modelFilename: "farahavar-bracelet_compressed.glb",
          },
          {
            id: "bracelet-haoma",
            tabLabel: "Haoma",
            headline: "Haoma Bracelet",
            body: "The sacred Haoma plant — revered across Anatolian and Persian traditions — becomes the foundation for this organic bracelet design. Flowing botanical forms are rendered in precious metal through lost-wax casting, creating a piece that feels alive on the wrist.",
            modelFilename: "haoma-bracelet_compressed.glb",
          },
          {
            id: "bracelet-hitit-revize",
            tabLabel: "Hitit Revize",
            headline: "Hitit Revize Bracelet",
            body: "A contemporary reinterpretation of Hittite solar disc motifs. The Revize edition refines the original design language with cleaner geometry and a thinner profile, achieving a balance between archaeological authenticity and modern wearability.",
            modelFilename: "hitit-revize-bracelet_compressed.glb",
          },
          {
            id: "bracelet-kanatli-gunes",
            tabLabel: "Kanatlı Güneş",
            headline: "Kanatlı Güneş Bracelet",
            body: "The Winged Sun — a symbol shared by civilisations from Egypt to Mesopotamia — is reimagined here as a statement bracelet. Radiating feather-work surrounds a central cabochon, each plume individually sculpted before assembly.",
            modelFilename: "kanatli-gunes-bracelet_compressed.glb",
          },
          {
            id: "bracelet-simurg",
            tabLabel: "Simurg",
            headline: "Simurg Bracelet",
            body: "Named after the mythical bird of Persian legend, the Simurg bracelet features interlocking feather motifs that wrap the wrist in continuous movement. Each link articulates independently, creating a fluid silhouette that shifts with every gesture.",
            modelFilename: "simurg-bracelet_compressed.glb",
          },
          {
            id: "bracelet-tas-yildiz",
            tabLabel: "Taş Yıldız",
            headline: "Taş Yıldız Bracelet",
            body: "Stone Star — where gemstone settings are arranged in celestial patterns across a structured bracelet band. Each stone is bezel-set by hand, creating constellations that map ancient Anatolian star charts onto the wrist.",
            modelFilename: "tas-yildiz-bracelet_compressed.glb",
          },
        ],
      },
      {
        id: "cat-necklaces",
        label: "Necklaces",
        tabs: [
          {
            id: "necklace-farahavar",
            tabLabel: "Farahavar",
            headline: "Farahavar Necklace",
            body: "The Faravahar pendant hangs from a hand-linked chain, each connection forged and closed individually. The winged figure sits at the sternum — a guardian symbol transformed into a centrepiece of quiet authority.",
            modelFilename: "farahavar-necklace_compressed.glb",
          },
          {
            id: "necklace-hitit-revize",
            tabLabel: "Hitit Revize",
            headline: "Hitit Revize Necklace",
            body: "Hittite sun imagery is distilled into a refined pendant necklace. The revised proportions sit closer to the collarbone, offering a subtler presence than its bracelet counterpart while maintaining the same archaeological depth.",
            modelFilename: "hitit-revize-necklace_compressed.glb",
          },
          {
            id: "necklace-kanatli-gunes",
            tabLabel: "Kanatlı Güneş",
            headline: "Kanatlı Güneş Necklace",
            body: "The Winged Sun descends from a delicate chain as a statement pendant. Layered metalwork creates dimensional depth — the wings appear to lift away from the body, casting micro-shadows that shift throughout the day.",
            modelFilename: "kanatli-gunes-necklace_compressed.glb",
          },
          {
            id: "necklace-simurg",
            tabLabel: "Simurg",
            headline: "Simurg Necklace",
            body: "The mythical Simurg takes flight as a sculptural pendant. Overlapping feather elements create a three-dimensional relief that catches light from every direction, suspended from an articulated chain that follows the neckline naturally.",
            modelFilename: "simurg-necklace_compressed.glb",
          },
          {
            id: "necklace-tas-yildiz",
            tabLabel: "Taş Yıldız",
            headline: "Taş Yıldız Necklace",
            body: "Celestial geometry meets pendant design. The Taş Yıldız necklace arranges gemstones in star formations around a central motif, each stone selected for colour consistency and set in precision-machined bezels.",
            modelFilename: "tas-yildiz-necklace_compressed.glb",
          },
        ],
      },
      {
        id: "cat-earrings",
        label: "Earrings",
        tabs: [
          {
            id: "earring-anahita",
            tabLabel: "Anahita",
            headline: "Anahita Earrings",
            body: "Named after the ancient goddess of water and wisdom, the Anahita earrings cascade in layered drops that evoke flowing water. Lightweight construction ensures all-day comfort without sacrificing the visual weight of the design.",
            modelFilename: "anahita-earrings_compressed.glb",
          },
          {
            id: "earring-haoma",
            tabLabel: "Haoma",
            headline: "Haoma Earrings",
            body: "Botanical elegance distilled into earring form. The Haoma earrings feature organic leaf and stem motifs, each element individually cast and assembled to create natural movement as they hang from the ear.",
            modelFilename: "haoma-earrings_compressed.glb",
          },
          {
            id: "earring-hitit-revize",
            tabLabel: "Hitit Revize",
            headline: "Hitit Revize Earrings",
            body: "Miniature solar discs rendered with the same precision as their larger bracelet and necklace counterparts. The revised Hittite motif is scaled to earring proportions without losing any of its symbolic detail.",
            modelFilename: "hitit-revize-earrings_compressed.glb",
          },
          {
            id: "earring-hitit-sembol",
            tabLabel: "Hitit Sembol",
            headline: "Hitit Sembol Earrings",
            body: "A deeper exploration of Hittite iconography. The Sembol earrings feature sacred symbols drawn from archaeological reliefs, each glyph hand-engraved into the metal surface before final polishing.",
            modelFilename: "hitit-sembol-earrings_compressed.glb",
          },
          {
            id: "earring-hitit-spiral",
            tabLabel: "Hitit Spiral",
            headline: "Hitit Spiral Earrings",
            body: "The eternal spiral — one of humanity's oldest decorative motifs — is reinterpreted through Hittite design sensibility. These earrings coil from a central post, creating a hypnotic visual rhythm that draws the eye inward.",
            modelFilename: "hitit-spiral-earrings_compressed.glb",
          },
          {
            id: "earring-simurg",
            tabLabel: "Simurg",
            headline: "Simurg Earrings",
            body: "The Simurg's feathers become delicate drop earrings. Each plume is individually articulated, allowing natural sway and light play. A sculptural interpretation of the mythical bird, scaled for the ear.",
            modelFilename: "simurg-earrings_compressed.glb",
          },
        ],
      },
    ],
  },

  // ── Partners ──────────────────────────────────────────────────────────
  partners: {
    headline: "Partners",
    tabs: [
      {
        id: "partner-1",
        tabLabel: "Partner 1",
        headline: "Partner 1 — Collaboration",
        body: "A brief description of this partnership and the products we create together. Replace with actual partner details.",
        images: [
          { id: "p1-img-1", src: "/images/who-we-are-img1.webp", alt: "Partner 1 product 1", caption: "Product detail" },
          { id: "p1-img-2", src: "/images/who-we-are-img2.webp", alt: "Partner 1 product 2", caption: "Product silhouette" },
          { id: "p1-img-3", src: "/images/who-we-are-img3.webp", alt: "Partner 1 product 3", caption: "Full collection" },
          { id: "p1-img-4", src: "/images/who-we-are-img4.webp", alt: "Partner 1 product 4", caption: "Edge detail" },
        ],
      },
      {
        id: "partner-2",
        tabLabel: "Partner 2",
        headline: "Partner 2 — Collaboration",
        body: "A brief description of this partnership and the products we create together. Replace with actual partner details.",
        images: [
          { id: "p2-img-1", src: "/images/web_cowrie_pointed_arctic_rust.webp", alt: "Partner 2 product 1", caption: "Cowrie pointed" },
          { id: "p2-img-2", src: "/images/web_runes_cowrie_arctic_rust.webp", alt: "Partner 2 product 2", caption: "Runes cowrie" },
          { id: "p2-img-3", src: "/images/web_solo_1_duablas_arctic_rust.webp", alt: "Partner 2 product 3", caption: "Solo duablas" },
          { id: "p2-img-4", src: "/images/web_solo_horizon_3_arctic_rust.webp", alt: "Partner 2 product 4", caption: "Solo horizon" },
        ],
      },
      {
        id: "partner-3",
        tabLabel: "Partner 3",
        headline: "Partner 3 — Collaboration",
        body: "A brief description of this partnership and the products we create together. Replace with actual partner details.",
        images: [
          { id: "p3-img-1", src: "/images/who-we-are-img1.webp", alt: "Partner 3 product 1", caption: "Product detail" },
          { id: "p3-img-2", src: "/images/web_cowrie_pointed_arctic_rust.webp", alt: "Partner 3 product 2", caption: "Cowrie" },
          { id: "p3-img-3", src: "/images/who-we-are-img3.webp", alt: "Partner 3 product 3", caption: "Collection" },
          { id: "p3-img-4", src: "/images/web_solo_horizon_3_arctic_rust.webp", alt: "Partner 3 product 4", caption: "Horizon" },
        ],
      },
    ],
    partnership: {
      headline: "Partner With Us",
      body: "We collaborate with brands, designers, and retailers who share our commitment to quality craftsmanship. Whether you are looking for exclusive collections, custom designs, or wholesale partnerships, we would love to hear from you.",
      ctaLabel: "Join Us",
      ctaHref: "/contact",
    },
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
        posterSrc: "",
      },
      {
        id: "step-casting",
        tabLabel: "Casting",
        headline: "Molten Precision",
        body: "Using the lost-wax casting method perfected over millennia, we transform precious metals into three-dimensional form. Temperature, timing, and material purity are controlled to the fraction of a degree. The result: flawless castings that capture every microscopic detail of the original wax model.",
        videoSrc: "/videos/how-we-do-step2.mp4",
        posterSrc: "",
      },
      {
        id: "step-polishing",
        tabLabel: "Polishing",
        headline: "Surface Alchemy",
        body: "Polishing is where raw metal becomes jewelry. Through progressive stages — from coarse abrasion to mirror-finishing compounds — each surface achieves its intended character. Some pieces demand a brushed matte; others, a liquid-chrome reflection. The artisan decides, guided by decades of touch memory.",
        videoSrc: "/videos/how-we-do-step3.mp4",
        posterSrc: "",
      },
      {
        id: "step-setting",
        tabLabel: "Setting",
        headline: "Stone Meets Metal",
        body: "Setting is the most nerve-wracking stage: a single slip can shatter a stone worth thousands. Our setters work under magnification, using hand tools to gently coax metal around each gem until it is held with invisible security. The stone should appear to float, defying gravity and expectation.",
        videoSrc: "/videos/how-we-do-step4.mp4",
        posterSrc: "",
      },
    ],
  },

  // ── About Us ──────────────────────────────────────────────────────────
  aboutUs: {
    headline: "About Us",
    paragraphs: [
      "SMYRNA is a jewelry house rooted in the ancient craft traditions of Anatolia, reimagined through a contemporary lens. We believe that adornment is not decoration — it is identity. Every piece in our collection is the culmination of hundreds of hours of deliberate refinement, where artisans work at the intersection of tradition and technology.",
      "Our journey began in the workshops of Izmir, where generations of master jewelers passed down techniques that predate written history. The lost-wax casting method, the delicate art of filigree, the science of metal alloys — these are living traditions that inform every decision we make. We do not merely reference the past; we build upon it with modern precision tools, computational design, and ethically sourced materials.",
      "The name SMYRNA itself carries weight. It is the ancient name for Izmir, a city that has been a crossroads of cultures, commerce, and creativity for over three millennia. Phoenician traders, Greek artisans, Roman engineers, and Ottoman masters all left their mark here. We see ourselves as the latest chapter in that unbroken lineage — inheriting a responsibility to push the boundaries of what is possible in handcrafted jewelry.",
      "Our design philosophy is rooted in restraint. We strip away the unnecessary until only the essential form remains. Every curve serves a purpose: structural integrity, the way light moves across a surface, how a piece feels against skin. We test dozens of variations before committing to a final design, and even then, we continue to refine in production. Nothing leaves our workshop until it meets the standard we have set for ourselves.",
      "Materials matter as much as form. We source precious metals from certified responsible mines, gemstones from suppliers who can trace every stone back to its origin, and organic materials like mother-of-pearl and coral only from sustainable harvests. The environmental cost of luxury is a problem we take seriously, and we invest in solutions rather than simply acknowledging the challenge.",
      "Each collection tells a story drawn from the natural world, from architecture, from mathematics. The braided patterns you see in our work are not arbitrary — they follow precise helical curves inspired by the way vines climb, the way rivers braid across a delta, the way DNA coils upon itself. These are patterns that nature has optimized over billions of years. We simply translate them into gold, silver, and stone.",
      "We invite you to explore our work not as consumers, but as participants in a tradition that stretches back to the earliest human impulse to create beauty from raw materials. Every piece of SMYRNA jewelry is a conversation between maker and wearer — a shared belief that the objects we carry with us should be worthy of the stories they will witness.",
    ],
    scrollHint: "Scroll the text to complete animation",
    completionText: "Inspired by our Marine Blue Jewelry product, Solo Waterfall",
    completionHref: "https://wholesalejewelry.store/product/solo-waterfall-handmade-beaded-bracelet/",
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

// ── Flat project tab helpers (used by per-model subpages) ──────────────────

export interface FlatProjectTab extends ProjectTab {
  categoryLabel: string;
  categoryId: string;
  globalIndex: number;
}

export function getFlatProjectTabs(): FlatProjectTab[] {
  const flat: FlatProjectTab[] = [];
  let idx = 0;
  for (const cat of siteContent.projects.categories) {
    for (const tab of cat.tabs) {
      flat.push({
        ...tab,
        categoryLabel: cat.label,
        categoryId: cat.id,
        globalIndex: idx++,
      });
    }
  }
  return flat;
}

export function getProjectTabById(id: string): FlatProjectTab | undefined {
  return getFlatProjectTabs().find((t) => t.id === id);
}
