/**
 * Deterministically formats numbers with US locale grouping (e.g. 197,603)
 * ensuring exact identical output between Node.js server-side rendering (SSR)
 * and client browser hydration regardless of host operating system or browser locale.
 */
export function formatNumber(
  value: number | string | null | undefined,
  fallback: string = "0"
): string {
  if (value === null || value === undefined || value === "") return fallback;
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) return fallback;
  return num.toLocaleString("en-US");
}
