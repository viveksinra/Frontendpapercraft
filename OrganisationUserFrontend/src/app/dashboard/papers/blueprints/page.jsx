'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  listBlueprints,
  createBlueprint,
  updateBlueprint,
  deleteBlueprint,
  cloneBlueprint,
  validateBlueprint,
} from 'src/lib/paper-blueprint-api';

import { Button } from '@/components/ui/button';

import BlueprintList from 'src/components/blueprints/BlueprintList';
import BlueprintEditor from 'src/components/blueprints/BlueprintEditor';
import FeasibilityChecker from 'src/components/blueprints/FeasibilityChecker';

export default function BlueprintsPage() {
  const companyId = getActiveCompanyIdFromCookie();

  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [editingBlueprint, setEditingBlueprint] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBlueprints = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const data = await listBlueprints(companyId);
      setBlueprints(data.blueprints || data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load blueprints');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchBlueprints();
  }, [fetchBlueprints]);

  const handleCreate = () => {
    setEditingBlueprint(null);
    setView('editor');
  };

  const handleEdit = (blueprintId) => {
    const bp = blueprints.find((b) => (b._id || b.id) === blueprintId);
    if (bp) {
      setEditingBlueprint(bp);
      setView('editor');
    }
  };

  const handleSave = async (data) => {
    try {
      setSaving(true);
      if (editingBlueprint?._id || editingBlueprint?.id) {
        await updateBlueprint(companyId, editingBlueprint._id || editingBlueprint.id, data);
      } else {
        await createBlueprint(companyId, data);
      }
      setView('list');
      setEditingBlueprint(null);
      fetchBlueprints();
    } catch (err) {
      setError(err.message || 'Failed to save blueprint');
    } finally {
      setSaving(false);
    }
  };

  const handleClone = async (blueprintId) => {
    try {
      await cloneBlueprint(companyId, blueprintId);
      fetchBlueprints();
    } catch (err) {
      setError(err.message || 'Failed to clone blueprint');
    }
  };

  const handleDelete = async (blueprintId) => {
    try {
      await deleteBlueprint(companyId, blueprintId);
      fetchBlueprints();
    } catch (err) {
      setError(err.message || 'Failed to delete blueprint');
    }
  };

  const handleFeasibilityCheck = async (cId, bpId) => {
    return validateBlueprint(cId, bpId);
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
        {view === 'list' ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Paper Blueprints</h1>
                <p className="text-sm text-muted-foreground">
                  Define content rules for auto-generating papers
                </p>
              </div>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Blueprint
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
              <BlueprintList
                blueprints={blueprints}
                onClone={handleClone}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {/* Feasibility checker for a selected blueprint */}
            {blueprints.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3">Quick Feasibility Check</h3>
                <div className="flex flex-col gap-3 max-w-md">
                  {blueprints.slice(0, 3).map((bp) => (
                    <FeasibilityChecker
                      key={bp._id || bp.id}
                      companyId={companyId}
                      blueprintId={bp._id || bp.id}
                      onCheck={handleFeasibilityCheck}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => { setView('list'); setEditingBlueprint(null); }}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">
                {editingBlueprint ? 'Edit Blueprint' : 'Create Blueprint'}
              </h1>
            </div>

            {error && (
              <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <span>{error}</span>
                <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
                  Dismiss
                </button>
              </div>
            )}

            <BlueprintEditor
              blueprint={editingBlueprint}
              onSave={handleSave}
              onCancel={() => { setView('list'); setEditingBlueprint(null); }}
              saving={saving}
            />
          </>
        )}
      </div>
    </div>
  );
}
