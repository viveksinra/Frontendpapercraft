'use client';

import { Archive, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BulkActionBar({ selectedCount, onArchive, onSubmitForReview, onClearSelection }) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={onSubmitForReview}>
          <Send className="mr-1.5 h-3.5 w-3.5" />
          Submit for Review
        </Button>
        <Button variant="outline" size="sm" onClick={onArchive}>
          <Archive className="mr-1.5 h-3.5 w-3.5" />
          Archive
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear
        </Button>
      </div>
    </div>
  );
}
