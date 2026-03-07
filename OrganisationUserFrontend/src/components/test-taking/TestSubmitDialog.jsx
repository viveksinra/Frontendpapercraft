'use client';

import { Flag, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

export default function TestSubmitDialog({ open, onClose, onSubmit, summary = {} }) {
  const {
    total = 0,
    answered = 0,
    unanswered = 0,
    flagged = 0,
  } = summary;

  const hasUnanswered = unanswered > 0;
  const hasFlagged = flagged > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Submit Test</DialogTitle>
          <DialogDescription>
            Review your progress before final submission.
          </DialogDescription>
        </DialogHeader>

        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-1 rounded-lg border bg-muted/30 p-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-xl font-bold tabular-nums">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-lg border bg-green-50 p-3 dark:bg-green-950/30">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-xl font-bold tabular-nums text-green-700 dark:text-green-300">
              {answered}
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">Answered</span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-lg border bg-muted/30 p-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-xl font-bold tabular-nums">{unanswered}</span>
            <span className="text-xs text-muted-foreground">Unanswered</span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-lg border bg-amber-50 p-3 dark:bg-amber-950/30">
            <Flag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
              {flagged}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400">Flagged</span>
          </div>
        </div>

        {/* Warnings */}
        {(hasUnanswered || hasFlagged) && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              {hasUnanswered && (
                <p>
                  You have <span className="font-semibold">{unanswered} unanswered</span>{' '}
                  question{unanswered !== 1 ? 's' : ''}.
                </p>
              )}
              {hasFlagged && (
                <p>
                  You have <span className="font-semibold">{flagged} flagged</span>{' '}
                  question{flagged !== 1 ? 's' : ''} to review.
                </p>
              )}
              <p className="mt-1 text-amber-700/80 dark:text-amber-300/80">
                Once submitted, you cannot change your answers.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
