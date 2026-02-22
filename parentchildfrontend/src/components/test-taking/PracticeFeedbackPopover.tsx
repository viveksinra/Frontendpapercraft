'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PracticeFeedbackPopoverProps {
  visible: boolean;
  isCorrect: boolean;
  explanation?: string;
  correctAnswer?: string;
}

export function PracticeFeedbackPopover({
  visible,
  isCorrect,
  explanation,
  correctAnswer,
}: PracticeFeedbackPopoverProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
        >
          <Card
            className={
              isCorrect
                ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950'
                : 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950'
            }
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                )}
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  {!isCorrect && correctAnswer && (
                    <p className="text-xs">
                      <span className="font-medium">Correct answer: </span>
                      {correctAnswer}
                    </p>
                  )}
                  {explanation && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Lightbulb className="mt-0.5 h-3 w-3 flex-shrink-0" />
                      <span>{explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
