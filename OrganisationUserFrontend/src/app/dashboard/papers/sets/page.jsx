'use client';

import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { listPaperSets } from 'src/lib/paper-set-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Button } from '@/components/ui/button';
import PaperSetList from 'src/components/paper-sets/PaperSetList';

export default function PaperSetsPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [paperSets, setPaperSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSets = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const data = await listPaperSets(companyId);
      setPaperSets(data.paperSets || data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load paper sets');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

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
            <h1 className="text-2xl font-bold tracking-tight">Paper Sets</h1>
            <p className="text-sm text-muted-foreground">
              Bundle papers with PDF support and pricing
            </p>
          </div>
          <Button onClick={() => router.push(paths.dashboard.papers.setCreate)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Paper Set
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
          <PaperSetList
            paperSets={paperSets}
            onClick={(id) => router.push(paths.dashboard.papers.setDetail(id))}
          />
        )}
      </div>
    </div>
  );
}
