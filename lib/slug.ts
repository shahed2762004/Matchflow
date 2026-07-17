/**
 * Turn a company name into a URL-safe slug. Preserves Unicode letters/numbers
 * (so Arabic company names survive), collapses whitespace and punctuation to
 * single hyphens, and trims leading/trailing hyphens.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Append a short random suffix to keep slugs unique on collision. */
export function withRandomSuffix(slug: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  const base = slug || "tenant";
  return `${base}-${suffix}`.slice(0, 60);
}
