'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { getStudentHomework } from '@/lib/student-homework-api';

interface HomeworkItem {
  _id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  status: string;
  submissionStatus: string;
  totalMarks: number;
  score: number | null;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'graded':
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    case 'submitted':
    case 'late':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
}

function getStatusLabel(item: HomeworkItem) {
  if (item.submissionStatus === 'graded') return 'Graded';
  if (item.submissionStatus === 'submitted') return 'Submitted';
  if (item.submissionStatus === 'late') return 'Late';
  if (item.status === 'past_due' && item.submissionStatus === 'pending') return 'Overdue';
  return 'Pending';
}

export function HomeworkList() {
  const [items, setItems] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStudentHomework();
        const list = data?.homework || data?.items || data;
        setItems(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load homework');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
          <p className="mt-1 text-muted-foreground">View your assigned homework</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
          <p className="mt-1 text-muted-foreground">View your assigned homework</p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
          <p className="mt-1 text-muted-foreground">View your assigned homework</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Homework</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You have no pending homework assignments. Check back later!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
        <p className="mt-1 text-muted-foreground">View your assigned homework</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Link key={item._id} href={`/student/homework/${item._id}`}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
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
                      {getStatusLabel(item)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
