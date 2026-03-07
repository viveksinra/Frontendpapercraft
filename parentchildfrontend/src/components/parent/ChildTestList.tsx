'use client';

import { useState, useEffect, useCallback } from 'react';
import { getChildTests } from '@/lib/parent-api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Loader2,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ChildTestListProps {
  childId: string;
}

const tabs = [
  { key: 'upcoming', label: 'Upcoming', icon: Calendar },
  { key: 'available', label: 'Available', icon: Clock },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
] as const;

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatDuration(minutes?: number) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function ChildTestList({ childId }: ChildTestListProps) {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChildTests(childId, { status: activeTab });
      setTests(data.tests || data.items || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tests.');
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, [childId, activeTab]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b" role="tablist" aria-label="Test filters">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchTests}>
            Try Again
          </Button>
        </div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No {activeTab} tests found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test: any) => {
            const name = test.name || test.testName || 'Test';
            const subject = test.subject || '';
            const date =
              test.scheduledDate || test.startDate || test.completedAt || test.date;
            const duration = test.duration || test.durationMinutes;
            const score = test.score ?? test.percentage;
            const grade = test.grade;
            const totalQuestions = test.totalQuestions || test.questionCount;

            return (
              <Card key={test.id || test.testId}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {subject && <span>{subject}</span>}
                      {date && (
                        <>
                          {subject && <span>&middot;</span>}
                          <span>{formatDate(date)}</span>
                        </>
                      )}
                      {duration && (
                        <>
                          <span>&middot;</span>
                          <span>{formatDuration(duration)}</span>
                        </>
                      )}
                      {totalQuestions && (
                        <>
                          <span>&middot;</span>
                          <span>{totalQuestions} questions</span>
                        </>
                      )}
                    </div>
                  </div>
                  {activeTab === 'completed' && (
                    <div className="ml-4 text-right">
                      {score !== undefined && score !== null && (
                        <p className="text-lg font-bold">
                          {typeof score === 'number' ? `${Math.round(score)}%` : score}
                        </p>
                      )}
                      {grade && (
                        <p className="text-xs font-medium text-muted-foreground">
                          Grade: {grade}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
