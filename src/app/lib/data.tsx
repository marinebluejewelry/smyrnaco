// ---------------------------------------------------------------------------
// Static content store – single source of truth for all page copy & assets.
// No CMS. Every page references this file.
//
// This file is .tsx so headline/body fields can contain JSX (React.ReactNode).
// Example: body: <>First line.<br/><br/>Second with <em>emphasis</em></>
// ---------------------------------------------------------------------------

import type { ReactNode } from "react";
import { videoPath } from "@/app/lib/cdn";

// ── Shared media types ──────────────────────────────────────────────────────

export interface MediaImage {
  id: string;
  /** Path relative to /public/ — used by next/image */
  src: string;
  alt: string;
  /** Optional caption shown on hover */
  caption?: string;
  /** External product link — opens in new tab */
  link?: string;
}

// ── Legacy types (kept for backward compat with unused components) ───────────

export interface HeroContent {
  tagline: string;
  headline: ReactNode[];
  description: ReactNode;
  cta: { label: string; href: string };
}

export interface ShowcaseSection {
  id: string;
  label: string;
  headline: ReactNode;
  body: ReactNode;
}

export interface FeatureItem {
  id: string;
  index: string;
  title: ReactNode;
  description: ReactNode;
}

export interface VideoItem {
  id: string;
  src: string;
  srcWebm?: string;
  poster?: string;
  headline?: ReactNode;
  caption?: ReactNode;
}

// ── Page-specific content types ─────────────────────────────────────────────

export interface HomeContent {
  logoSrc: string;
  headline: ReactNode;
  subtitle: ReactNode;
  videoIntroSrc: string;
  videoLoopSrc: string;
  videoIntroPoster?: string;
  videoLoopPoster?: string;
  videoIntroSrcMobile?: string;
  videoLoopSrcMobile?: string;
  videoIntroPosterMobile?: string;
  videoLoopPosterMobile?: string;
}

// ── Catalog (replaces Projects / Who We Are) ────────────────────────────────

export interface CatalogTab {
  id: string;
  tabLabel: string;
  headline: ReactNode;
  body: ReactNode;
  /** Filename of .glb model in /public/models/ */
  modelFilename: string;
}

export interface CatalogCategory {
  id: string;
  /** Display label for the primary tab ("Bracelets", "Necklaces", etc.) */
  label: string;
  tabs: CatalogTab[];
}

export interface CatalogContent {
  headline: ReactNode;
  categories: CatalogCategory[];
}

// ── Partners (new page) ─────────────────────────────────────────────────────

export interface PartnerTab {
  id: string;
  tabLabel: string;
  headline: ReactNode;
  body: ReactNode;
  images: MediaImage[];
}

export interface PartnersContent {
  headline: ReactNode;
  tabs: PartnerTab[];
  partnership: {
    headline: ReactNode;
    body: ReactNode;
    ctaLabel: string;
    ctaHref: string;
  };
}

// ── How We Do It ────────────────────────────────────────────────────────────

export interface ProcessStep {
  id: string;
  tabLabel: string;
  headline: ReactNode;
  body: ReactNode;
  videoSrc: string;
  posterSrc?: string;
}

export interface HowWeDoItContent {
  headline: ReactNode;
  steps: ProcessStep[];
}

// ── About Us (replaces Conceptualizing) ─────────────────────────────────────

export interface AboutUsContent {
  headline: ReactNode;
  paragraphs: ReactNode[];
  scrollHint: ReactNode;
  completionText: ReactNode;
  completionHref: string;
  completionUnderText: ReactNode;
}

// ── Site-wide ───────────────────────────────────────────────────────────────

