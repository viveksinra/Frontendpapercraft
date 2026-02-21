'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

// ----------------------------------------------------------------------

export function RHFSelect({ name, label, helperText, options = [], placeholder, className, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {label && (
            <label htmlFor={name} className="text-sm font-medium leading-none">
              {label}
            </label>
          )}
          <Select value={field.value} onValueChange={field.onChange} {...other}>
            <SelectTrigger id={name} className={cn(error && 'border-destructive', className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(error?.message || helperText) && (
            <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
              {error?.message ?? helperText}
            </p>
          )}
        </div>
      )}
    />
  );
}
