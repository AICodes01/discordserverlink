"use client";

export default function ServerCardSkeleton() {
  return (
    <div className="relative rounded-2xl flex flex-col overflow-hidden bg-zinc-900/80 border border-zinc-800/80 animate-pulse">
      {/* Banner skeleton */}
      <div className="relative h-28 w-full bg-zinc-800/60">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Content Body */}
      <div className="p-4 pt-0 flex-1 flex flex-col -mt-8 relative z-20">
        {/* Icon & stats row */}
        <div className="flex items-end justify-between mb-3">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl border-4 border-zinc-900 bg-zinc-700/60 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          {/* Stats pill */}
          <div className="h-7 w-28 rounded-xl bg-zinc-800/60 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>

        {/* Server name */}
        <div className="h-5 w-3/4 rounded-lg bg-zinc-700/60 mb-2 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        {/* Description lines */}
        <div className="space-y-1.5 mb-3">
          <div className="h-3.5 w-full rounded-md bg-zinc-800/60 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-3.5 w-5/6 rounded-md bg-zinc-800/60 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-14 rounded-full bg-zinc-800/60 relative overflow-hidden">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Join button */}
        <div className="mt-auto h-9 w-full rounded-xl bg-zinc-700/50 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ServerCardSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ServerCardSkeleton key={i} />
      ))}
    </div>
  );
}
