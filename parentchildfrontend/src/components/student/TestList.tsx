'use client';

import { useCallback, useEffect, useState } from 'react';
import { getTests } from '@/lib/student-api';
import { TestCard } from './TestCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type TabKey = 'upcoming' | 'available' | 'completed';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'available', label: 'Available Now' },
  { key: 'completed', label: 'Completed' },
];

export function TestList() {
  const [activeTab, setActiveTab] = useState<TabKey>('available');
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const loadTests = useCallback(async (tab: TabKey, p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTests({ status: tab, page: p, pageSize });
      setTests(res.tests || []);
      setTotal(res.total || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load tests';
      // Make common backend errors more user-friendly
      if (msg.toLowerCase().includes('student not found') || msg.toLowerCase().includes('user account not found')) {
        setError('Your student profile is being set up. Please refresh the page in a moment, or contact your school administrator if this persists.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTests(activeTab, page);
  }, [activeTab, page, loadTests]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tests</h1>
        <p className="mt-1 text-muted-foreground">View and take your assigned tests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => loadTests(activeTab, page)}>
            Retry
          </Button>
        </div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No tests found for this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test: any) => (
            <TestCard key={test._id} test={test} />
          ))}

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
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
