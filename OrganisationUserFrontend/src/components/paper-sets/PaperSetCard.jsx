'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_MAP = {
  draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  published: { label: 'Published', className: 'bg-green-100 text-green-800 border-green-200' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export default function PaperSetCard({ paperSet, onClick }) {
  const statusConfig = STATUS_MAP[paperSet.status] || STATUS_MAP.draft;

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">{paperSet.title || 'Untitled Set'}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {paperSet.examType || 'General'} &middot; {paperSet.papers?.length || 0} paper{(paperSet.papers?.length || 0) !== 1 ? 's' : ''}
            </p>
            {paperSet.yearGroup && (
              <p className="text-xs text-muted-foreground">Year {paperSet.yearGroup}</p>
            )}
          </div>
          <Badge variant="outline" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
