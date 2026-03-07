'use client';

import { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';

import { getChildren } from '@/lib/parent-api';
import { Label } from '@/components/ui/label';

interface ChildSelectorProps {
  selectedChildId: string;
  onSelect: (childId: string, childName: string, companyId: string) => void;
}

function getChildCompanyId(child: any): string {
  const orgs = child?.student?.organizations || child?.organizations || [];
  const active = orgs.find((o: any) => o.isActive);
  return active?.companyId || orgs[0]?.companyId || '';
}

export function ChildSelector({ selectedChildId, onSelect }: ChildSelectorProps) {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChildren();
        const list = data?.children || data || [];
        setChildren(list);
        // Auto-select first child if none selected
        if (list.length > 0 && !selectedChildId) {
          const first = list[0];
          const id = first.student?.id || first.student?.userId || first.id || first.userId;
          const name = first.student?.name || first.name || '';
          const companyId = getChildCompanyId(first);
          onSelect(id, name, companyId);
        }
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            (c: any) => (c.student?.id || c.student?.userId || c.id || c.userId) === e.target.value
          );
          const name = child?.student?.name || child?.name || '';
          const companyId = getChildCompanyId(child);
          onSelect(e.target.value, name, companyId);
        }}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Select a child...</option>
        {children.map((child: any) => {
          const id = child.student?.id || child.student?.userId || child.id || child.userId;
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
