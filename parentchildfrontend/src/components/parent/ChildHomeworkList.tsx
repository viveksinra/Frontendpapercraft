'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { getChildHomework } from '@/lib/parent-api';

interface HomeworkItem {
  _id: string;
  title: string;
  dueDate: string;
  status: string;
  submissionStatus: string;
  totalMarks: number;
  score: number | null;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'graded': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    case 'submitted': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    case 'late': return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
    case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
}

export function ChildHomeworkList({ childId }: { childId: string }) {
  const router = useRouter();
  const [items, setItems] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChildHomework(childId);
        setItems(data?.homework || data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load homework');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homework</h1>
          <p className="text-sm text-muted-foreground">View your child&apos;s homework assignments</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Homework</h3>
            <p className="mt-1 text-sm text-muted-foreground">No homework assignments found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link key={item._id} href={`/children/${childId}/homework/${item._id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {new Date(item.dueDate).toLocaleDateString('en-GB')}
                        </span>
                        {item.score != null && (
                          <span className="font-medium tabular-nums">
                            {item.score}/{item.totalMarks}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(item.submissionStatus)}`}>
                        {item.submissionStatus}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
