'use client';

import { FileText, Package, Monitor, Layers } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────

const PRODUCT_TYPES = [
  { value: 'paper', label: 'Paper', icon: FileText, description: 'A single practice paper' },
  { value: 'paper_set', label: 'Paper Set', icon: Package, description: 'A collection of papers' },
  { value: 'test', label: 'Online Test', icon: Monitor, description: 'A timed online test' },
  { value: 'bundle', label: 'Bundle', icon: Layers, description: 'Multiple products at a discount' },
];

export default function ProductTypeSelector({ value, onChange, disabled }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {PRODUCT_TYPES.map((type) => {
        const Icon = type.icon;
        const isSelected = value === type.value;
        return (
          <button
            key={type.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(type.value)}
            className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
              isSelected
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-primary/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
              {type.label}
            </span>
            <span className="text-xs text-muted-foreground">{type.description}</span>
          </button>
        );
      })}
    </div>
  );
}
