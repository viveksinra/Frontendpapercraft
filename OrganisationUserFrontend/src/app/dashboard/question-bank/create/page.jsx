'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { createQuestion } from 'src/lib/question-api';
import { getSubjectTree } from 'src/lib/subject-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import TypeSelector from 'src/components/question-bank/TypeSelector';
import QuestionForm from 'src/components/question-bank/QuestionForm';
import MetadataSidebar from 'src/components/question-bank/MetadataSidebar';
import QuestionPreview from 'src/components/question-bank/QuestionPreview';

const DEFAULT_OPTIONS = [
  { label: 'A', text: '', isCorrect: false, explanation: '' },
  { label: 'B', text: '', isCorrect: false, explanation: '' },
  { label: 'C', text: '', isCorrect: false, explanation: '' },
  { label: 'D', text: '', isCorrect: false, explanation: '' },
];

export default function CreateQuestionPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [content, setContent] = useState({});
  const [metadata, setMetadata] = useState({
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0,
    expectedTime: 60,
    tags: [],
    examTypes: [],
  });
  const [subjects, setSubjects] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;
    getSubjectTree(companyId).then((data) => {
      setSubjects(data.subjects || []);
    }).catch(() => {});
  }, [companyId]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    // Initialize default content based on type
    const newContent = { body: '', explanation: '', solution: '', hints: [] };
    if (['mcq_single', 'mcq_multiple'].includes(type)) {
      newContent.options = [...DEFAULT_OPTIONS];
    }
    if (type === 'true_false') {
      newContent.correctAnswer = '';
    }
    if (type === 'match_the_column') {
      newContent.matchPairs = [{ left: '', right: '' }, { left: '', right: '' }];
    }
    if (['comprehension', 'english_comprehension'].includes(type)) {
      newContent.passage = '';
      newContent.subQuestions = [];
    }
    if (type === 'assertion_reasoning') {
      newContent.assertion = '';
      newContent.reason = '';
      newContent.options = [...DEFAULT_OPTIONS];
    }
    if (type === 'cloze_passage') {
      newContent.passage = '';
      newContent.blanks = [];
    }
    setContent(newContent);
    setStep(2);
  };

  const handleSave = async () => {
    if (!selectedType || !content.body) {
      setError('Please fill in the question body');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await createQuestion(companyId, {
        type: selectedType,
        content,
        metadata,
      });
      router.push(paths.dashboard.questionBank.root);
    } catch (err) {
      setError(err.message || 'Failed to create question');
    } finally {
      setSaving(false);
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => step === 1 ? router.push(paths.dashboard.questionBank.root) : setStep(1)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Question</h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 ? 'Step 1: Select question type' : 'Step 2: Fill in question details'}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        {/* Step 1: Type Selection */}
        {step === 1 && (
          <TypeSelector selectedType={selectedType} onSelect={handleTypeSelect} />
        )}

        {/* Step 2: Question Form */}
        {step === 2 && selectedType && (
          <div className="flex gap-6">
            <div className="flex-1 min-w-0 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <QuestionForm type={selectedType} content={content} onChange={setContent} />
                </CardContent>
              </Card>

              {/* Preview toggle */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>

              {showPreview && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Preview</h3>
                  <QuestionPreview type={selectedType} content={content} metadata={metadata} />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Change Type
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="mr-1.5 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Question'}
                </Button>
              </div>
            </div>

            <MetadataSidebar metadata={metadata} onChange={setMetadata} subjects={subjects} />
          </div>
        )}
      </div>
    </div>
  );
}
