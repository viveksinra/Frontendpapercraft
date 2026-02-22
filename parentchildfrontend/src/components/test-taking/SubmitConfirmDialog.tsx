'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Send } from 'lucide-react';

interface SubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  summary: {
    answered: number;
    unanswered: number;
    flagged: number;
    total: number;
  };
  submitting?: boolean;
}

export function SubmitConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  summary,
  submitting = false,
}: SubmitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Submit Test
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to submit? You cannot change your answers after submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Total Questions</span>
            <span className="font-semibold">{summary.total}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 dark:text-green-400">Answered</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{summary.answered}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Unanswered</span>
            <span className="font-semibold">{summary.unanswered}</span>
          </div>
          {summary.flagged > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-600 dark:text-amber-400">Flagged</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{summary.flagged}</span>
            </div>
          )}
        </div>

        {summary.unanswered > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-xs text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>
              You have {summary.unanswered} unanswered {summary.unanswered === 1 ? 'question' : 'questions'}.
            </span>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Go Back
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
