import type { GeoCoordinate } from "@cmumaps/common";
import { dist } from "@cmumaps/common";
import type { RoomDocument } from "./types";

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

  const d = dist(userPos, doc.labelPosition);
  return score + 1.0 / (Math.log(d + 10.0) + 1.0);
}

/**
 * Get top N items from a ranked list
 * @param rankList - Array of [id, score] tuples
 * @param n - Number of top items to return
 * @param sort - Whether to sort results by score descending (default: false)
 */
export function topN(
  rankList: Array<[string, number]>,
  n: number,
  sort = false,
): Array<[string, number]> {
  let result: Array<[string, number]>;

  if (rankList.length <= n) {
    result = rankList;
    if (sort) result.sort((a, b) => b[1] - a[1]);
  } else {
    result = rankList.sort((a, b) => b[1] - a[1]).slice(0, n);
  }

  return result;
}
