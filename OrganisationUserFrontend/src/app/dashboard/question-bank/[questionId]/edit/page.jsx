'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getSubjectTree } from 'src/lib/subject-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getQuestion, updateQuestion } from 'src/lib/question-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuestionForm from 'src/components/question-bank/QuestionForm';
import MetadataSidebar from 'src/components/question-bank/MetadataSidebar';
import QuestionPreview from 'src/components/question-bank/QuestionPreview';

export default function EditQuestionPage() {
  const router = useRouter();
  const { questionId } = useParams();
  const companyId = getActiveCompanyIdFromCookie();

  const [question, setQuestion] = useState(null);
  const [content, setContent] = useState({});
  const [metadata, setMetadata] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId || !questionId) return;

    const load = async () => {
      try {
        setLoading(true);
        const [qData, sData] = await Promise.all([
          getQuestion(companyId, questionId),
          getSubjectTree(companyId),
        ]);
        const q = qData.question || qData;
        setQuestion(q);
        setContent(q.content || {});
        setMetadata({
          ...(q.metadata || {}),
          // Flatten populated refs to IDs for selects
          subjectId: q.metadata?.subjectId?._id || q.metadata?.subjectId || '',
          chapterId: q.metadata?.chapterId?._id || q.metadata?.chapterId || '',
          topicId: q.metadata?.topicId?._id || q.metadata?.topicId || '',
          subtopicId: q.metadata?.subtopicId?._id || q.metadata?.subtopicId || '',
        });
        setSubjects(sData.subjects || []);
      } catch (err) {
        setError(err.message || 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [companyId, questionId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateQuestion(companyId, questionId, {
        content,
        metadata,
        version: question?.version,
      });
      router.push(paths.dashboard.questionBank.detail(questionId));
    } catch (err) {
      setError(err.message || 'Failed to update question');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">Question not found.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(paths.dashboard.questionBank.detail(questionId))}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Question</h1>
            <p className="text-sm text-muted-foreground">Version {question.version}</p>
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

        <div className="flex gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <QuestionForm type={question.type} content={content} onChange={setContent} />
              </CardContent>
            </Card>

            {/* Preview */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Preview</h3>
              <QuestionPreview type={question.type} content={content} metadata={metadata} />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.push(paths.dashboard.questionBank.detail(questionId))}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-1.5 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <MetadataSidebar metadata={metadata} onChange={setMetadata} subjects={subjects} />
        </div>
      </div>
    </div>
  );
}
