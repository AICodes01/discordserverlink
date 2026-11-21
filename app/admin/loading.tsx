export default function GenericLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#0c0e14]">
      {/* Animated logo/spinner */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-2 border-zinc-800 absolute inset-0" />
        {/* Spinning gradient arc */}
        <div
          className="w-16 h-16 rounded-full spin-ring"
          style={{
            background: "conic-gradient(from 0deg, transparent 70%, #8b5cf6 100%)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px))",
          }}
        />
        {/* Center pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
        </div>
      </div>

      {/* Loading dots */}
      <div className="flex gap-1.5 mb-3">
        <span className="loading-dot w-2 h-2 rounded-full bg-violet-400" />
        <span className="loading-dot w-2 h-2 rounded-full bg-fuchsia-400" />
        <span className="loading-dot w-2 h-2 rounded-full bg-cyan-400" />
      </div>

      <p className="text-sm text-zinc-500 font-medium">Loading...</p>
    </div>
  );
}