export interface SiteContent {
  brand: string;
  home: HomeContent;
  catalog: CatalogContent;
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
    headline: "Designed in Detail. Delivered in Full.",
    subtitle: "SMYRNA: Concept Jewelry Design & Production",
    videoIntroSrc: videoPath("herointro.mp4"),
    videoLoopSrc: videoPath("heroloop.mp4"),
    videoIntroPoster: "/images/desktop-hero-poster.webp",
    videoLoopPoster: "",
    videoIntroSrcMobile: videoPath("mobileintro.mp4"),
    videoLoopSrcMobile: videoPath("mobileloop.mp4"),
    videoIntroPosterMobile: "/images/mobile-hero-poster.webp",
    videoLoopPosterMobile: "",
  },

  // ── Catalog ───────────────────────────────────────────────────────────
  catalog: {
    headline: "Catalog",
    categories: [
      {
        id: "cat-bracelets",
        label: "Bracelets",
        tabs: [
          {
            id: "bracelet-farahavar",
            tabLabel: "Farahavar",
            headline: "Farahavar Bracelet",
            body: <>The Faravahar is one of the most enduring symbols of ancient Persia — a winged figure representing divine grace, moral choice, and the eternal soul. Found carved into the ruins of Persepolis and worn as a seal of royal authority by Achaemenid kings, it has transcended millennia as an emblem of spiritual guardianship. This bracelet draws directly from that lineage, translating the outstretched wings and central disc into a wearable composition that carries the weight of its origin without heaviness on the wrist.<br/><br/>Every element is considered: the symmetry of the wings, the proportions of the central figure, the way the form resolves at the clasp. It is a piece designed to be noticed in its details rather than its volume — a quiet assertion of heritage rendered in contemporary craft.<br/><br/>Constructed from electroplated brass and stainless steel, finished with Japanese Matsuno and Toho glass beads that introduce subtle colour and texture across the band.</>,
            modelFilename: "farahavar-bracelet_compressed.glb",
          },
          {
            id: "bracelet-haoma",
            tabLabel: "Haoma",
            headline: "Haoma Bracelet",
            body: <>In the sacred texts of the Avesta, Haoma is both a divine plant and a deity — a source of immortality, healing, and spiritual revelation. Priests prepared the Haoma ritual drink to commune with the divine, and the plant itself was depicted across Persian and Anatolian art as a symbol of life renewing itself endlessly. This bracelet takes that organic mythology as its starting point, interpreting twisting stems and unfurling leaves into a form that wraps the wrist like living growth.<br/><br/>The design avoids rigid symmetry in favour of the natural irregularity found in botanical forms. Each curve follows the next with an organic logic, creating a sense of movement even when still. It is a piece that rewards close inspection — the deeper you look, the more the botanical references reveal themselves.<br/><br/>Built from electroplated brass and stainless steel, woven with Japanese Matsuno glass beads and crystal beads that add points of light throughout the composition.</>,
            modelFilename: "haoma-bracelet_compressed.glb",
          },
          {
            id: "bracelet-hitit-revize",
            tabLabel: "Hittite",
            headline: "Hittite Bracelet",
            body: <>The Hittites ruled Anatolia for over four centuries, leaving behind a visual language of sun discs, double-headed eagles, and geometric patterns carved into stone gateways and ceremonial objects. Their art bridged the abstract and the representational — solar symbols rendered with mathematical precision, yet infused with spiritual meaning that extended far beyond decoration. This bracelet is a contemporary reinterpretation of those motifs, refining the original disc forms into cleaner geometry while preserving the meditative quality of the repeated pattern.<br/><br/>The design sits low on the wrist with a deliberate profile, structured enough to hold its shape yet flexible enough to move naturally. Each element references a specific aspect of Hittite visual culture without replicating it literally — an exercise in translation rather than reproduction.<br/><br/>Crafted from electroplated brass with cotton cord, accented by Japanese Matsuno and Toho glass beads that echo the earth tones found in Hittite archaeological sites.</>,
            modelFilename: "hitit-revize-bracelet_compressed.glb",
          },
          {
            id: "bracelet-kanatli-gunes",
            tabLabel: "Winged Sun",
            headline: "Winged Sun Bracelet",
            body: <>The Winged Sun is among the most widely shared symbols of the ancient world — appearing independently across Egyptian, Mesopotamian, Hittite, and Persian civilisations. In each culture it carried a distinct meaning: divine kingship in Egypt, the god Ashur in Assyria, celestial protection among the Hittites. What unites them is the fundamental image of radiant power given the ability to travel — the sun itself, made mobile through outstretched wings. This bracelet takes that universal motif and distils it into a wearable statement piece.<br/><br/>Radiating feather-work extends from a central focal point, each plume sculpted to create depth and directional light play. The composition is intentionally bold — this is not a piece that hides beneath a sleeve. It occupies space on the wrist with the same quiet authority as the carved reliefs it draws from.<br/><br/>Assembled from electroplated brass and cotton cord, detailed with Japanese Matsuno and Toho glass beads that bring warmth and dimension to the metalwork.</>,
            modelFilename: "kanatli-gunes-bracelet_compressed.glb",
          },
          {
            id: "bracelet-simurg",
            tabLabel: "Simurg",
            headline: "Simurg Bracelet",
            body: <>The Simurg is a creature of Persian mythology — an enormous, benevolent bird said to be so ancient it had witnessed the destruction and renewal of the world three times over. In the Shahnameh, it nests atop Mount Alborz and possesses the accumulated knowledge of all ages. It represents wisdom gained through endurance, compassion born from understanding. This bracelet captures that mythic presence through interlocking feather motifs that wrap the wrist in continuous, flowing movement.<br/><br/>Each link articulates independently, allowing the piece to shift and reshape itself with every gesture. There is no single viewing angle — the design reveals different aspects of its pattern depending on how it falls, much like the Simurg itself, whose full nature could never be grasped from a single perspective.<br/><br/>Forged from electroplated brass and stainless steel, threaded with Japanese Matsuno and Toho glass beads and tube beads that add linear rhythm to the feathered composition.</>,
            modelFilename: "simurg-bracelet_compressed.glb",
          },
          {
            id: "bracelet-tas-yildiz",
            tabLabel: "Stone Star",
            headline: "Stone Star Bracelet",
            body: <>Before compasses and cartography, Anatolian civilisations navigated by the stars — mapping trade routes, agricultural cycles, and sacred calendars against the patterns of the night sky. Stars were not merely decorative motifs but functional symbols, each constellation carrying meaning that connected the terrestrial to the celestial. Stone Star takes that ancient practice as its foundation, arranging settings in star formations that reference these early attempts to bring cosmic order down to earth.<br/><br/>The structured band provides architectural rigidity while the bead arrangements introduce organic variation — no two clusters sit at quite the same angle. It is a piece that balances precision with the controlled imperfection that distinguishes handcraft from machine production.<br/><br/>Made from electroplated brass with cotton cord, set with Japanese Matsuno and Toho glass beads alongside cube beads that introduce geometric counterpoints to the stellar arrangements.</>,
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
            body: <>The Faravahar pendant carries the same Achaemenid lineage as its bracelet counterpart, but repositioned for the chest — where it would have historically been displayed as a seal of spiritual authority. The winged figure sits at the sternum, occupying the same anatomical position where Persian nobles wore their emblems of divine favour. Suspended from a carefully proportioned chain, the pendant moves with the body rather than hanging stiffly, creating a sense of partnership between wearer and symbol.<br/><br/>The translation from bracelet to necklace required rethinking the proportions entirely. What works wrapped around a wrist demands different balance when hanging vertically. The wings have been adjusted to read correctly from a frontal perspective, and the central figure carries enough visual weight to anchor the composition without overwhelming the chain.<br/><br/>Constructed from electroplated brass and stainless steel, finished with Japanese Matsuno and Toho glass beads that add texture and tonal variation to the metalwork.</>,
            modelFilename: "farahavar-necklace_compressed.glb",
          },
          {
            id: "necklace-hitit-revize",
            tabLabel: "Hittite",
            headline: "Hittite Necklace",
            body: <>Hittite artisans carved their solar disc motifs into limestone gateways that still stand across central Anatolia — at Hattusha, Alaca Höyük, and Yazılıkaya. These symbols were positioned at thresholds, marking the boundary between the profane and the sacred. This necklace takes that threshold symbolism and places it at the collarbone — another kind of boundary, where the body meets the world. The revised proportions sit closer to the neck than a typical pendant, offering a subtler presence that rewards proximity.<br/><br/>The design distils the Hittite disc into its essential geometry: concentric circles, radiating lines, and the mathematical precision that characterised their approach to visual culture. It is archaeological in its references but contemporary in its restraint — the details are present for those who look closely, but the overall impression is simply one of refined simplicity.<br/><br/>Crafted from electroplated brass and stainless steel, detailed with Japanese Matsuno and Toho glass beads that introduce warmth against the metal surface.</>,
            modelFilename: "hitit-revize-necklace_compressed.glb",
          },
          {
            id: "necklace-kanatli-gunes",
            tabLabel: "Winged Sun",
            headline: "Winged Sun Necklace",
            body: <>As a pendant, the Winged Sun takes on a different character than its bracelet form. Hanging from the chest, the wings extend outward and slightly upward, creating the impression of ascent — the sun rising rather than resting. Layered metalwork creates genuine dimensional depth; the wings appear to lift away from the body, casting micro-shadows that shift throughout the day as the angle of light changes. It is a piece that looks different at noon than it does at dusk.<br/><br/>The chain itself is considered part of the design rather than merely a suspension mechanism. Its weight and link pattern are calibrated to complement the pendant's visual density without competing for attention. The transition from chain to pendant is seamless, each element flowing into the next.<br/><br/>Assembled from electroplated brass and stainless steel, accented with Japanese Matsuno and Toho glass beads alongside crystal beads that introduce points of refracted light across the wingspan.</>,
            modelFilename: "kanatli-gunes-necklace_compressed.glb",
          },
          {
            id: "necklace-simurg",
            tabLabel: "Simurg",
            headline: "Simurg Necklace",
            body: <>In the Conference of the Birds — Attar's twelfth-century Sufi masterwork — thousands of birds journey to find the Simurg, only to discover that the Simurg is themselves, reflected back in divine unity. The necklace pendant captures that moment of revelation: the mythical bird rendered in sculptural relief, its overlapping feather elements creating a three-dimensional surface that catches light from every direction. Each viewing angle reveals a slightly different aspect of the form, echoing the poem's central insight that truth shifts depending on the perspective of the seeker.<br/><br/>Suspended from an articulated chain that follows the neckline naturally, the pendant sits with a satisfying weight — substantial enough to feel present, light enough to move with the body. The feather layering creates natural shadow and highlight that change with ambient light.<br/><br/>Forged from electroplated brass and stainless steel, threaded with Japanese Matsuno and Toho glass beads and tube beads that extend the feathered rhythm from pendant into chain.</>,
            modelFilename: "simurg-necklace_compressed.glb",
          },
          {
            id: "necklace-tas-yildiz",
            tabLabel: "Stone Star",
            headline: "Stone Star Necklace",
            body: <>The night sky over ancient Anatolia was darker and more vivid than anything visible from a modern city — a field of thousands of stars, each one a navigational reference, a seasonal marker, or a character in mythological narrative. Stone Star translates that celestial density into pendant form, arranging bead settings in star formations around a central motif. Each cluster follows a different geometric logic, creating constellations that feel both systematic and organic — ordered enough to suggest intention, varied enough to feel natural.<br/><br/>The pendant is designed to be read both as a whole composition and as a collection of individual moments. From a distance it registers as a singular form; up close, the individual arrangements become visible, each one a small world of colour and geometry.<br/><br/>Made from electroplated brass and stainless steel, set with Japanese Matsuno and Toho glass beads alongside cube beads that introduce angular counterpoints to the rounded stellar forms.</>,
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
            body: <>Anahita — the ancient Iranian goddess of water, fertility, and wisdom — was venerated across a vast geography, from the rivers of Persia to the temples of Armenia and Anatolia. She represented the life-giving force of flowing water: purifying, nourishing, and endlessly in motion. These earrings channel that fluidity through cascading layered drops that evoke the movement of water falling over stone. Each tier catches light independently, creating a shimmering effect that shifts with the wearer's movement.<br/><br/>The design prioritises visual weight without physical heaviness. The layered construction distributes the form across multiple tiers rather than concentrating mass at a single point, ensuring comfort across extended wear while maintaining the dramatic silhouette that the goddess's namesake demands.<br/><br/>Crafted from electroplated brass with Japanese Matsuno glass beads that introduce soft colour gradients reminiscent of light refracting through shallow water.</>,
            modelFilename: "anahita-earrings_compressed.glb",
          },
          {
            id: "earring-haoma",
            tabLabel: "Haoma",
            headline: "Haoma Earrings",
            body: <>The Haoma plant's sacred status in Zoroastrian ritual gives these earrings a deeper resonance than mere botanical decoration. Ancient priests believed the plant could bridge the gap between mortal consciousness and divine awareness — its preparation was itself an act of worship. Translating that reverence into earring form, the design features organic leaf and stem motifs that grow downward from the ear, each element following the natural growth patterns found in the original plant depictions on ceremonial vessels.<br/><br/>The earrings move with genuine fluidity — the individual elements are assembled to allow natural sway, creating the impression of a living plant responding to a breeze. This movement is intentional, not incidental; it is part of the design language, connecting the stillness of the wearer to the constant motion of the natural world the Haoma represents.<br/><br/>Built from electroplated brass, embellished with crystal beads that catch and scatter light like dew forming on morning foliage.</>,
            modelFilename: "haoma-earrings_compressed.glb",
          },
          {
            id: "earring-hitit-revize",
            tabLabel: "Hittite",
            headline: "Hittite Earrings",
            body: <>Scaling a monumental motif down to earring proportions is an exercise in editorial discipline — deciding what to keep, what to simplify, and what to let go entirely. The Hittite solar disc, originally carved into stone gateways several metres high, loses nothing essential in this translation. The concentric geometry, the radiating lines, the mathematical certainty of the pattern — all survive the reduction in scale because they were never dependent on size for their power. A Hittite sun disc is recognisable at any dimension.<br/><br/>These earrings sit close to the lobe with a compact profile, designed to be felt as much as seen. The weight is precisely calibrated — present enough to remind the wearer of the piece's substance, light enough to disappear during everyday activity. The disc catches light cleanly, creating a subtle flash of reflection that draws attention without demanding it.<br/><br/>Constructed from electroplated brass and stainless steel, finished with Japanese Matsuno and Toho glass beads that add tonal depth to the metallic surface.</>,
            modelFilename: "hitit-revize-earrings_compressed.glb",
          },
          {
            id: "earring-hitit-sembol",
            tabLabel: "Sunmazed",
            headline: "Sunmazed Earrings",
            body: <>The Hittite sun disc crowned by a rising spiral — two of Anatolia's most potent symbols merged into a single form. The sun represents cosmic order and divine authority; the spiral above it suggests ascent, transcendence, the movement from earthly concerns toward something higher. Together they create an image of illumination in motion, a sun that does not merely sit in the sky but actively rises. The name Sunmazed captures this quality of being caught in the sun's upward pull — dazed by its radiance, drawn into its spiral path.<br/><br/>As earrings, the combined motif creates a vertical composition that naturally complements the line from ear to shoulder. The spiral extends upward while the disc anchors the design below, establishing a visual tension between ascent and stability that gives the piece its distinctive energy.<br/><br/>Forged from electroplated brass and stainless steel, accented with Japanese Matsuno and Toho glass beads that introduce subtle warmth to the metalwork.</>,
            modelFilename: "hitit-sembol-earrings_compressed.glb",
          },
          {
            id: "earring-hitit-spiral",
            tabLabel: "Cunei",
            headline: "Cunei Earrings",
            body: <>Cuneiform — the wedge-shaped script pressed into clay tablets across Mesopotamia and Anatolia — was among humanity's first attempts to make thought permanent. Each mark was deliberate, each stroke carried meaning beyond its shape. The Cunei earrings take their name from this ancient writing system, channelling the same economy of expression: minimal form carrying maximum significance. The design coils from a central post in a disciplined spiral, each revolution tightening with geometric precision.<br/><br/>The spiral is one of the oldest decorative motifs known to archaeology, appearing across cultures separated by thousands of miles and millennia. In Hittite contexts it carried solar associations — the path of the sun across the sky, the cycle of seasons, the eternal return. Here it becomes a piece of personal adornment that connects the wearer to that deep human instinct for pattern and repetition.<br/><br/>Crafted from electroplated brass with a clean, unadorned finish that lets the sculptural form speak for itself.</>,
            modelFilename: "hitit-spiral-earrings_compressed.glb",
          },
          {
            id: "earring-simurg",
            tabLabel: "Simurg",
            headline: "Simurg Earrings",
            body: <>The Simurg's feathers were said to possess healing properties — in the Shahnameh, the hero Rostam is nursed back to health by the touch of the great bird's plumage. These earrings take that protective, nurturing aspect of the myth and render it as delicate drop pieces. Each plume is individually articulated, allowing natural sway and light play that changes with every movement of the head. The feathers fan outward as they descend, creating an expanding silhouette that mirrors the way actual feathers spread when caught by air.<br/><br/>The articulation is not merely aesthetic — it gives the earrings a living quality, a responsiveness to the wearer's movement that static jewellery cannot achieve. They shift, they catch light unpredictably, they settle differently each time. This dynamic character connects them to the mythical bird itself, a creature defined by its constant motion across the sky.<br/><br/>Built from electroplated brass and stainless steel, detailed with Japanese Toho glass beads and tube beads that create linear accents along each feather's spine.</>,
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
        tabLabel: "Marine Blue Jewelry",
        headline: "A longlasting partnership: Marine Blue.",
        body: <>For nearly 10 years, Smyrna & Co has worked closely with Marine Blue Jewelry, supporting design and production while contributing to the growth of its wholesale presence in Bali. This partnership is built on trust, craftsmanship, and shared creative vision.<br/><br/><strong>&bull; Private Label Production</strong>: We manufacture collections under your brand, ensuring consistency, quality, and scalability. <br/><br/><strong> &bull; Design & Development</strong>: From concept sketches to final prototypes, we support the full creative process.</>,
        images: [
          { id: "p2-img-1", src: "/images/web_cowrie_3_nocturnal_black-1-scaled.webp", alt: "Cowrie 3 product picture", caption: "Cowrie 3", link: "https://wholesalejewelry.store/product/cowrie-3-handmade-charm-bracelet/" },
          { id: "p2-img-2", src: "/images/web_dreamers_nocturnal_black-1-scaled.webp", alt: "Dreamers product picture", caption: "Dreamers", link: "https://wholesalejewelry.store/product/dreamers-handmade-beaded-bracelet/" },
          { id: "p2-img-3", src: "/images/web_edge_nabi_nocturnal_black-1-scaled.webp", alt: "Edge Nabi product picture", caption: "Edge Nabi", link: "https://wholesalejewelry.store/product/edge-nabi-handmade-butterfly-charm-bracelet/" },
          { id: "p2-img-4", src: "/images/web_jardin_flower_circle_nocturnal_black-1-scaled.webp", alt: "Jardin Flower product picture", caption: "Jardin Flower", link: "https://wholesalejewelry.store/product/jardin-flower-circle-handmade-beaded-bracelet/" },
          { id: "p2-img-5", src: "/images/web_solo_daffodils_nocturnal_black-1-scaled.webp", alt: "Solo Daffodils product picture", caption: "Solo Daffodils", link: "https://wholesalejewelry.store/product/solo-daffodils-handmade-beaded-bracelet/" },
          { id: "p2-img-6", src: "/images/web_solo_flex_3_nocturnal_black-1-scaled.webp", alt: "Solo Flex 3 product picture", caption: "Solo Flex 3", link: "https://wholesalejewelry.store/product/solo-flex-3-handmade-beaded-bracelet/" },
          { id: "p2-img-7", src: "/images/web_solo_waterfall_nocturnal_black-1-scaled.webp", alt: "Solo Waterfall product picture", caption: "Solo Waterfall", link: "https://wholesalejewelry.store/product/solo-waterfall-handmade-beaded-bracelet/" },
          { id: "p2-img-8", src: "/images/web_timeless_nocturnal_black-1-scaled.webp", alt: "Timeless product picture", caption: "Timeless", link: "https://wholesalejewelry.store/product/timeless-handmade-charm-bracelet/" },
        ],
      },
      {
        id: "partner-2",
        tabLabel: "Segara Agung Perthiwi",
        headline: "Built on trust: Segara Agung Perthiwi.",
        body: <>Based in Bali, Segara Agung Perthiwi is our retail expression, where design meets customer experience. It allows us to stay closely connected to market trends while refining our collections through direct interaction with customers.<br/><br/><strong> &bull; Custom Collections</strong>: We develop exclusive collections tailored to your market, identity, and audience.</>,
        images: [
          { id: "p2-img-1", src: "/images/solo-8-snake.jpg", alt: "Solo 8 Snake product picture", caption: "Solo 8 Snake", link: "https://marinebluejewelry.com/products/solo-8-snake-beaded-bracelet" },
          { id: "p2-img-2", src: "/images/novir.jpg", alt: "Novir product picture", caption: "Novir", link: "https://marinebluejewelry.com/products/novir-charm-bracelet" },
          { id: "p2-img-3", src: "/images/fuji.jpg", alt: "Fuji product picture", caption: "Fuji", link: "https://marinebluejewelry.com/products/fuji-charm-bracelet" },
          { id: "p2-img-4", src: "/images/laden.jpg", alt: "Laden product picture", caption: "Laden", link: "https://marinebluejewelry.com/products/laden-beaded-bracelet" },
          { id: "p2-img-5", src: "/images/edge-sacred.webp", alt: "Edge Sacred product picture", caption: "Edge Sacred", link: "https://marinebluejewelry.com/products/edge-sacred-charm-bracelet" },
          { id: "p2-img-6", src: "/images/mojo-pulls.jpg", alt: "Mojo Pulls product picture", caption: "Mojo Pulls", link: "https://marinebluejewelry.com/products/mojo-pulls" },
          { id: "p2-img-7", src: "/images/pont-tu-gard.jpg", alt: "Pont du Gard product picture", caption: "Pont du Gard", link: "https://marinebluejewelry.com/products/pont-du-gard" },
          { id: "p2-img-8", src: "/images/odontia.jpg", alt: "Odontia product picture", caption: "Odontia", link: "https://marinebluejewelry.com/products/odontia" },
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
        body: <>Every piece begins long before any material is touched — it starts as an idea, a reference, a feeling that needs to find its shape. Our design process moves through distinct phases: initial concept sketching, where intuition leads and the hand moves freely; proportional studies, where each element is measured against the human body it will eventually occupy; and technical drafting, where organic forms are translated into precise specifications that production can follow faithfully.<br/><br/>We work iteratively, cycling between hand drawing and digital modelling until the design resolves into something that feels both inevitable and surprising. A successful design should look as though it could not have been made any other way — every curve, every junction, every transition between surfaces serving a purpose that is structural, aesthetic, or both. Dozens of variations are explored and discarded before a single form earns its place in the collection.</>,
        videoSrc: videoPath("how-we-do-design.mp4"),
        posterSrc: "/images/how-we-do-design.webp",
      },
      {
        id: "step-casting",
        tabLabel: "Plating",
        headline: "Surface & Finish",
        body: <>Plating is the process that defines a piece's final character — its colour, its lustre, and the way it interacts with light throughout the day. We apply metal coatings through electroplating, a controlled electrochemical process where the base component is submerged in a solution containing dissolved metal ions. Electrical current drives these ions onto the surface, building up an even, bonded layer atom by atom.<br/><br/>The thickness, composition, and sequence of plating layers all affect the final result. Some pieces receive a single coating; others require multiple layers applied in precise order to achieve the desired warmth, depth, or reflectivity. Temperature, current density, and immersion time are monitored throughout — small deviations produce visible differences in the finished surface. The goal is consistency across every unit in a production run, so that a piece made on a Monday is indistinguishable from one made on a Friday.</>,
        videoSrc: videoPath("how-we-do-plating.mp4"),
        posterSrc: "/images/how-we-do-plating.webp",
      },
      {
        id: "step-polishing",
        tabLabel: "Printing",
        headline: "Colour & Detail",
        body: <>Once a component has been plated and its metallic surface is complete, it moves to printing — the stage where colour, pattern, and visual identity are applied. The process works much like a conventional printer applying ink to a blank page, except the surface is a small, three-dimensional metal charm rather than paper. The freshly plated piece is loaded into a precision printing machine that deposits pigments, motifs, and detailed graphics directly onto the metal surface with pinpoint accuracy.<br/><br/>This is where a plain plated component transforms into a recognisable design element — the specific colours, the fine lines of a motif, the gradients and details that give each charm its character. Registration must be exact; even a fraction of a millimetre of misalignment is visible on a piece this small. Colour consistency across a production batch is equally critical, since multiple printed charms will sit side by side on the finished jewelry. The result is a library of detailed, vibrant components ready to be incorporated into the final assembly.</>,
        videoSrc: videoPath("how-we-do-printing.mp4"),
        posterSrc: "/images/how-we-do-printing.webp",
      },
      {
        id: "step-setting",
        tabLabel: "Handiwork",
        headline: "Assembly by Hand",
        body: <>Handiwork is where a collection of individual components becomes a finished piece of jewelry. This is the most labour-intensive phase of production — and the one most resistant to automation. Beads are threaded in precise sequences, findings are attached, clasps are connected, and every element is checked for alignment, tension, and security. The hands that perform this work carry years of accumulated knowledge: how tightly to pull a cord, how much pressure a connection can bear, when a bead sits flush and when it needs repositioning.<br/><br/>Each piece passes through multiple stages of hand assembly, with quality checks between each one. The final inspection is tactile as much as visual — the piece is handled, flexed, worn, and evaluated for how it feels in motion. A bracelet that looks perfect on a workbench but catches on skin or hangs unevenly on a wrist is sent back for adjustment. The standard is not technical perfection in isolation, but a seamless experience for the person who will eventually wear it every day.</>,
        videoSrc: videoPath("how-we-do-handiwork.mp4"),
        posterSrc: "/images/how-we-do-handiwork.webp",
      },
    ],
  },

  // ── About Us ──────────────────────────────────────────────────────────
  aboutUs: {
    headline: "About Us",
    paragraphs: [
      "SMYRNA is a jewelry house built on the ancient craft traditions of Anatolia — traditions we have reimagined through a contemporary lens without abandoning the principles that made them endure. We believe that adornment is not decoration. It is identity. Every piece in our collection represents hundreds of hours of deliberate refinement, passed through the hands of artisans who work at the intersection of inherited technique and modern precision.",

      "Our name is our origin. Smyrna is the ancient name for Izmir, a coastal city that has served as a crossroads of cultures, commerce, and creativity for over three thousand years. Traders, artisans, engineers, and craftspeople from across civilisations left their mark on this place — in its architecture, its markets, and its workshops. We see ourselves as part of that unbroken lineage, inheriting both a tradition and a responsibility to carry it forward into new territory.",

      "The workshops where our journey began still operate in the heart of Izmir. In these spaces, techniques that predate written history are practised alongside digital design tools and electrochemical plating equipment. The contrast is deliberate. We do not preserve the past as a museum exhibit — we use it as a foundation, building upward with every tool and technology available to us. A hand-drawn sketch becomes a computational model. A centuries-old casting method meets modern alloy science. The result is work that honours its roots while speaking a contemporary language.",

      "Our collections draw from the visual heritage of Anatolia — from the Hittite sun discs carved into stone gateways at Hattusha and Alaca Höyük, to the Faravahar motifs of Achaemenid ceremony, to the mythic Simurg of epic poetry. These are not arbitrary references. Each symbol carries centuries of accumulated meaning: solar authority, divine protection, wisdom gained through endurance. We study the original artefacts, understand the contexts in which they were created, and then translate their essence into forms designed for the contemporary body.",

      "Translation, not replication, is the key distinction. We never copy a historical motif directly. Instead, we extract its underlying logic — the geometry of a sun disc, the organic rhythm of a feathered wing, the way a spiral draws the eye inward — and rebuild it using our own design vocabulary. The result should feel familiar to anyone who has stood before an Anatolian relief carving, yet unmistakably new.",

      "Our design process is iterative and unforgiving. It begins with concept sketching, where intuition leads and the hand moves freely across paper. From there, proportional studies test each element against the human body it will eventually occupy — a bracelet must sit correctly on the wrist, a pendant must hang at the right point on the chest, an earring must move with the wearer rather than against them. Technical drafting follows, translating organic forms into precise specifications that production can follow faithfully. Dozens of variations are explored and discarded before a single form earns its place.",

      "The materials we work with are chosen for their character as much as their durability. Electroplated brass provides the warm, rich foundation that our designs require — a surface that responds to light with depth and warmth rather than flat reflectivity. Stainless steel adds structural integrity where strength matters most: clasps, connections, and load-bearing elements. Japanese Matsuno and Toho glass beads — sourced from manufacturers whose quality control is measured in fractions of a millimetre — bring colour, texture, and the subtle irregularity that distinguishes handcraft from machine output.",

      "Cotton cord, crystal, tube beads, and cube beads each play specific roles within our material palette. Cotton cord introduces a tactile softness that contrasts with the rigidity of metal, while crystal beads scatter light across a composition in ways that metal alone cannot achieve. Tube beads create linear rhythm; cube beads introduce angular geometry. No material is chosen for novelty — each earns its place by solving a design problem or completing a visual idea.",

      "Production moves through four distinct phases, each requiring a different kind of expertise. Plating defines a piece's final character — its colour, its lustre, the way it interacts with light throughout the day. The electrochemical process builds metal coatings atom by atom, with temperature, current density, and immersion time monitored to ensure consistency across every unit in a production run. Printing follows, applying colour, pattern, and detailed motifs directly onto the plated surface with the precision of a conventional printer, except the canvas is a small, three-dimensional metal charm rather than a sheet of paper.",

      "The final phase — handiwork — is where a collection of individual components becomes a finished piece. Beads are threaded in precise sequences, findings are attached, clasps are connected, and every element is checked for alignment, tension, and security. This is the most labour-intensive stage and the one most resistant to automation. The hands that perform this work carry years of accumulated knowledge — how tightly to pull a cord, how much pressure a connection can bear, when a bead sits flush and when it needs repositioning.",

      "Quality control is not a separate step but a constant presence throughout production. Each piece passes through multiple inspections, both visual and tactile. We handle, flex, and wear our own work before it leaves the workshop. A bracelet that looks perfect on a workbench but catches on skin or hangs unevenly on a wrist is sent back for adjustment. The standard is not technical perfection in isolation but a seamless experience for the person who will eventually wear it.",

      "Our partnerships reflect the same values that guide our production. We work with brands and retailers who understand that handcrafted jewelry requires a different kind of relationship — one built on patience, trust, and shared standards. Whether developing exclusive collections for a partner's market or producing under private label, we bring the same rigour to collaborative work as we do to our own collections.",

      "We operate across two retail expressions. Marine Blue Jewelry serves as our wholesale and direct-to-consumer platform, offering our broader catalog to an international audience. Segara Agung Perthiwi, also based in Bali, connects us directly to the Southeast Asian market, where customer interaction feeds back into our design process in real time. Each partnership teaches us something new about how our work is received, worn, and valued in different cultural contexts.",

      "Scale has never been our ambition. We are not interested in producing jewelry at volumes that require compromising on craft or materials. Every piece in our catalog can be traced back to the specific hands that assembled it. This traceability is not a marketing claim — it is a structural feature of how we work. Small batch production allows us to maintain the standards we have set while responding to the specific needs of each partner and collection.",

      "The objects we make are designed to be worn, not displayed. They are meant to accumulate stories — to be present at moments that matter, to develop a patina of personal history that no amount of polishing can replicate. A SMYRNA bracelet worn daily for a year is more beautiful than the day it left our workshop, because it carries with it the evidence of a life lived.",

      "We believe that the impulse to adorn is among the oldest and most universal human instincts — older than writing, older than agriculture, as old as the first shell strung on a cord and worn around a neck. Everything we do at SMYRNA is an extension of that impulse, refined through millennia of Anatolian craft knowledge and expressed through the best materials and techniques available to us today.",

      "We invite you to explore our work not as consumers but as participants in a tradition that connects the workshops of ancient Izmir to the wrists, necks, and ears of people living now. Every piece is a conversation between maker and wearer — a shared belief that the objects we carry with us should be worthy of the lives they accompany.",
    ],
    scrollHint: "Scroll the text",
    completionText: "Solo Waterfall,",
    completionUnderText: " -Marine Blue",
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

// ── Flat catalog tab helpers (used by per-model subpages) ──────────────────

export interface FlatCatalogTab extends CatalogTab {
  categoryLabel: string;
  categoryId: string;
  globalIndex: number;
}

export function getFlatCatalogTabs(): FlatCatalogTab[] {
  const flat: FlatCatalogTab[] = [];
  let idx = 0;
  for (const cat of siteContent.catalog.categories) {
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

export function getCatalogTabById(id: string): FlatCatalogTab | undefined {
  return getFlatCatalogTabs().find((t) => t.id === id);
}
