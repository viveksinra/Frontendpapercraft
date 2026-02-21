'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import TemplateSelector from './TemplateSelector';
import SectionList from './SectionList';
import QuestionPicker from './QuestionPicker';
import SelectedQuestionsList from './SelectedQuestionsList';
import PaperReviewPanel from './PaperReviewPanel';
import PdfPreviewPanel from './PdfPreviewPanel';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STEPS = [
  { label: 'Template & Info', description: 'Select template and enter paper details' },
  { label: 'Sections', description: 'Define paper sections' },
  { label: 'Questions', description: 'Pick questions for each section' },
  { label: 'Review', description: 'Review and save' },
  { label: 'PDF Preview', description: 'View generated PDFs' },
];

export default function PaperBuilderWizard({
  onSaveDraft,
  onFinalize,
  onDownload,
  saving,
  paper,
}) {
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([
    { name: 'Section A', questions: [], instructions: '' },
  ]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // PDF state
  const [pdfStatus, setPdfStatus] = useState(null);
  const [activePdfUrl, setActivePdfUrl] = useState(null);

  const currentSection = sections[activeSectionIndex] || { questions: [] };
  const selectedIds = (currentSection.questions || []).map((q) => q._id || q.id);

  const handleAddQuestion = (question) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === activeSectionIndex ? { ...s, questions: [...(s.questions || []), question] } : s
      )
    );
  };

  const handleRemoveQuestion = (questionId) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === activeSectionIndex
          ? { ...s, questions: (s.questions || []).filter((q) => (q._id || q.id) !== questionId) }
          : s
      )
    );
  };

  const handleReorderQuestions = (reordered) => {
    setSections((prev) =>
      prev.map((s, i) => (i === activeSectionIndex ? { ...s, questions: reordered } : s))
    );
  };

  const handleSaveDraft = async () => {
    const data = { title, description, templateId, sections };
    const result = await onSaveDraft?.(data);
    if (result) {
      setStep(3); // Stay on review
    }
  };

  const handleFinalize = async () => {
    const paperId = paper?._id || paper?.id;
    if (!paperId) {
      // Save first then finalize
      const result = await onSaveDraft?.({ title, description, templateId, sections });
      if (result) {
        await onFinalize?.(result._id || result.id);
        setPdfStatus('generating');
        setStep(4);
        // Poll or wait for PDF
        setTimeout(() => setPdfStatus('ready'), 3000);
      }
    } else {
      await onFinalize?.(paperId);
      setPdfStatus('generating');
      setStep(4);
      setTimeout(() => setPdfStatus('ready'), 3000);
    }
  };

  const canNext = () => {
    if (step === 0) return !!templateId && !!title.trim();
    if (step === 1) return sections.length > 0;
    if (step === 2) return sections.some((s) => (s.questions?.length || 0) > 0);
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
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
            {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Paper Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Year 6 Maths Mock Test" />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
            </div>
          </div>
          <TemplateSelector selectedTemplateId={templateId} onSelect={setTemplateId} />
        </div>
      )}

      {step === 1 && (
        <SectionList sections={sections} onChange={setSections} />
      )}

      {step === 2 && (
        <div className="space-y-4">
          {sections.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {sections.map((s, i) => (
                <Button
                  key={i}
                  variant={i === activeSectionIndex ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveSectionIndex(i)}
                >
                  {s.name || `Section ${i + 1}`} ({(s.questions?.length || 0)})
                </Button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Question Bank</h3>
              <QuestionPicker selectedIds={selectedIds} onAdd={handleAddQuestion} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Selected for {currentSection.name || `Section ${activeSectionIndex + 1}`}
              </h3>
              <SelectedQuestionsList
                questions={currentSection.questions || []}
                onRemove={handleRemoveQuestion}
                onReorder={handleReorderQuestions}
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <PaperReviewPanel title={title} sections={sections} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button onClick={handleFinalize} disabled={saving}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Finalize & Generate PDF
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <PdfPreviewPanel
          pdfs={paper?.pdfs || []}
          pdfStatus={pdfStatus}
          onDownload={onDownload}
          activePdfUrl={activePdfUrl}
          onSelectPdf={setActivePdfUrl}
        />
      )}

      {/* Navigation buttons */}
      {step < 3 && (
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
            Next <ChevronRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
