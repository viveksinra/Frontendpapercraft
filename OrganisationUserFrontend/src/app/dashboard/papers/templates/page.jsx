'use client';

import { Plus, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  listTemplates,
  cloneTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from 'src/lib/paper-template-api';

import { Button } from '@/components/ui/button';
import TemplateEditor from 'src/components/templates/TemplateEditor';
import TemplateGallery from 'src/components/templates/TemplateGallery';

export default function TemplatesPage() {
  const companyId = getActiveCompanyIdFromCookie();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTemplates = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const data = await listTemplates(companyId);
      setTemplates(data.templates || data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreate = () => {
    setEditingTemplate(null);
    setEditorOpen(true);
  };

  const handleEdit = (templateId) => {
    const t = templates.find((tpl) => (tpl._id || tpl.id) === templateId);
    if (t) {
      setEditingTemplate(t);
      setEditorOpen(true);
    }
  };

  const handleSave = async (data) => {
    try {
      setSaving(true);
      if (editingTemplate?._id || editingTemplate?.id) {
        await updateTemplate(companyId, editingTemplate._id || editingTemplate.id, data);
      } else {
        await createTemplate(companyId, data);
      }
      setEditorOpen(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      setError(err.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleClone = async (templateId) => {
    try {
      await cloneTemplate(companyId, templateId);
      fetchTemplates();
    } catch (err) {
      setError(err.message || 'Failed to clone template');
    }
  };

  const handleDelete = async (templateId) => {
    try {
      await deleteTemplate(companyId, templateId);
      fetchTemplates();
    } catch (err) {
      setError(err.message || 'Failed to delete template');
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Paper Templates</h1>
            <p className="text-sm text-muted-foreground">
              Manage paper layouts with headers, footers, formatting, and watermarks
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Custom
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

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TemplateGallery
            templates={templates}
            onClone={handleClone}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <TemplateEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          template={editingTemplate}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </div>
  );
}
