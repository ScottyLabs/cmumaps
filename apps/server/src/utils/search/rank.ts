import type { GeoCoordinate } from "@cmumaps/common";
import type { Document, RoomDocument } from "./types";

/**
 * Get the number of terms in a document
 */
export function getNumTerms(doc: Document): number {
  return doc.numTerms;
}

/**
 * Calculate BM25 score for a single term
 * @param termFreq - Term frequency in the document
 * @param docLen - Document length (number of terms)
 * @param docFreq - Number of documents containing the term
 * @param numDocs - Total number of documents
 * @param avgDl - Average document length
 */
export function BM25Term(
  termFreq: number,
  docLen: number,
  docFreq: number,
  numDocs: number,
  avgDl: number,
): number {
  const k = 1.2;
  const b = 0.2;
  const tf = termFreq;
  const df = docFreq;
  const n = numDocs;

  const idfPart = Math.log((n - df + 0.5) / (df + 0.5) + 1.0);
  const tfPart = (tf * (k + 1.0)) / (tf + k * (1.0 - b + (b * docLen) / avgDl));

  return idfPart * tfPart;
}

/**
 * Calculate distance between two coordinates in meters
 */
export function coordDist(a: GeoCoordinate, b: GeoCoordinate): number {
  const latitudeRatio = 111318.8450631976;
  const longitudeRatio = 84719.3945182816;

  const xDiff = (a.latitude - b.latitude) * latitudeRatio;
  const yDiff = (a.longitude - b.longitude) * longitudeRatio;

  return Math.sqrt(xDiff ** 2 + yDiff ** 2);
}

/**
 * Apply distance-based weighting to a score
 * Closer results get a higher boost
 */
export function distanceWeightedScore(
  doc: RoomDocument,
  userPos: GeoCoordinate | null | undefined,
  score: number,
): number {
  if (!userPos || !doc.labelPosition) {
    return score;
  }

  const dist = coordDist(userPos, doc.labelPosition);
  return score + 1.0 / (Math.log(dist + 10.0) + 1.0);
}

/**
 * Get top N items from a ranked list
 * Uses a heap-like approach for efficiency
 */
export function topN(
  rankList: Array<[string, number]>,
  n: number,
): Array<[string, number]> {
  if (rankList.length <= n) {
    return rankList;
  }

  const heap: Array<[string, number]> = [];

  for (const item of rankList) {
    heap.push(item);

    if (heap.length > n) {
      // Sort by score descending
      heap.sort((a, b) => b[1] - a[1]);
      // Remove the lowest score
      heap.pop();
    }
  }

  return heap;
}
