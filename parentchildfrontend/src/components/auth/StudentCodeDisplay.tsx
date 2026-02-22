'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';

interface StudentCodeDisplayProps {
  code: string;
}

export function StudentCodeDisplay({ code }: StudentCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 overflow-hidden relative">
      {/* Celebration pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-primary/30"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.05, opacity: 0 }}
        transition={{ duration: 1.5, repeat: 2, ease: 'easeOut' }}
      />
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Your Student Code
        </p>
        <motion.div
          className="rounded-lg bg-background border-2 border-dashed border-primary/30 px-6 py-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <span className="font-mono text-3xl font-bold tracking-[0.3em] gradient-text">
            {code}
          </span>
        </motion.div>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Share this code with your parent or guardian so they can link their account to yours.
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
