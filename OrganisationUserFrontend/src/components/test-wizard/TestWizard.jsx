'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import ModeSelector from './ModeSelector';
import SourceSelector from './SourceSelector';
import AssignmentPanel from './AssignmentPanel';
import TestReviewPanel from './TestReviewPanel';
import TestOptionsPanel from './TestOptionsPanel';
import TimingConfigurator from './TimingConfigurator';

const STEPS = [
  { label: 'Mode', description: 'Choose test type' },
  { label: 'Source', description: 'Select questions' },
  { label: 'Timing', description: 'Configure schedule' },
  { label: 'Options', description: 'Test settings' },
  { label: 'Assignment', description: 'Assign students' },
  { label: 'Review', description: 'Review and publish' },
];

function buildInitialState(initialData) {
  return {
    title: initialData?.title || '',
    mode: initialData?.mode || '',
    paperId: initialData?.paperId || null,
    sections: initialData?.sections || [
      { name: 'Section 1', questions: [], instructions: '' },
    ],
    scheduling: initialData?.scheduling || {},
    options: initialData?.options || {},
    assignment: initialData?.assignment || {
      isPublic: false,
      classes: [],
      students: [],
    },
  };
}

export default function TestWizard({ initialData, onSubmit }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(() => buildInitialState(initialData));

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation errors for the review step
  const validationErrors = useMemo(() => {
    const errs = [];
    if (!formData.title.trim()) errs.push('Test title is required.');
    if (!formData.mode) errs.push('Test mode must be selected.');
    if (
      !formData.paperId &&
      (!formData.sections || formData.sections.length === 0)
    ) {
      errs.push('At least one section or paper is required.');
    }
    if (
      formData.mode === 'live_mock' &&
      !formData.scheduling?.startTime
    ) {
      errs.push('Live mock requires a start time.');
    }
    if (
      formData.mode === 'live_mock' &&
      !formData.scheduling?.duration
    ) {
      errs.push('Live mock requires a duration.');
    }
    if (
      formData.mode === 'anytime_mock' &&
      !formData.scheduling?.availableFrom
    ) {
      errs.push('Anytime mock requires an availability start time.');
    }
    if (
      formData.mode === 'anytime_mock' &&
      !formData.scheduling?.endTime
    ) {
      errs.push('Anytime mock requires an end time.');
    }
    if (
      !formData.assignment?.isPublic &&
      (!formData.assignment?.classes?.length) &&
      (!formData.assignment?.students?.length)
    ) {
      errs.push('Assign the test to at least one class or student, or make it public.');
    }
    return errs;
  }, [formData]);

  const canNext = () => {
    if (step === 0) return !!formData.mode;
    if (step === 1) {
      return !!(
        formData.paperId ||
        (formData.sections && formData.sections.length > 0)
      );
    }
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1 && canNext()) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleSourceChange = ({ paperId, sections }) => {
    setFormData((prev) => ({
      ...prev,
      paperId: paperId ?? prev.paperId,
      sections: sections ?? prev.sections,
    }));
  };

  const handleSaveDraft = () => {
    onSubmit?.({ ...formData, status: 'draft' });
  };

  const handleSchedule = () => {
    onSubmit?.({ ...formData, status: 'scheduled' });
  };

  const handleGoLive = () => {
    onSubmit?.({ ...formData, status: 'live' });
  };

  return (
    <div className="space-y-6">
      {/* Title input - always visible */}
      <div className="space-y-1.5">
        <Label>Test Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g. Year 6 Maths Mock Exam - Spring 2025"
        />
      </div>

      {/* Step indicator bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <button
              type="button"
              onClick={() => i <= step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                i === step
                  ? 'bg-primary text-primary-foreground font-medium'
                  : i < step
                    ? 'bg-muted text-foreground cursor-pointer'
                    : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              }`}
              disabled={i > step}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs border">
                {i < step ? '\u2713' : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[300px]">
        {step === 0 && (
          <ModeSelector
            value={formData.mode}
            onChange={(mode) => updateField('mode', mode)}
          />
        )}

        {step === 1 && (
          <SourceSelector
            paperId={formData.paperId}
            sections={formData.sections}
            onChange={handleSourceChange}
          />
        )}

        {step === 2 && (
          <TimingConfigurator
            mode={formData.mode}
            scheduling={formData.scheduling}
            sections={formData.sections}
            onChange={(scheduling) => updateField('scheduling', scheduling)}
          />
        )}

        {step === 3 && (
          <TestOptionsPanel
            mode={formData.mode}
            options={formData.options}
            onChange={(options) => updateField('options', options)}
          />
        )}

        {step === 4 && (
          <AssignmentPanel
            assignment={formData.assignment}
            onChange={(assignment) => updateField('assignment', assignment)}
          />
        )}

        {step === 5 && (
          <TestReviewPanel
            data={formData}
            onSaveDraft={handleSaveDraft}
            onSchedule={handleSchedule}
            onGoLive={handleGoLive}
            errors={validationErrors}
          />
        )}
      </div>

      {/* Back / Next navigation (hidden on review step) */}
      {step < 5 && (
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
          >
            <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleNext} disabled={!canNext()}>
            Next <ChevronRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
