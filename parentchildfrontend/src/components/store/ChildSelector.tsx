'use client';

import { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';

import { getChildren } from '@/lib/parent-api';
import { Label } from '@/components/ui/label';

interface ChildSelectorProps {
  selectedChildId: string;
  onSelect: (childId: string, childName: string) => void;
}

export function ChildSelector({ selectedChildId, onSelect }: ChildSelectorProps) {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChildren();
        setChildren(data?.children || data || []);
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading children...
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        No linked children found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Purchase for child</Label>
      <select
        value={selectedChildId}
        onChange={(e) => {
          const child = children.find(
            (c: any) => (c.student?.id || c.id || c.userId) === e.target.value
          );
          const name = child?.student?.name || child?.name || '';
          onSelect(e.target.value, name);
        }}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Select a child...</option>
        {children.map((child: any) => {
          const id = child.student?.id || child.id || child.userId;
          const name = child.student?.name || child.name;
          return (
            <option key={id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
