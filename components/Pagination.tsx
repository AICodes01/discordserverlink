import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string | number | undefined>;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = {},
  totalItems,
  itemsPerPage = 24,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) {
      params.set("page", p.toString());
    }
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && k !== "page") {
        params.set(k, v.toString());
      }
    });

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Generate pagination window: e.g. [1, '...', 4, 5, 6, '...', 20]
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // numbers to show around current

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Summary counts
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage;

  return (
    <div className="pt-8 pb-4 flex flex-col items-center gap-4">
      <nav
        aria-label="Pagination"
        className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-xl backdrop-blur-sm"
      >
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <span
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 cursor-not-allowed"
            aria-disabled="true"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2.5 py-1.5 text-xs sm:text-sm font-bold text-zinc-600 select-none"
                >
                  •••
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            if (isActive) {
              return (
                <span
                  key={pageNum}
                  className="min-w-[36px] h-9 px-3 rounded-xl bg-discord-blurple text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-glow-sm"
                  aria-current="page"
                >
                  {pageNum}
                </span>
              );
            }

            return (
              <Link
                key={pageNum}
                href={buildUrl(pageNum)}
                className="min-w-[36px] h-9 px-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/90 font-semibold text-xs sm:text-sm flex items-center justify-center transition"
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 cursor-not-allowed"
            aria-disabled="true"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </nav>

      {/* Item summary counter */}
      {totalItems !== undefined && (
        <p className="text-xs text-zinc-500 font-medium">
          Showing <span className="text-zinc-300 font-semibold">{startItem.toLocaleString()}</span> to{" "}
          <span className="text-zinc-300 font-semibold">{endItem.toLocaleString()}</span> of{" "}
          <span className="text-zinc-200 font-bold">{totalItems.toLocaleString()}</span> servers
        </p>
      )}
    </div>
  );
}
