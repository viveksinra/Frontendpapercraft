'use client';

import { Loader2 } from 'lucide-react';

export default function ParsingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-medium">Parsing your file...</p>
      <p className="text-sm text-muted-foreground">Detecting question format and extracting data</p>
    </div>
  );
}
