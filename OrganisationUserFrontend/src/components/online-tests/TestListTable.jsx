'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import TestSummaryCard from './TestSummaryCard';

export default function TestListTable({ tests = [], total = 0, page = 1, limit = 10, onPageChange, onAction, loading = false }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading tests...</span>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No tests found. Create your first online test to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Test cards */}
      <div className="grid gap-3">
        {tests.map((test) => (
          <TestSummaryCard
            key={test._id || test.id}
            test={test}
            onAction={onAction}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {start}\u2013{end} of {total} tests
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
