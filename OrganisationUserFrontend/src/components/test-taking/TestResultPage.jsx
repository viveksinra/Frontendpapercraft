'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Trophy, Target, Clock, BookOpen } from 'lucide-react';

import axiosInstance from '@/lib/axios';
import { v2Endpoints } from '@/lib/v2-endpoints';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

import QuestionReviewList from './QuestionReviewList';

function formatDuration(seconds) {
  if (!seconds) return '--';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  return `${mins}m ${secs}s`;
}

function getGradeLabel(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

export default function TestResultPage({ testId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResult = useCallback(async () => {
    if (!testId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(v2Endpoints.testTaking.result(testId));
      setResult(res.data);
    } catch (err) {
      console.error('Failed to fetch test result:', err);
      setError(err.message || 'Failed to load result');
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium">{error}</p>
        <button className="mt-2 text-sm text-primary underline" onClick={fetchResult}>
          Try again
        </button>
      </div>
    );
  }

  if (!result) return null;

  const percentage = result.percentage ?? (result.totalMarks ? (result.score / result.totalMarks) * 100 : 0);
  const passed = result.passed ?? percentage >= (result.passingPercentage ?? 40);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Score Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`rounded-full p-4 ${passed ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'}`}>
              <Trophy className={`h-10 w-10 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            </div>

            <div>
              <p className="text-4xl font-bold">{result.score ?? 0}/{result.totalMarks ?? 0}</p>
              <p className="text-lg text-muted-foreground mt-1">{percentage.toFixed(1)}%</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={passed ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                {passed ? 'PASSED' : 'FAILED'}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Grade: {getGradeLabel(percentage)}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(result.timeTaken)}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {result.answeredCount ?? 0}/{result.totalQuestions ?? 0} answered
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Breakdown */}
      {result.sections && result.sections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Section Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="text-right">Questions</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.sections.map((section, idx) => {
                  const sectionPct = section.totalMarks
                    ? ((section.score / section.totalMarks) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <TableRow key={section.sectionId ?? idx}>
                      <TableCell className="font-medium">
                        {section.title || `Section ${idx + 1}`}
                      </TableCell>
                      <TableCell className="text-right">
                        {section.score ?? 0}/{section.totalMarks ?? 0}
                      </TableCell>
                      <TableCell className="text-right">{sectionPct}%</TableCell>
                      <TableCell className="text-right">
                        {section.answeredCount ?? 0}/{section.totalQuestions ?? 0}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDuration(section.timeTaken)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Subject Breakdown */}
      {result.subjects && result.subjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="text-right">Questions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.subjects.map((subject, idx) => {
                  const subjectPct = subject.totalMarks
                    ? ((subject.score / subject.totalMarks) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <TableRow key={subject.subjectId ?? idx}>
                      <TableCell className="font-medium">
                        {subject.name || `Subject ${idx + 1}`}
                      </TableCell>
                      <TableCell className="text-right">
                        {subject.score ?? 0}/{subject.totalMarks ?? 0}
                      </TableCell>
                      <TableCell className="text-right">{subjectPct}%</TableCell>
                      <TableCell className="text-right">
                        {subject.correctCount ?? 0}/{subject.totalQuestions ?? 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Question Review */}
      {result.answers && result.answers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionReviewList
              answers={result.answers}
              showSolutions={result.showSolutions ?? false}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
