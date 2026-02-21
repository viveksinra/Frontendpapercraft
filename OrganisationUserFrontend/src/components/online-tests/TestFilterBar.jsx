'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

const TEST_MODES = [
  { value: 'all', label: 'All Modes' },
  { value: 'live_mock', label: 'Live Mock' },
  { value: 'anytime_mock', label: 'Anytime Mock' },
  { value: 'practice', label: 'Practice' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'section_timed', label: 'Section Timed' },
];

export default function TestFilterBar({ filters = {}, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tests by title..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.mode || 'all'}
        onValueChange={(value) => handleChange('mode', value)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Modes" />
        </SelectTrigger>
        <SelectContent>
          {TEST_MODES.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={filters.dateFrom || ''}
        onChange={(e) => handleChange('dateFrom', e.target.value)}
        className="w-full sm:w-[160px]"
        placeholder="From date"
      />

      <Input
        type="date"
        value={filters.dateTo || ''}
        onChange={(e) => handleChange('dateTo', e.target.value)}
        className="w-full sm:w-[160px]"
        placeholder="To date"
      />
    </div>
  );
}
