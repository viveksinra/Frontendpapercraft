'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Copy, Archive, Loader2 } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getQuestion, archiveQuestion, duplicateQuestion, submitForReview, approveQuestion, rejectQuestion } from 'src/lib/question-api';

import { Button } from '@/components/ui/button';

import QuestionDetailView from 'src/components/question-bank/QuestionDetailView';
import ReviewActionPanel from 'src/components/question-bank/ReviewActionPanel';

export default function QuestionDetailPage() {
  const router = useRouter();
  const { questionId } = useParams();
  const companyId = getActiveCompanyIdFromCookie();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestion = async () => {
    if (!companyId || !questionId) return;
    try {
      setLoading(true);
      const data = await getQuestion(companyId, questionId);
      setQuestion(data.question || data);
    } catch (err) {
      setError(err.message || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [companyId, questionId]);

  const handleDuplicate = async () => {
    try {
      const data = await duplicateQuestion(companyId, questionId);
      const newId = data.question?._id || data.question?.id;
      if (newId) router.push(paths.dashboard.questionBank.detail(newId));
    } catch (err) {
      setError(err.message || 'Failed to duplicate');
    }
  };

  const handleArchive = async () => {
    try {
      await archiveQuestion(companyId, questionId);
      router.push(paths.dashboard.questionBank.root);
    } catch (err) {
      setError(err.message || 'Failed to archive');
    }
  };

  const handleSubmitForReview = async (notes) => {
    try {
      await submitForReview(companyId, questionId);
      fetchQuestion();
    } catch (err) {
      setError(err.message || 'Failed to submit for review');
    }
  };

  const handleApprove = async (notes) => {
    try {
      await approveQuestion(companyId, questionId, notes);
      fetchQuestion();
    } catch (err) {
      setError(err.message || 'Failed to approve');
    }
  };

  const handleReject = async (notes) => {
    try {
      await rejectQuestion(companyId, questionId, notes);
      fetchQuestion();
    } catch (err) {
      setError(err.message || 'Failed to reject');
    }
  };

  if (!companyId) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">No active company selected.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push(paths.dashboard.questionBank.root)}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Question Detail</h1>
          </div>
          {question && (
            <div className="flex gap-2">
              {(question.review?.status === 'draft' || question.review?.status === 'rejected') && (
                <Button variant="outline" size="sm" onClick={() => router.push(paths.dashboard.questionBank.edit(questionId))}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleDuplicate}>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm" onClick={handleArchive}>
                <Archive className="mr-1.5 h-3.5 w-3.5" />
                Archive
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : question ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <QuestionDetailView question={question} />
            <div className="space-y-4">
              <ReviewActionPanel
                question={question}
                onSubmitForReview={handleSubmitForReview}
                onApprove={handleApprove}
                onReject={handleReject}
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Created by {question.createdBy || 'unknown'}</p>
                <p>Version {question.version}</p>
                {question.updatedAt && (
                  <p>Last updated {new Date(question.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Question not found.</p>
        )}
      </div>
    </div>
  );
}
