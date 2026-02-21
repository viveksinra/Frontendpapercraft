'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

import axiosInstance from '@/lib/axios';
import { v2Endpoints } from '@/lib/v2-endpoints';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import QuestionGradingTabs from './QuestionGradingTabs';
import GradingProgressBar from './GradingProgressBar';
import BulkGradingView from './BulkGradingView';

export default function GradingInterface({ testId, companyId }) {
  const [gradingData, setGradingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [finalizing, setFinalizing] = useState(false);

  const fetchGradingData = useCallback(async () => {
    if (!testId || !companyId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        v2Endpoints.onlineTests.grading(companyId, testId)
      );
      setGradingData(res.data);
    } catch (err) {
      console.error('Failed to fetch grading data:', err);
      setError(err.message || 'Failed to load grading data');
    } finally {
      setLoading(false);
    }
  }, [testId, companyId]);

  useEffect(() => {
    fetchGradingData();
  }, [fetchGradingData]);

  const handleGrade = async (gradeData) => {
    try {
      await axiosInstance.post(
        v2Endpoints.onlineTests.grade(companyId, testId),
        gradeData
      );
      // Refresh data after grading
      await fetchGradingData();
    } catch (err) {
      console.error('Failed to save grade:', err);
    }
  };

  const handleFinalizeAll = async () => {
    setFinalizing(true);
    try {
      await axiosInstance.post(
        v2Endpoints.onlineTests.finalizeGrading(companyId, testId)
      );
      await fetchGradingData();
    } catch (err) {
      console.error('Failed to finalize grading:', err);
    } finally {
      setFinalizing(false);
    }
  };

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
        <button
          className="mt-2 text-sm text-primary underline"
          onClick={fetchGradingData}
        >
          Try again
        </button>
      </div>
    );
  }

  const questions = gradingData?.questions ?? [];
  const currentQuestion = questions[activeQuestion] ?? null;
  const responses = currentQuestion?.responses ?? [];

  const totalGraded = questions.reduce((sum, q) => sum + (q.gradedCount ?? 0), 0);
  const totalResponses = questions.reduce((sum, q) => sum + (q.totalResponses ?? 0), 0);
  const allGraded = totalGraded >= totalResponses && totalResponses > 0;

  return (
    <div className="space-y-6">
      {/* Header + Overall Progress */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Manual Grading</h2>
        <div className="w-64">
          <GradingProgressBar graded={totalGraded} total={totalResponses} />
        </div>
      </div>

      {/* Question Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionGradingTabs
            questions={questions}
            activeQuestion={activeQuestion}
            onSelect={setActiveQuestion}
          />
        </CardContent>
      </Card>

      {/* Grading Area */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Q{currentQuestion.questionNumber ?? activeQuestion + 1} - Grade Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BulkGradingView
              question={currentQuestion}
              responses={responses}
              onGrade={handleGrade}
            />
          </CardContent>
        </Card>
      )}

      {/* Finalize Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleFinalizeAll}
          disabled={finalizing || !allGraded}
        >
          {finalizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {finalizing ? 'Finalizing...' : 'Finalize All Grading'}
        </Button>
      </div>

      {!allGraded && totalResponses > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          All responses must be graded before finalization.
        </p>
      )}
    </div>
  );
}
