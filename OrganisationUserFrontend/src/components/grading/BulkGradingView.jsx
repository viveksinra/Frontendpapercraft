'use client';

import { useState } from 'react';

import GradingProgressBar from './GradingProgressBar';
import StudentResponseCard from './StudentResponseCard';

export default function BulkGradingView({ question, responses = [], onGrade }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const gradedCount = responses.filter(
    (r) => r.marksAwarded != null && r.graded
  ).length;

  const currentResponse = responses[currentIndex] ?? null;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(responses.length - 1, prev + 1));
  };

  const handleGrade = async (gradeData) => {
    if (onGrade) {
      await onGrade(gradeData);
    }
    // Auto-advance to next student after saving
    if (currentIndex < responses.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (responses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No responses to grade for this question.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GradingProgressBar graded={gradedCount} total={responses.length} />

      <StudentResponseCard
        question={question}
        response={currentResponse}
        onGrade={handleGrade}
        onPrev={handlePrev}
        onNext={handleNext}
        current={currentIndex + 1}
        total={responses.length}
      />
    </div>
  );
}
