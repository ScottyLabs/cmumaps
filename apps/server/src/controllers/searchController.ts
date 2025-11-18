import type { GeoCoordinate } from "@cmumaps/common";
import { Get, Query, Route } from "tsoa";
import { getSearchContext } from "../utils/search/build";
import { parseQuery } from "../utils/search/parse";
import {
  BM25Term,
  distanceWeightedScore,
  getNumTerms,
  topN,
} from "../utils/search/rank";
import type { Document, RoomDocument } from "../utils/search/types";

// Cache the search context (index and documents)
let searchContextCache: Awaited<ReturnType<typeof getSearchContext>> | null =
  null;

async function getOrBuildSearchContext() {
  if (!searchContextCache) {
    console.log("Building search context...");
    searchContextCache = await getSearchContext();
    console.log(
      `Search context built with ${Object.keys(searchContextCache.documents).length} documents`,
    );
  }
  return searchContextCache;
}

@Route("search")
export class SearchController {
  @Get("/")
  public async search(
    @Query() query: string,
    @Query() n?: number,
    @Query() lat?: number,
    @Query() lon?: number,
  ): Promise<Document[]> {
    const startTime = Date.now();

    // Get or build search context
    const { index, documents } = await getOrBuildSearchContext();

    // Parse query into trigrams
    const queryTerms = parseQuery(query);
    const pos: GeoCoordinate | undefined =
      lat !== undefined && lon !== undefined
        ? { latitude: lat, longitude: lon }
        : undefined;

    const numResults = n ?? 20;
    const numDocs = Object.keys(documents).length;

    // Calculate average document length
    let avgDl = 0;
    for (const doc of Object.values(documents)) {
      avgDl += getNumTerms(doc);
    }
    avgDl /= numDocs;

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

        const docLen = getNumTerms(doc);
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

    // Get top N results
    const topResults = topN(scoredDocs, numResults);

    // Sort by score descending
    topResults.sort((a, b) => b[1] - a[1]);

    console.log(`Overall scores calculated at ${Date.now() - startTime}ms`);

    // Return the documents (without scores)
    return topResults.map(([docId, _]) => documents[docId]);
  }

  @Get("/rebuild")
  public async rebuildIndex(): Promise<{
    message: string;
    documentCount: number;
  }> {
    console.log("Rebuilding search index...");
    searchContextCache = await getSearchContext();
    return {
      message: "Search index rebuilt successfully",
      documentCount: Object.keys(searchContextCache.documents).length,
    };
  }
}
