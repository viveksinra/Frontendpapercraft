'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CatalogFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  sort: string;
  onSortChange: (val: string) => void;
}

export function CatalogFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
}: CatalogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">All Types</option>
        <option value="paper">Paper</option>
        <option value="paper_set">Paper Set</option>
        <option value="test">Test</option>
        <option value="bundle">Bundle</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="popularity">Most Popular</option>
      </select>
    </div>
  );
}
