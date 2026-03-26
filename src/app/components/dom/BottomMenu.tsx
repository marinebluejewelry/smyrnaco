"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// BottomMenu — persistent global navigation fixed at the bottom of the
// viewport. Renders in the root layout so it survives page transitions.
//
// Features:
//   • 6 nav links with active-page highlighting via usePathname()
//   • Horizontally scrollable on mobile with visible scrollbar
//   • Glassmorphism background for luxury feel
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Partners", href: "/partners" },
  { label: "How We Do It", href: "/how-we-do-it" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

export function BottomMenu() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center justify-center border-t border-white/5 bg-black/80 backdrop-blur-md flex-shrink-0 pb-3 lg:pb-0 z-50"
      style={{ minHeight: "60px" }}
    >
      <ul
        className="steps-scrollbar flex items-center gap-4 px-4 lg:gap-8 xl:gap-12 overflow-x-auto whitespace-nowrap lg:overflow-x-visible lg:justify-center"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  block py-2 text-[0.55rem] uppercase tracking-[0.3em] transition-colors duration-300
                  md:text-[0.6rem]
                  ${isActive
                    ? "text-white"
                    : "text-white/35 hover:text-white/60"
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomMenu;
