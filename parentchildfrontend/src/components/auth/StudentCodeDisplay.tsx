'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 relative overflow-hidden">
      {/* Pulse ring decoration */}
      <div className="absolute inset-0 rounded-2xl pulse-glow opacity-20 pointer-events-none" />

      <div className="flex flex-col items-center gap-4 relative">
        <p className="text-sm font-medium text-muted-foreground">
          Your Student Code
        </p>
        <div className="rounded-xl bg-background/80 border-2 border-dashed border-primary/30 px-6 py-4 animate-scale-in">
          <span className="font-mono text-3xl font-bold tracking-[0.3em] text-gradient-static">
            {code}
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Share this code with your parent or guardian so they can link their account to yours.
        </p>
        <Button
          variant="outline"
          onClick={handleCopy}
          className="gap-2 rounded-xl"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500 animate-scale-in" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
