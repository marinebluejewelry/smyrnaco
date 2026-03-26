import { notFound } from "next/navigation";
import { getFlatCatalogTabs } from "@/app/lib/data";
import { MobileModelView } from "./MobileModelView";

// ---------------------------------------------------------------------------
// /catalog/[id] — Per-model subpage for mobile devices.
//
// On mobile, each model gets its own page to avoid iOS OOM crashes from
// sequential 3D model loading within a single page context. Hard navigation
// between models forces a complete browser memory reset.
//
// On desktop, MobileModelView detects the larger viewport and redirects
// back to /catalog (the single-page tab experience).
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getFlatCatalogTabs().map((tab) => ({ id: tab.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CatalogModelPage({ params }: PageProps) {
  const { id } = await params;
  const allTabs = getFlatCatalogTabs();
  const tabIndex = allTabs.findIndex((t) => t.id === id);

  if (tabIndex === -1) notFound();

  const tab = allTabs[tabIndex];
  const prevId = allTabs[(tabIndex - 1 + allTabs.length) % allTabs.length].id;
  const nextId = allTabs[(tabIndex + 1) % allTabs.length].id;

  return <MobileModelView tab={tab} prevId={prevId} nextId={nextId} />;
}
