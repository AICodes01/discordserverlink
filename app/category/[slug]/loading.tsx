export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#0c0e14]">
      <div className="bg-gradient-to-b from-zinc-900/60 to-transparent border-b border-zinc-800/50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/60 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
            <div className="h-8 w-48 rounded-xl bg-zinc-800/60 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
          </div>
          <div className="h-4 w-72 rounded-lg bg-zinc-800/40 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="relative rounded-2xl flex flex-col overflow-hidden bg-zinc-900/80 border border-zinc-800/80 animate-pulse">
              <div className="h-28 w-full bg-zinc-800/60 relative overflow-hidden">
                <div className="absolute inset-0 skeleton-shimmer" />
              </div>
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-zinc-700/60 relative overflow-hidden"><div className="absolute inset-0 skeleton-shimmer" /></div>
                <div className="h-3 w-full rounded bg-zinc-800/60 relative overflow-hidden"><div className="absolute inset-0 skeleton-shimmer" /></div>
                <div className="h-3 w-5/6 rounded bg-zinc-800/60 relative overflow-hidden"><div className="absolute inset-0 skeleton-shimmer" /></div>
                <div className="h-8 w-full rounded-xl bg-zinc-700/50 mt-2 relative overflow-hidden"><div className="absolute inset-0 skeleton-shimmer" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
