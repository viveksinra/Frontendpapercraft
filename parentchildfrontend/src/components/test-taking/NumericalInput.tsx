'use client';

import { Input } from '@/components/ui/input';

interface NumericalInputProps {
  value: number | string | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function NumericalInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Enter a number',
}: NumericalInputProps) {
  const displayValue = value != null ? String(value) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') {
      onChange(null);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="max-w-xs">
      <Input
        type="number"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        step="any"
        className="tabular-nums"
      />
    </div>
  );
}
