'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreRevealAnimationProps {
  percentage: number;
  grade: string;
  marksObtained: number;
  totalMarks: number;
}

function getGradeColor(grade: string): string {
  const g = grade.toUpperCase();
  if (g === 'A+' || g === 'A*' || g === 'A') return 'text-green-600 dark:text-green-400';
  if (g === 'B') return 'text-blue-600 dark:text-blue-400';
  if (g === 'C') return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function ScoreRevealAnimation({
  percentage,
  grade,
  marksObtained,
  totalMarks,
}: ScoreRevealAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative flex h-32 w-32 items-center justify-center"
          >
            {/* Circular progress background */}
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className={getGradeColor(grade)}
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100),
                }}
                transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="block text-3xl font-bold tabular-nums"
              >
                {percentage.toFixed(0)}%
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="text-center"
          >
            <span className={`text-4xl font-extrabold ${getGradeColor(grade)}`}>
              {grade}
            </span>
            <p className="mt-1 text-sm text-muted-foreground">
              {marksObtained} / {totalMarks} marks
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
