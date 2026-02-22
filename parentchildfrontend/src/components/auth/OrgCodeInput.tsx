'use client';

import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
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
        <Input
          value={value}
          onChange={handleChange}
          placeholder="ORG CODE"
          disabled={disabled}
          maxLength={10}
          className={cn(
            'font-mono text-lg tracking-widest uppercase pr-10',
            isValid && 'border-green-500 focus-visible:ring-green-500',
            isInvalid && 'border-red-400 focus-visible:ring-red-400',
            error && 'border-red-400 focus-visible:ring-red-400'
          )}
        />
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
        {isInvalid && (
          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isInvalid && !error && (
        <p className="text-xs text-muted-foreground">
          Code must be 3-10 uppercase letters or numbers
        </p>
      )}
    </div>
  );
}
