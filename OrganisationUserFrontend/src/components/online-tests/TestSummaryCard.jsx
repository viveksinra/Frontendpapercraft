'use client';

import { Clock, FileText, Hash, Pencil, Eye, BarChart3, Play, Archive, RotateCcw } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import TestStatusBadge from './TestStatusBadge';
import TestModeBadge from './TestModeBadge';

function getActions(status) {
  switch (status) {
    case 'draft':
      return [
        { key: 'edit', label: 'Edit', icon: Pencil },
        { key: 'view', label: 'View', icon: Eye },
      ];
    case 'scheduled':
      return [
        { key: 'view', label: 'View', icon: Eye },
        { key: 'edit', label: 'Edit', icon: Pencil },
      ];
    case 'live':
      return [
        { key: 'monitor', label: 'Monitor', icon: Play },
        { key: 'view', label: 'View', icon: Eye },
      ];
    case 'completed':
      return [
        { key: 'results', label: 'Results', icon: BarChart3 },
        { key: 'view', label: 'View', icon: Eye },
      ];
    case 'archived':
      return [
        { key: 'view', label: 'View', icon: Eye },
        { key: 'restore', label: 'Restore', icon: RotateCcw },
      ];
    default:
      return [{ key: 'view', label: 'View', icon: Eye }];
  }
}

export default function TestSummaryCard({ test, onAction }) {
  const actions = getActions(test.status);

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3">
        {/* Header: title and badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{test.title || 'Untitled Test'}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <TestModeBadge mode={test.mode} />
              <TestStatusBadge status={test.status} />
            </div>
          </div>
        </div>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" />
            {test.questionCount ?? 0} questions
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {test.totalMarks ?? 0} marks
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {test.duration ?? 0} min
          </span>
          <span className="flex items-center gap-1.5">
            Created {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : '\u2014'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.key}
                variant="outline"
                size="sm"
                onClick={() => onAction?.(action.key, test)}
              >
                <Icon className="mr-1.5 h-3.5 w-3.5" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
