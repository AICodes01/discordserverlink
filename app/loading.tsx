import { ServerCardSkeletonGrid } from "@/components/ServerCardSkeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#0c0e14]">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="h-14 w-96 rounded-2xl bg-zinc-800/60 mx-auto mb-4 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-5 w-72 rounded-xl bg-zinc-800/40 mx-auto mb-8 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-14 w-72 rounded-2xl bg-zinc-700/50 mx-auto animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* Featured section skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-7 w-52 rounded-xl bg-zinc-800/60 mb-6 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        <ServerCardSkeletonGrid count={4} />
      </div>

      {/* Grid section skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-7 w-44 rounded-xl bg-zinc-800/60 mb-6 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        <ServerCardSkeletonGrid count={8} />
      </div>
    </div>
  );
}
