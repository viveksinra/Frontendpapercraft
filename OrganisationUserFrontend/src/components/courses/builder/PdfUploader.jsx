'use client';

import { useRef, useState } from 'react';
import { X, Upload, Loader2, FileText } from 'lucide-react';

import { getUploadUrl, confirmUpload } from 'src/lib/course-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Button } from '@/components/ui/button';

export default function PdfUploader({ courseId, value, onContentSet }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const companyId = getActiveCompanyIdFromCookie();
      const { uploadUrl, fileKey, cdnUrl } = await getUploadUrl(
        companyId, courseId, 'pdf',
        { fileName: file.name, contentType: file.type, fileSize: file.size }
      );

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      await confirmUpload(companyId, courseId, { fileKey, uploadType: 'pdf' });
      onContentSet?.({ pdfUrl: cdnUrl || fileKey, fileKey, originalName: file.name });
    } catch (err) {
      console.error('PDF upload failed:', err);
    } finally {
      setUploading(false);
    }
  }

  const hasPdf = value?.pdfUrl || value?.fileKey;

  return (
    <div className="flex flex-col gap-2">
      {hasPdf && (
        <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm flex-1 truncate">{value.originalName || 'PDF uploaded'}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onContentSet?.({ pdfUrl: '', fileKey: '', originalName: '' })}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Uploading...</>
        ) : (
          <><Upload className="mr-2 h-3.5 w-3.5" /> {hasPdf ? 'Replace PDF' : 'Upload PDF'}</>
        )}
      </Button>
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}
