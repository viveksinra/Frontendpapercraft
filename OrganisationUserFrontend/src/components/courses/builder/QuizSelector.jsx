'use client';

import { useState, useEffect } from 'react';
import { Loader2, HelpCircle } from 'lucide-react';

import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

export default function QuizSelector({ companyId, value, onChange }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const url = backendUrl(v2Endpoints.onlineTests.list(companyId));
        const res = await axios.get(url, {
          params: { pageSize: 50, search: search || undefined },
          headers: { 'X-Company-ID': companyId },
        });
        if (!cancelled) setTests(res.data?.tests || res.data?.data || []);
      } catch {
        if (!cancelled) setTests([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [companyId, search]);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Search tests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading tests...
        </div>
      ) : (
        <div className="max-h-40 overflow-y-auto border rounded-md">
          {tests.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">No tests found.</p>
          ) : (
            tests.map((test) => {
              const testId = test._id || test.id;
              const isSelected = testId === value;
              return (
                <button
                  key={testId}
                  type="button"
                  onClick={() => onChange(testId)}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                    isSelected ? 'bg-accent font-medium' : ''
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate">{test.title}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
