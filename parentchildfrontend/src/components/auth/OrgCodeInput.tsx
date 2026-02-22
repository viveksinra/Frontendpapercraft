'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            isValid && 'border-green-500 focus-visible:ring-green-500/50 focus-visible:border-green-500',
            isInvalid && 'border-red-400 focus-visible:ring-red-400/50 focus-visible:border-red-400',
            error && 'border-red-400 focus-visible:ring-red-400/50 focus-visible:border-red-400'
          )}
        />
        <AnimatePresence mode="wait">
          {isValid && (
            <motion.div
              key="valid"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </motion.div>
          )}
          {isInvalid && (
            <motion.div
              key="invalid"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <XCircle className="h-5 w-5 text-red-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-sm text-red-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {error}
          </motion.p>
        )}
        {isInvalid && !error && (
          <motion.p
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            Code must be 3-10 uppercase letters or numbers
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
