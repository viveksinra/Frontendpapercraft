'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';

// ----------------------------------------------------------------------

export function RHFTextField({ name, helperText, label, type = 'text', className, ...other }) {
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
          <Input
            {...field}
            id={name}
            type={type}
            value={field.value ?? ''}
            className={cn(error && 'border-destructive', className)}
            autoComplete="new-password"
            {...other}
          />
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
