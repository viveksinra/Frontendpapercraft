'use client';

import { Check, Loader2 } from 'lucide-react';

export default function AutoSaveIndicator({ saving }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 text-xs"
      role="status"
      aria-live="polite"
    >
      {saving ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      ) : (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-600 dark:text-green-400">Saved</span>
        </>
      )}
    </div>
  );
}
