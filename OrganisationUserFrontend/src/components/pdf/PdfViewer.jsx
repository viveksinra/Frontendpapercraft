'use client';

export default function PdfViewer({ url, title = 'PDF Preview' }) {
  if (!url) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md text-muted-foreground text-sm">
        No PDF available
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      className="w-full h-[600px] border rounded-md"
      allowFullScreen
    />
  );
}
