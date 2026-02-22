'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getUploadUrl, confirmUpload } from 'src/lib/course-api';

import { Button } from '@/components/ui/button';

export default function ThumbnailUploader({ courseId, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file || !courseId) return;

    try {
      setUploading(true);
      const companyId = getActiveCompanyIdFromCookie();
      const { uploadUrl, fileKey, cdnUrl } = await getUploadUrl(
        companyId, courseId, 'thumbnail',
        { fileName: file.name, contentType: file.type, fileSize: file.size }
      );

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      await confirmUpload(companyId, courseId, { fileKey, uploadType: 'thumbnail' });
      onChange(cdnUrl || fileKey);
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Thumbnail</label>
      {value ? (
        <div className="relative w-40 h-24">
          <img
            src={value}
            alt="Thumbnail"
            className="w-full h-full object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || !courseId}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="mr-2 h-3.5 w-3.5" />
          )}
          {uploading ? 'Uploading...' : courseId ? 'Upload Thumbnail' : 'Save course first'}
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
