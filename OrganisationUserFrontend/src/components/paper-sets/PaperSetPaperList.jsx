'use client';

import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PaperStatusBadge from 'src/components/papers/PaperStatusBadge';

export default function PaperSetPaperList({ papers = [], onRemove, onReorder }) {
  if (papers.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground text-sm">
        No papers in this set. Add papers to get started.
      </p>
    );
  }

  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...papers];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onReorder?.(next);
  };

  const moveDown = (index) => {
    if (index >= papers.length - 1) return;
    const next = [...papers];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onReorder?.(next);
  };

  return (
    <div className="space-y-2">
      {papers.map((entry, i) => {
        const paper = entry.paper || entry;
        const id = entry.paperId || paper._id || paper.id;
        return (
          <div key={id} className="flex items-center gap-3 p-3 border rounded-md">
            <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}.</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{paper.title || 'Paper'}</p>
              <div className="flex gap-1.5 mt-0.5">
                {paper.status && <PaperStatusBadge status={paper.status} />}
                <Badge variant="outline" className="text-[10px]">
                  {(paper.sections?.length || 0)} sections
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveUp(i)} disabled={i === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveDown(i)} disabled={i >= papers.length - 1}>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onRemove?.(id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
