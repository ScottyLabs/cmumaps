import type { GeoCoordinate } from "@cmumaps/common";
import { getSearchContext } from "../utils/search/build";
import { parseQuery } from "../utils/search/parse";
import { BM25Term, distanceWeightedScore, topN } from "../utils/search/rank";
import type { Document, RoomDocument } from "../utils/search/types";

const DEFAULT_NUM_RESULTS = 20;

// Cache the search context (index, documents, and avgDl)
let searchContextCache:
  | (Awaited<ReturnType<typeof getSearchContext>> & {
      avgDl: number;
    })
  | null = null;

async function getOrBuildSearchContext() {
  if (!searchContextCache) {
    console.log("Building search context...");
    const context = await getSearchContext();

    // Calculate average document length once during build
    const numDocs = Object.keys(context.documents).length;
    let avgDl = 0;
    for (const doc of Object.values(context.documents)) {
      avgDl += doc.numTerms;
    }
    avgDl /= numDocs;

    searchContextCache = { ...context, avgDl };
    console.log(
      `Search context built with ${numDocs} documents (avgDl: ${avgDl.toFixed(2)})`,
    );
  }
  return searchContextCache;
}

export const searchService = {
  async search(
    query: string,
    n?: number,
    lat?: number,
    lon?: number,
  ): Promise<Document[]> {
    const startTime = Date.now();

    // Get or build search context
    const { index, documents, avgDl } = await getOrBuildSearchContext();

    // Parse query into trigrams
    const queryTerms = parseQuery(query);
    const pos: GeoCoordinate | undefined =
      lat !== undefined && lon !== undefined
        ? { latitude: lat, longitude: lon }
        : undefined;

    const numResults = n ?? DEFAULT_NUM_RESULTS;
    const numDocs = Object.keys(documents).length;

    const overallScores = new Map<string, number>();

    console.log(
      `Starting search for query: ${query} (${queryTerms.length} terms) at ${Date.now() - startTime}ms`,
    );

    // For each term in the query
    for (const word of queryTerms) {
      const relDocs = index[word];
      if (!relDocs || relDocs.length === 0) {
        continue;
      }

      const docFreq = relDocs.length;

      // Score each document containing this term
      for (const [docId, termFreq] of relDocs) {
        const doc = documents[docId];
        if (!doc) continue;

        const docLen = doc.numTerms;
        const score = BM25Term(termFreq, docLen, docFreq, numDocs, avgDl);

        // Accumulate scores
        const currentScore = overallScores.get(docId) ?? 0;
        overallScores.set(docId, currentScore + score);
      }

      console.log(`Processed word '${word}' at ${Date.now() - startTime}ms`);
    }

    // Apply distance weighting for rooms if position is provided
    const scoredDocs: Array<[string, number]> = Array.from(
      overallScores.entries(),
    ).map(([docId, score]) => {
      const doc = documents[docId];
      if (doc.type === "room") {
        return [docId, distanceWeightedScore(doc as RoomDocument, pos, score)];
      }
      return [docId, score];
    });

    // Get top N results (sorted by score descending)
    const topResults = topN(scoredDocs, numResults, true);
    console.log(`Overall scores calculated at ${Date.now() - startTime}ms`);

    // Return the documents (without scores)
    return topResults.map(([docId, _]) => documents[docId]);
  },

  async rebuildSearchContext(): Promise<{
    message: string;
    documentCount: number;
  }> {
    console.log("Rebuilding search index...");
    const context = await getSearchContext();

    // Calculate average document length
    const numDocs = Object.keys(context.documents).length;
    let avgDl = 0;
    for (const doc of Object.values(context.documents)) {
      avgDl += doc.numTerms;
    }
    avgDl /= numDocs;

    searchContextCache = { ...context, avgDl };
    return {
      message: "Search index rebuilt successfully",
      documentCount: numDocs,
    };
  },
};
