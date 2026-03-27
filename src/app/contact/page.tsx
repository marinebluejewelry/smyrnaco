// ---------------------------------------------------------------------------
// Contact — split layout.
//
// Desktop: contact info + Monday form (50% left), Google Maps (50% right).
// Mobile:  Google Maps on top (30%), scrollable panel below (70%) containing
//          contact info + tall Monday form iframe. User scrolls the panel to
//          reveal more of the iframe, almost hiding the contact text.
//
// BottomMenu provided by root layout.
// ---------------------------------------------------------------------------

"use client";

import { useState, useEffect } from "react";

const MAP_ZOOM_DESKTOP = 16;
const MAP_ZOOM_MOBILE = 14;

export default function ContactPage() {
  const mapQuery = encodeURIComponent("441. Sk., Konak, Izmir, TR");
  const [zoom, setZoom] = useState(MAP_ZOOM_DESKTOP);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    setZoom(mq.matches ? MAP_ZOOM_MOBILE : MAP_ZOOM_DESKTOP);
    const handler = (e: MediaQueryListEvent) =>
      setZoom(e.matches ? MAP_ZOOM_MOBILE : MAP_ZOOM_DESKTOP);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="snap-container">

      {/* ── Text panel — contact info + Monday form ──────────────── */}
      {/* Mobile: contact-text-panel overrides snap-slide--text to 70% height */}
      <div className="snap-slide snap-slide--text contact-text-panel flex flex-col">
        {/* Contact info — natural height, scrolls away on both mobile and desktop */}
        <div className="flex-shrink-0 p-4 lg:p-12 xl:p-16">
          <div className="w-full max-w-xl">
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
                  441. Street<br />
                  Konak, Izmir 35360<br />
                  Turkey
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
                  Store
                </p>
                <a
                  href="https://wholesalejewelry.store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 transition-colors duration-300 hover:text-white"
                >
                  wholesalejewelry.store
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Monday.com form — tall so user can scroll into it on both mobile and desktop */}
        <div className="flex-shrink-0 border-t border-white/10 h-[80dvh]">
          <iframe
            src="https://forms.monday.com/forms/embed/106febb69aefb1e61ea3c361bbb784e4?r=use1"
            className="w-full h-full border-0"
            loading="lazy"
            title="Contact Form"
            allowFullScreen
          />
        </div>
      </div>

      {/* ── Media panel — Google Maps ─────────────────────────────── */}
      {/* Mobile: contact-map-panel overrides snap-slide--media to 30% height */}
      <div className="snap-slide snap-slide--media contact-map-panel relative">
        <iframe
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
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
