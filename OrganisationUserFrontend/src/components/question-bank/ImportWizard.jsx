'use client';

import { useState } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import UploadStep from './UploadStep';
import ParsingStep from './ParsingStep';
import PreviewStep from './PreviewStep';
import MappingStep from './MappingStep';
import ImportProgressStep from './ImportProgressStep';

const STEPS = [
  { key: 'upload', label: 'Upload' },
  { key: 'preview', label: 'Preview' },
  { key: 'mapping', label: 'Mapping' },
  { key: 'import', label: 'Import' },
];

export default function ImportWizard({ subjects, onStartImport, onConfirmImport, importJob, onDone }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [subjectMapping, setSubjectMapping] = useState({ subjectId: '', chapterId: '', topicId: '' });
  const [defaultMetadata, setDefaultMetadata] = useState({ difficulty: 'medium', marks: 1, tags: [] });

  const handleUpload = async (data) => {
    setParsing(true);
    try {
      const result = await onStartImport(data);
      const job = result.job || result;
      setParsedQuestions(job.parsedPreview || []);
      setParsing(false);
      setCurrentStep(1);
    } catch (err) {
      setParsing(false);
    }
  };

  const handleConfirm = async () => {
    setCurrentStep(3);
    await onConfirmImport({ questions: parsedQuestions, subjectMapping, defaultMetadata });
  };

  const canGoNext = () => {
    if (currentStep === 0) return false; // handled by upload
    if (currentStep === 1) return parsedQuestions.some((q) => q.isValid);
    if (currentStep === 2) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              i < currentStep ? 'bg-primary text-primary-foreground' :
              i === currentStep ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' :
              'bg-muted text-muted-foreground'
            }`}>
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`ml-2 text-sm ${i === currentStep ? 'font-medium' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-3 ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 0 && !parsing && (
        <UploadStep onUpload={handleUpload} />
      )}

      {parsing && <ParsingStep />}

      {currentStep === 1 && (
        <PreviewStep questions={parsedQuestions} />
      )}

      {currentStep === 2 && (
        <MappingStep
          subjects={subjects}
          subjectMapping={subjectMapping}
          onSubjectMappingChange={setSubjectMapping}
          defaultMetadata={defaultMetadata}
          onDefaultMetadataChange={setDefaultMetadata}
        />
      )}

      {currentStep === 3 && (
        <ImportProgressStep job={importJob} onDone={onDone} />
      )}

      {/* Navigation */}
      {currentStep > 0 && currentStep < 3 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          {currentStep < 2 ? (
            <Button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canGoNext()}>
              Next
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleConfirm}>
              <Check className="mr-1.5 h-4 w-4" />
              Confirm Import
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
