'use client';

import { Download, FileText, File, Image, Music, Video } from 'lucide-react';

interface Resource {
  url: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
}

interface ResourceLessonProps {
  resources: Resource[];
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('pdf')) return FileText;
  return File;
}

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResourceLesson({ resources }: ResourceLessonProps) {
  if (!resources?.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">No resources available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Downloadable Resources</h3>
      <div className="space-y-1">
        {resources.map((resource, i) => {
          const Icon = getFileIcon(resource.mimeType);
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent/50 transition-colors"
            >
              <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{resource.fileName}</p>
                {resource.fileSize && (
                  <p className="text-xs text-muted-foreground">{formatSize(resource.fileSize)}</p>
                )}
              </div>
              <a
                href={resource.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-accent shrink-0"
              >
                <Download className="h-3 w-3" /> Download
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
