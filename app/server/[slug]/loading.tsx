export default function ServerDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0c0e14]">
      {/* Banner skeleton */}
      <div className="relative h-64 w-full bg-zinc-800/60 animate-pulse overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
        {/* Icon + actions row */}
        <div className="flex items-end justify-between mb-8">
          <div className="w-28 h-28 rounded-3xl border-4 border-[#0c0e14] bg-zinc-800 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-12 w-40 rounded-2xl bg-zinc-800/60 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>

        {/* Title */}
        <div className="h-9 w-72 rounded-2xl bg-zinc-800/60 mb-3 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-20 rounded-full bg-zinc-800/60 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-4 rounded-lg bg-zinc-800/60 animate-pulse relative overflow-hidden ${i === 4 ? "w-2/3" : "w-full"}`}
            >
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-zinc-800/60 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
