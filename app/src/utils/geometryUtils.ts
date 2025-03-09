import { PdfCoordinate } from "@cmumaps/shared";

export const distPointToLine = (p1: number[], p2: number[], p3: number[]) => {
  const x = p1[0];
  const y = p1[1];
  const x1 = p2[0];
  const y1 = p2[1];
  const x2 = p3[0];
  const y2 = p3[1];

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;

  //in case of 0 length line
  if (len_sq != 0) {
    param = dot / len_sq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

export const dist = (p1: PdfCoordinate, p2: PdfCoordinate) => {
  return Number(Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2).toFixed(2));
};
