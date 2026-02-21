'use client';

import { useState } from 'react';
import { Search, Copy, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BlueprintList({ blueprints = [], onClone, onEdit, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = blueprints.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search blueprints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No blueprints found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bp) => {
            const id = bp._id || bp.id;
            const isPreBuilt = bp.isPreBuilt;
            return (
              <Card key={id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{bp.name}</h3>
                      {isPreBuilt && <Badge variant="secondary" className="text-[10px]">Pre-built</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {bp.sections?.length || 0} sections &middot; {bp.totalMarks || 0} marks &middot; {bp.totalTimeMinutes || 0} min
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => onClone?.(id)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {!isPreBuilt && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => onEdit?.(id)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDelete?.(id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
