'use client';

import { TimerComponent } from '@papercraft/shared';
import { Button } from '@/components/ui/button';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { Flag, Send } from 'lucide-react';
import type { AutoSaveStatus } from '@/hooks/useAutoSave';
import type { TimerMode } from '@papercraft/shared';

interface TestHeaderProps {
  testTitle: string;
  sectionName?: string;
  totalSeconds: number;
  timerMode: TimerMode;
  onTimeUp: () => void;
  onFlag: () => void;
  onSubmit: () => void;
  isFlagged: boolean;
  autoSaveStatus: AutoSaveStatus;
  paused?: boolean;
}

export function TestHeader({
  testTitle,
  sectionName,
  totalSeconds,
  timerMode,
  onTimeUp,
  onFlag,
  onSubmit,
  isFlagged,
  autoSaveStatus,
  paused = false,
}: TestHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: title + section */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">{testTitle}</h1>
          {sectionName && (
            <p className="truncate text-xs text-muted-foreground">{sectionName}</p>
          )}
        </div>

        {/* Center: timer + auto-save */}
        <div className="flex flex-col items-center gap-0.5">
          <TimerComponent
            totalSeconds={totalSeconds}
            onExpiry={onTimeUp}
            mode={timerMode}
            paused={paused}
            className="text-base"
          />
          <AutoSaveIndicator status={autoSaveStatus} />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={isFlagged ? 'default' : 'outline'}
            size="icon"
            onClick={onFlag}
            className="h-8 w-8"
            title={isFlagged ? 'Unflag question' : 'Flag question'}
          >
            <Flag className={`h-4 w-4 ${isFlagged ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onSubmit}
            className="hidden sm:inline-flex"
          >
            <Send className="mr-1 h-3.5 w-3.5" />
            Submit
          </Button>
          {/* Mobile submit: icon only */}
          <Button
            variant="destructive"
            size="icon"
            onClick={onSubmit}
            className="h-8 w-8 sm:hidden"
            title="Submit test"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
