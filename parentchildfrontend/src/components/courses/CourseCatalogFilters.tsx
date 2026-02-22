'use client';

interface CourseCatalogFiltersProps {
  filters: {
    category: string;
    level: string;
    isFree: string;
    search: string;
    sort: string;
  };
  onChange: (filters: any) => void;
}

const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced', 'all_levels'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function CourseCatalogFilters({ filters, onChange }: CourseCatalogFiltersProps) {
  function update(field: string, value: string) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search courses..."
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
        className="flex h-9 flex-1 min-w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <select
        value={filters.level}
        onChange={(e) => update('level', e.target.value)}
        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
      >
        <option value="">All Levels</option>
        {LEVEL_OPTIONS.map((l) => (
          <option key={l} value={l}>{l.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
        ))}
      </select>
      <select
        value={filters.isFree}
        onChange={(e) => update('isFree', e.target.value)}
        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
      >
        <option value="">All Pricing</option>
        <option value="true">Free</option>
        <option value="false">Paid</option>
      </select>
      <select
        value={filters.sort}
        onChange={(e) => update('sort', e.target.value)}
        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
