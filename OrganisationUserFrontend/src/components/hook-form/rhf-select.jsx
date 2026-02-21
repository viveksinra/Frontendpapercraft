'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

export function RHFSelect({ name, children, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          error={!!error}
          helperText={error?.message || helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}


