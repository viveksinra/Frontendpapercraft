'use client';

import { useRef, useState } from 'react';
import { X, Video, Upload, Loader2 } from 'lucide-react';

import { getUploadUrl, confirmUpload } from 'src/lib/course-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Button } from '@/components/ui/button';

export default function VideoUploader({ courseId, value, onContentSet }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);
      const companyId = getActiveCompanyIdFromCookie();
      const { uploadUrl, fileKey, cdnUrl } = await getUploadUrl(
        companyId, courseId, 'video',
        { fileName: file.name, contentType: file.type, fileSize: file.size }
      );

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) setProgress(Math.round((evt.loaded / evt.total) * 100));
      });

      await new Promise((resolve, reject) => {
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.onload = () => (xhr.status < 400 ? resolve() : reject(new Error('Upload failed')));
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(file);
      });

      await confirmUpload(companyId, courseId, { fileKey, uploadType: 'video' });
      onContentSet?.({ videoUrl: cdnUrl || fileKey, fileKey, originalName: file.name });
    } catch (err) {
      console.error('Video upload failed:', err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  const hasVideo = value?.videoUrl || value?.fileKey;

  return (
    <div className="flex flex-col gap-2">
      {hasVideo ? (
        <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
          <Video className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm flex-1 truncate">{value.originalName || 'Video uploaded'}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onContentSet?.({ videoUrl: '', fileKey: '', originalName: '' })}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            Uploading... {progress}%
          </>
        ) : (
          <>
            <Upload className="mr-2 h-3.5 w-3.5" />
            {hasVideo ? 'Replace Video' : 'Upload Video'}
          </>
        )}
      </Button>

      {uploading && (
        <div className="w-full bg-muted rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
