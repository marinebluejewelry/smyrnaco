// ---------------------------------------------------------------------------
// Contact — 50/50 split layout with Google Maps.
//
// Desktop: contact info on left, Google Maps iframe on right.
// Mobile:  map on top (34%), contact info on bottom (66%).
//
// Uses a simple Google Maps iframe embed — no API key required.
// BottomMenu provided by root layout.
// ---------------------------------------------------------------------------

export default function ContactPage() {
  // TODO: Replace with actual business address
  const mapQuery = encodeURIComponent("New York, NY");

  return (
    <div className="snap-container">

      {/* ── Text panel — contact info ──────────────────────────────── */}
      <div className="snap-slide snap-slide--text flex items-start justify-start md:items-center md:justify-center p-4 md:p-12 lg:p-16">
        <div className="w-full max-w-xl p-5 md:p-12">
          <p className="mb-4 text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
            Get In Touch
          </p>
          <h1
            className="mb-8 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Contact
          </h1>

          <div className="space-y-8 text-sm leading-relaxed text-white/50">

            {/* Address */}
            <div>
              <p className="mb-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/30">
                Address
              </p>
              <p>
                {/* TODO: Replace with actual address */}
                123 Example Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="mb-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/30">
                Email
              </p>
              <a
                href="mailto:web@marinebluejewelry.com"
                className="text-white/50 transition-colors duration-300 hover:text-white"
              >
                web@marinebluejewelry.com
              </a>
            </div>

            {/* Website */}
            <div>
              <p className="mb-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/30">
                Online
              </p>
              <a
                href="https://marinebluejewelry.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 transition-colors duration-300 hover:text-white"
              >
                marinebluejewelry.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Media panel — Google Maps ─────────────────────────────── */}
      <div className="snap-slide snap-slide--media relative">
        <iframe
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SMYRNA Location"
          allowFullScreen
        />
      </div>
    </div>
  );
}
