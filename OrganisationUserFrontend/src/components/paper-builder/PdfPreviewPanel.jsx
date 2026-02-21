'use client';

import PdfViewer from 'src/components/pdf/PdfViewer';
import PdfThumbnail from 'src/components/pdf/PdfThumbnail';
import PdfDownloadButton from 'src/components/pdf/PdfDownloadButton';
import PdfGenerationStatus from 'src/components/pdf/PdfGenerationStatus';

export default function PdfPreviewPanel({ pdfs = [], pdfStatus, onDownload, activePdfUrl, onSelectPdf }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PdfGenerationStatus status={pdfStatus} />
        <PdfDownloadButton onDownload={onDownload} disabled={pdfStatus !== 'ready'} />
      </div>

      {pdfs.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {pdfs.map((pdf) => (
            <PdfThumbnail
              key={pdf.pdfType || pdf.type}
              pdfType={pdf.pdfType || pdf.type}
              onClick={() => onSelectPdf?.(pdf.url)}
            />
          ))}
        </div>
      )}

      <PdfViewer url={activePdfUrl} />
    </div>
  );
}
