'use client';

import { useState, useEffect } from 'react';
import { X, Link2, Search } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────

export default function ContentLinker({ type, value, onChange, disabled }) {
  const activeCompanyId = getActiveCompanyIdFromCookie();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value ? { _id: value.referenceId, title: value.title || 'Linked content' } : null);

  // Dynamically import the right API based on type
  useEffect(() => {
    if (!query.trim() || !activeCompanyId || disabled) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const debounce = setTimeout(async () => {
      try {
        setSearching(true);
        let data = [];

        if (type === 'paper') {
          const { listPapers } = await import('src/lib/paper-api');
          const res = await listPapers(activeCompanyId, { search: query.trim(), limit: 10 });
          data = res?.papers || res || [];
        } else if (type === 'paper_set') {
          const { listPaperSets } = await import('src/lib/paper-set-api');
          const res = await listPaperSets(activeCompanyId, { search: query.trim(), limit: 10 });
          data = res?.paperSets || res || [];
        } else if (type === 'test') {
          const { listOnlineTests } = await import('src/lib/online-test-api');
          const res = await listOnlineTests(activeCompanyId, { search: query.trim(), limit: 10 });
          data = res?.tests || res || [];
        }

        if (!cancelled) setResults(data);
      } catch (_) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [query, type, activeCompanyId, disabled]);

  function handleSelect(item) {
    const id = item._id || item.id;
    setSelectedItem(item);
    setQuery('');
    setResults([]);
    onChange({ referenceId: id, title: item.title || item.name });
  }

  function handleClear() {
    setSelectedItem(null);
    onChange(null);
  }

  if (disabled && selectedItem) {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
        <Link2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{selectedItem.title || selectedItem.name}</span>
        <Badge variant="outline" className="ml-auto">{type}</Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {selectedItem ? (
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium flex-1">{selectedItem.title || selectedItem.name}</span>
          {!disabled && (
            <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={`Search for a ${type === 'paper_set' ? 'paper set' : type}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={disabled}
            />
          </div>
          {results.length > 0 && (
            <div className="rounded-md border max-h-48 overflow-y-auto">
              {results.map((item) => {
                const id = item._id || item.id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors border-b last:border-b-0"
                  >
                    <span className="flex-1 truncate">{item.title || item.name}</span>
                    {item.status && (
                      <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {searching && (
            <p className="text-xs text-muted-foreground">Searching...</p>
          )}
        </>
      )}
    </div>
  );
}
