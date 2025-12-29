/**
 * Generate trigrams from a string
 * @param s Input string
 * @returns Array of trigrams
 */
function trigrams(s: string): string[] {
  const paddedStr = `#${s}#`;
  const trigrams: string[] = [];

  for (let i = 0; i < paddedStr.length - 2; i++) {
    trigrams.push(paddedStr.slice(i, i + 3));
  }

  return trigrams;
}

/**
 * Parse a query string into trigrams
 * @param query The search query
 * @returns Array of trigrams extracted from the query
 */
export function parseQuery(query: string): string[] {
  const cleanedQuery = query.trim().toLowerCase();
  const nonAlphanumRegex = /[^a-zA-Z0-9 ]/g;
  const splitQuery = cleanedQuery.split(nonAlphanumRegex);

  const allTrigrams = splitQuery.flatMap((term) => {
    if (term.length > 0) {
      return trigrams(term);
    }
    return [];
  });

  return allTrigrams;
}
