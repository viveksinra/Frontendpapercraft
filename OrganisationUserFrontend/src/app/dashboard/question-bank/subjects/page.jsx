'use client';

import { useRouter } from 'next/navigation';
import { Plus, Loader2, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { createSubject, updateSubject, deleteSubject, getSubjectTree } from 'src/lib/subject-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SubjectTreeView from 'src/components/question-bank/SubjectTreeView';
import SubjectFormDialog from 'src/components/question-bank/SubjectFormDialog';

export default function SubjectsPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [parentIdForNew, setParentIdForNew] = useState(null);

  const fetchSubjects = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const data = await getSubjectTree(companyId);
      setSubjects(data.subjects || []);
    } catch (err) {
      setError(err.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleAdd = () => {
    setEditingSubject(null);
    setParentIdForNew(null);
    setDialogOpen(true);
  };

  const handleAddChild = (parentId) => {
    setEditingSubject(null);
    setParentIdForNew(parentId);
    setDialogOpen(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setParentIdForNew(null);
    setDialogOpen(true);
  };

  const handleDelete = async (subjectId) => {
    try {
      await deleteSubject(companyId, subjectId);
      fetchSubjects();
    } catch (err) {
      setError(err.message || 'Failed to delete subject');
    }
  };

  const handleSave = async (data) => {
    try {
      setSaving(true);
      setError(null);
      if (editingSubject) {
        await updateSubject(companyId, editingSubject._id, data);
      } else {
        await createSubject(companyId, data);
      }
      setDialogOpen(false);
      fetchSubjects();
    } catch (err) {
      setError(err.message || 'Failed to save subject');
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push(paths.dashboard.questionBank.root)}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Subjects & Topics</h1>
              <p className="text-sm text-muted-foreground">
                Organize your question bank with a subject hierarchy
              </p>
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <SubjectTreeView
                subjects={subjects}
                onEdit={handleEdit}
                onAddChild={handleAddChild}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <SubjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subject={editingSubject}
        parentId={parentIdForNew}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
