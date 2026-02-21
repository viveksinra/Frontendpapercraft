'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { createPaperSet } from 'src/lib/paper-set-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import PaperSetEditor from 'src/components/paper-sets/PaperSetEditor';

export default function CreatePaperSetPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (data) => {
    if (!companyId) return;
    try {
      setSaving(true);
      setError(null);
      const result = await createPaperSet(companyId, data);
      const id = result.paperSet?._id || result.paperSet?.id || result._id || result.id;
      router.push(paths.dashboard.papers.setDetail(id));
    } catch (err) {
      setError(err.message || 'Failed to create paper set');
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push(paths.dashboard.papers.sets)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Paper Sets
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Create Paper Set</h1>
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
          <CardContent className="p-6">
            <PaperSetEditor
              onSave={handleSave}
              onCancel={() => router.push(paths.dashboard.papers.sets)}
              saving={saving}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
