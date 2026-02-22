'use client';

import { Input } from '@/components/ui/input';

export default function DripDatePicker({ value, onChange }) {
  const dateStr = value ? new Date(value).toISOString().slice(0, 16) : '';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground">Schedule Availability (Drip Date)</label>
      <Input
        type="datetime-local"
        value={dateStr}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val ? new Date(val).toISOString() : null);
        }}
      />
      {value && (
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onChange(null)}
        >
          Clear drip date
        </button>
      )}
    </div>
  );
}
