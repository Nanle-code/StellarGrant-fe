/**
 * Grant Detail — Loading Skeleton
 *
 * Next.js App Router automatic Suspense boundary.
 * Mirrors the real GrantDetailPage layout:
 *   • Header (title + status badge)
 *   • Funding panel (progress bar + narrow info column)
 *   • Milestone timeline (3 stacked rows)
 */

export default function GrantDetailLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Title shimmer */}
        <div className="shimmer h-9 w-72 rounded-none" />
        {/* Status badge shimmer */}
        <div className="shimmer h-6 w-24 rounded-none" />
      </div>
      {/* Description shimmer */}
      <div className="shimmer h-4 w-96 rounded-none mb-8" />

      {/* ── Funding panel ───────────────────────────────────────────────── */}
      <section className="mb-8 flex gap-6">
        {/* Main funding block */}
        <div className="flex-1 space-y-4">
          <div className="shimmer h-6 w-44 rounded-none" />
          {/* Progress bar */}
          <div className="shimmer h-3 w-full rounded-none" />
          <div className="grid grid-cols-2 gap-4">
            <div className="shimmer h-4 w-28 rounded-none" />
            <div className="shimmer h-4 w-28 rounded-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="shimmer h-4 w-36 rounded-none" />
            <div className="shimmer h-4 w-24 rounded-none" />
          </div>
        </div>
        {/* Narrow right-hand info panel */}
        <div className="shimmer h-44 w-44 rounded-none shrink-0" />
      </section>

      {/* ── Milestone timeline ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="shimmer h-6 w-32 rounded-none" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shimmer h-20 w-full rounded-none" />
        ))}
      </section>
    </div>
  );
}
