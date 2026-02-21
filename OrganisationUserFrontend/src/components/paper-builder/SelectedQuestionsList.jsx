'use client';

import { X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SelectedQuestionsList({ questions = [], onRemove, onReorder }) {
  if (questions.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground text-sm">
        No questions selected. Use the picker to add questions.
      </p>
    );
  }

  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...questions];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onReorder?.(next);
  };

  const moveDown = (index) => {
    if (index >= questions.length - 1) return;
    const next = [...questions];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onReorder?.(next);
  };

  return (
    <div className="space-y-2">
      {questions.map((q, i) => {
        const id = q._id || q.id;
        return (
          <div key={id} className="flex items-center gap-2 p-2.5 border rounded-md bg-background">
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-bold text-muted-foreground w-6">{i + 1}.</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate">{q.content?.text || q.title || 'Question'}</p>
              <div className="flex gap-1.5 mt-0.5">
                {q.type && <Badge variant="outline" className="text-[10px]">{q.type}</Badge>}
                {q.marks && <Badge variant="secondary" className="text-[10px]">{q.marks}m</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveUp(i)} disabled={i === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveDown(i)} disabled={i >= questions.length - 1}>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onRemove?.(id)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <span>{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
        <span>Total: {questions.reduce((s, q) => s + (q.marks || 0), 0)} marks</span>
      </div>
    </div>
  );
}
