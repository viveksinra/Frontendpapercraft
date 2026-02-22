'use client';

import { useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrgCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const ORG_CODE_PATTERN = /^[A-Z0-9]{3,10}$/;

export function OrgCodeInput({ value, onChange, error, disabled }: OrgCodeInputProps) {
  const isValid = value.length > 0 && ORG_CODE_PATTERN.test(value);
  const isInvalid = value.length > 0 && !isValid;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
    },
    [onChange]
  );

  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          value={value}
          onChange={handleChange}
          placeholder="ORG CODE"
          disabled={disabled}
          maxLength={10}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-background/50 text-foreground font-mono text-lg tracking-widest uppercase pr-10 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2',
            isValid && 'border-green-500/60 focus:ring-green-500/30 focus:border-green-500/40',
            isInvalid && 'border-red-400/60 focus:ring-red-400/30 focus:border-red-400/40',
            error && 'border-red-400/60 focus:ring-red-400/30 focus:border-red-400/40',
            !isValid && !isInvalid && !error && 'border-border/60 focus:ring-primary/30 focus:border-primary/40'
          )}
        />
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-scale-in">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
        {isInvalid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-scale-in">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive animate-fade-in-up">{error}</p>}
      {isInvalid && !error && (
        <p className="text-xs text-muted-foreground animate-fade-in-up">
          Code must be 3-10 uppercase letters or numbers
        </p>
      )}
    </div>
  );
}
