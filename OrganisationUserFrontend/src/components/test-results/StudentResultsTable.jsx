'use client';

import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

function getGrade(percentage) {
  if (percentage >= 90) return { label: 'A+', variant: 'default' };
  if (percentage >= 80) return { label: 'A', variant: 'default' };
  if (percentage >= 70) return { label: 'B', variant: 'secondary' };
  if (percentage >= 60) return { label: 'C', variant: 'secondary' };
  if (percentage >= 50) return { label: 'D', variant: 'outline' };
  return { label: 'F', variant: 'destructive' };
}

function formatDuration(seconds) {
  if (!seconds) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function StudentResultsTable({ attempts = [], onStudentClick }) {
  if (attempts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No student attempts found.
      </div>
    );
  }

  const sorted = [...attempts].sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Student</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Percentage</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead className="text-right">Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((attempt, idx) => {
          const percentage = attempt.percentage ?? 0;
          const grade = getGrade(percentage);

          return (
            <TableRow key={attempt._id ?? attempt.studentId ?? idx}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell className="font-medium">
                {attempt.studentName || attempt.studentEmail || 'Unknown'}
              </TableCell>
              <TableCell className="text-right">
                {attempt.score ?? 0}/{attempt.totalMarks ?? 0}
              </TableCell>
              <TableCell className="text-right">{percentage.toFixed(1)}%</TableCell>
              <TableCell>
                <Badge variant={grade.variant}>{grade.label}</Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDuration(attempt.timeTaken)}
              </TableCell>
              <TableCell>
                <Badge variant={attempt.status === 'submitted' ? 'default' : 'outline'}>
                  {attempt.status || 'pending'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {onStudentClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onStudentClick(attempt)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
