'use client';

import { Lock, Calendar } from 'lucide-react';

interface DripLockOverlayProps {
  dripDate: string;
}

export default function DripLockOverlay({ dripDate }: DripLockOverlayProps) {
  const date = new Date(dripDate);
  const formatted = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
        <Lock className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-semibold">This lesson is locked</h3>
        <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
          <Calendar className="h-4 w-4" />
          Available on {formatted}
        </p>
      </div>
    </div>
  );
}
