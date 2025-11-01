import fs from "node:fs";

// Type definition for SearchIndex (corresponds to HashMap<String, Vec<(String, u16)>>)
export type SearchIndex = Record<string, [string, number][]>;

/**
 * Parse the search index from a JSON file
 * @param idxPath Path to the index file
 * @returns The parsed search index
 */
export function parseIndex(idxPath: string): SearchIndex {
  try {
    const data = fs.readFileSync(idxPath, "utf-8");
    const index = JSON.parse(data) as SearchIndex;
    return index;
  } catch (error) {
    throw new Error(`Failed to parse index file: ${error}`);
  }
}

/**
 * Parse documents from a JSON file
 * @param filePath Path to the documents file
 * @returns The parsed documents of type T
 */
export function parseDocs<T>(filePath: string): T {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const docs = JSON.parse(data) as T;
    return docs;
  } catch (error) {
    throw new Error(`Failed to parse documents file: ${error}`);
  }
}

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
