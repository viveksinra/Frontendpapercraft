'use client';

import { useCallback, useEffect, useState } from 'react';
import { getResults } from '@/lib/student-api';
import { ResultCard } from './ResultCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';

export function ResultsList() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [subject, setSubject] = useState('');
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { page, pageSize };
      if (subject) params.subject = subject;
      const res = await getResults(params);
      setResults(res.results || []);
      setTotal(res.total || 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [page, subject]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
        <p className="mt-1 text-muted-foreground">View your test results and performance</p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by subject..."
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={load}>
            Retry
          </Button>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No results found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result: any) => (
            <ResultCard key={result.testId + (result.attemptNumber || '')} result={result} />
          ))}

          {total > pageSize && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {Math.ceil(total / pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
