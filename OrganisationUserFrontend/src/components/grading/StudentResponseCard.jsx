'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentResponseCard({
  question,
  response,
  onGrade,
  onPrev,
  onNext,
  current,
  total,
}) {
  const [marks, setMarks] = useState(response?.marksAwarded ?? 0);
  const [feedback, setFeedback] = useState(response?.feedback ?? '');
  const [saving, setSaving] = useState(false);

  // Sync local state when response changes
  useEffect(() => {
    setMarks(response?.marksAwarded ?? 0);
    setFeedback(response?.feedback ?? '');
  }, [response]);

  const maxMarks = question?.maxMarks ?? question?.marks ?? 0;

  const handleSave = async () => {
    if (!onGrade) return;
    setSaving(true);
    try {
      await onGrade({
        studentId: response?.studentId,
        questionId: question?.questionId ?? question?._id,
        marksAwarded: marks,
        feedback,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-5">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={current <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev Student
          </Button>

          <span className="text-sm text-muted-foreground">
            Student {current} of {total}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={current >= total}
          >
            Next Student
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Question */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Question</p>
          <p className="text-sm">
            {question?.questionText || question?.text || 'Question text not available'}
          </p>
        </div>

        {/* Model Answer */}
        {(question?.modelAnswer || question?.correctAnswer) && (
          <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-3">
            <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Model Answer</p>
            <p className="text-sm text-green-800 dark:text-green-300">
              {question.modelAnswer || question.correctAnswer}
            </p>
          </div>
        )}

        {/* Student Response */}
        <div className="rounded-md bg-muted/50 border p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Student Response
            {response?.studentName && (
              <span className="ml-2 font-normal">({response.studentName})</span>
            )}
          </p>
          <p className="text-sm whitespace-pre-wrap">
            {response?.answer ?? response?.studentAnswer ?? 'No response provided'}
          </p>
        </div>

        {/* Marks Input */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Marks (0 - {maxMarks})
            </label>
            <Input
              type="number"
              min={0}
              max={maxMarks}
              step={0.5}
              value={marks}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMarks(Number.isNaN(val) ? 0 : Math.min(Math.max(val, 0), maxMarks));
              }}
            />
          </div>
          <div className="text-sm text-muted-foreground mt-5">
            / {maxMarks}
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Feedback (optional)
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Provide feedback to the student..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
