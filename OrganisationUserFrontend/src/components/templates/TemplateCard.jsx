'use client';

import { Copy, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TemplateCard({ template, onClone, onEdit, onDelete, onSelect }) {
  const isPreBuilt = template.isPreBuilt;
  const id = template._id || template.id;

  return (
    <Card className="flex flex-col h-full">
      {/* Preview area */}
      <div className="h-32 bg-muted/50 border-b flex items-center justify-center text-muted-foreground text-xs p-4">
        <div className="w-full max-w-[140px] border border-dashed border-muted-foreground/30 rounded p-2 space-y-1">
          <div className="h-2 bg-muted-foreground/20 rounded w-3/4 mx-auto" />
          <div className="h-1.5 bg-muted-foreground/10 rounded w-full" />
          <div className="h-1.5 bg-muted-foreground/10 rounded w-5/6" />
          <div className="h-1.5 bg-muted-foreground/10 rounded w-4/6" />
        </div>
      </div>
      <CardContent className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">{template.name}</h3>
          {isPreBuilt && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">Pre-built</Badge>
          )}
        </div>
        {template.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        )}
        <div className="flex gap-2 mt-auto pt-2">
          {onSelect && (
            <Button size="sm" className="flex-1" onClick={() => onSelect(id)}>
              Use
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onClone?.(id)}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          {!isPreBuilt && onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit?.(id)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {!isPreBuilt && onDelete && (
            <Button size="sm" variant="outline" onClick={() => onDelete?.(id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
