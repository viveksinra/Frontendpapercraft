'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ScoreDisplay } from '@papercraft/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Home } from 'lucide-react';

interface PostTestResultProps {
  testId: string;
  result: {
    marksObtained: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    rank?: number | null;
    percentile?: number | null;
    totalStudents?: number | null;
    isPassing?: boolean;
  };
}

export function PostTestResult({ testId, result }: PostTestResultProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card>
          <CardContent className="space-y-6 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold">Test Complete!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.isPassing ? 'Congratulations, you passed!' : 'Here are your results'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <ScoreDisplay
                marksObtained={result.marksObtained}
                totalMarks={result.totalMarks}
                percentage={result.percentage}
                grade={result.grade}
                rank={result.rank}
                percentile={result.percentile}
                totalStudents={result.totalStudents}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="flex gap-3"
            >
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/student/dashboard')}
              >
                <Home className="mr-1 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                className="flex-1"
                onClick={() => router.push(`/student/tests/${testId}/result`)}
              >
                <Eye className="mr-1 h-4 w-4" />
                Review
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
