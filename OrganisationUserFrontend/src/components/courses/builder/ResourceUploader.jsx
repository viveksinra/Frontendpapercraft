'use client';

import { useRef, useState } from 'react';
import { X, Upload, Loader2, Paperclip } from 'lucide-react';

import { getUploadUrl, confirmUpload } from 'src/lib/course-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Button } from '@/components/ui/button';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResourceUploader({ courseId, value, onContentSet }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const files = value?.files || [];

  async function handleFileSelect(e) {
    const fileList = Array.from(e.target.files || []);
    if (!fileList.length) return;

    try {
      setUploading(true);
      const companyId = getActiveCompanyIdFromCookie();
      const uploaded = [...files];

      for (const file of fileList) {
        const { uploadUrl, fileKey, cdnUrl } = await getUploadUrl(
          companyId, courseId, 'resource',
          { fileName: file.name, contentType: file.type, fileSize: file.size }
        );

        await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        await confirmUpload(companyId, courseId, { fileKey, uploadType: 'resource' });
        uploaded.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: cdnUrl || fileKey,
          fileKey,
        });
      }

      onContentSet?.({ files: uploaded });
    } catch (err) {
      console.error('Resource upload failed:', err);
    } finally {
      setUploading(false);
    }
  }

  function removeFile(index) {
    const updated = files.filter((_, i) => i !== index);
    onContentSet?.({ files: updated });
  }

  return (
    <div className="flex flex-col gap-2">
      {files.map((file, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
          <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm flex-1 truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}

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
          <><Upload className="mr-2 h-3.5 w-3.5" /> Add Files</>
        )}
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
