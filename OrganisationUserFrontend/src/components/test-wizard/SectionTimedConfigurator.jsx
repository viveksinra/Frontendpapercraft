'use client';

import { useMemo } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SectionTimedConfigurator({ sections, onChange }) {
  const totalMinutes = useMemo(() => (sections || []).reduce((sum, s) => sum + (Number(s.timeLimit) || 0), 0), [sections]);

  const handleTimeLimitChange = (index, minutes) => {
    const updated = (sections || []).map((s, i) =>
      i === index ? { ...s, timeLimit: minutes } : s
    );
    onChange(updated);
  };

  if (!sections || sections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No sections defined. Add sections in the Source step first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-300">
            No going back between sections
          </p>
          <p className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">
            Students will not be able to return to previous sections once they move on.
            Each section has its own countdown timer.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-md border bg-muted/30 p-3"
          >
            <div className="flex-1">
              <p className="text-sm font-medium">
                {section.name || `Section ${index + 1}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {section.questions?.length || 0} question(s)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">
                Time limit
              </Label>
              <div className="relative w-24">
                <Input
                  type="number"
                  min={1}
                  value={section.timeLimit || ''}
                  onChange={(e) => handleTimeLimitChange(index, e.target.value)}
                  placeholder="min"
                  className="h-8 text-sm pr-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  min
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total time summary */}
      <div className="flex items-center justify-between rounded-md bg-muted px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Total Time
        </div>
        <span className="text-sm font-semibold">
          {totalMinutes} minute{totalMinutes !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
