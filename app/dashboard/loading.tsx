export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0c0e14] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="h-9 w-56 rounded-2xl bg-zinc-800/60 mb-2 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        <div className="h-4 w-72 rounded-lg bg-zinc-800/40 mb-8 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-zinc-900/80 border border-zinc-800 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden animate-pulse">
          <div className="h-14 bg-zinc-800/60 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 border-t border-zinc-800/60 flex items-center px-4 gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-700/60 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 skeleton-shimmer" />
              </div>
              <div className="flex-1 h-4 rounded bg-zinc-700/60 relative overflow-hidden">
                <div className="absolute inset-0 skeleton-shimmer" />
              </div>
              <div className="w-20 h-4 rounded bg-zinc-800/60 relative overflow-hidden">
                <div className="absolute inset-0 skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
