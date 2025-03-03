import { skipToken } from "@reduxjs/toolkit/query";

import { useState } from "react";
import { FiZoomIn } from "react-icons/fi";
import { FiZoomOut } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { PdfCoordinate } from "../../../../shared/types";
import useClerkToken from "../../hooks/useClerkToken";
import useFloorInfo from "../../hooks/useFloorInfo";
import { DEFAULT_PDF_SCALE_INDEX } from "../../settings";
import { useGetFloorPdfQuery } from "../../store/api/s3ApiSlice";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  floorCode: string;
  scale: number;
  offset: PdfCoordinate;
}

const PDF_SCALES = [1, 2, 2.5, 3, 3.5, 4, 4.5, 5];

const PDFViewer = ({ floorCode, scale, offset }: Props) => {
  // pdf scale
  const [pdfScaleIndex, setPdfScaleIndex] = useState(DEFAULT_PDF_SCALE_INDEX);
  const pdfScale = PDF_SCALES[pdfScaleIndex];
  scale /= pdfScale;

  // get pdf data
  const { buildingCode } = useFloorInfo(floorCode);
  const filePath = `pdf/${buildingCode}/${floorCode}.pdf`;
  const token = useClerkToken();
  const { data: pdfData } = useGetFloorPdfQuery(
    token ? { filePath, token } : skipToken,
  );

  const renderZoomInButton = () => {
    const disabled = pdfScaleIndex == PDF_SCALES.length - 1;

    const zoomIn = () => {
      setPdfScaleIndex(pdfScaleIndex + 1);
    };

    return (
      <button onClick={zoomIn} disabled={disabled}>
        <FiZoomIn
          className={`size-7 ${disabled ? "text-gray-400" : "cursor-pointer"}`}
        />
      </button>
    );
  };

  const renderZoomOutButton = () => {
    const disabled = pdfScaleIndex == 0;

    const zoomOut = () => {
      setPdfScaleIndex(pdfScaleIndex - 1);
    };

    return (
      <button onClick={zoomOut} disabled={disabled}>
        <FiZoomOut
          className={`size-7 ${disabled ? "text-gray-400" : "cursor-pointer"}`}
        />
      </button>
    );
  };

  if (!pdfData) {
    return;
  }

  return (
    <>
      <div className="absolute top-[3.75em] right-4 z-20 flex space-x-2 p-1">
        {renderZoomInButton()}
        {renderZoomOutButton()}
      </div>
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <Document file={`data:application/pdf;base64,${pdfData}`}>
          <div className={"border border-gray-400"}>
            <Page pageNumber={1} scale={pdfScale} />
          </div>
        </Document>
      </div>
    </>
  );
};

export default PDFViewer;
