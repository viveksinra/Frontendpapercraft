'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, ClipboardList, Plus } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { listHomework } from 'src/lib/homework-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

// ----------------------------------------------------------------------

const STATUS_VARIANT = {
  active: 'default',
  past_due: 'destructive',
  completed: 'secondary',
  archived: 'outline',
};

const STATUS_LABEL = {
  active: 'Active',
  past_due: 'Past Due',
  completed: 'Completed',
  archived: 'Archived',
};

export default function HomeworkListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homeworkList, setHomeworkList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCompanyId = getActiveCompanyIdFromCookie();

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await listHomework(activeCompanyId);
        if (!cancelled) {
          setHomeworkList(data?.homework || data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load homework');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeCompanyId]);

  const filtered = homeworkList.filter((hw) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (hw.title || '').toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Homework</h1>
            <p className="text-sm text-muted-foreground">
              Assign and track homework for your classes.
            </p>
          </div>
          <Button onClick={() => router.push(paths.dashboard.homework.create)}>
            <Plus className="mr-2 h-4 w-4" /> Create Homework
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search homework by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {homeworkList.length === 0
                ? 'No homework created yet.'
                : 'No homework matches your search.'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((hw) => {
                  const id = hw._id || hw.id;
                  const summary = hw.submissionSummary || {};
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{hw.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{hw.type === 'test' ? 'Test' : 'Questions'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB') : '\u2014'}
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {summary.completed ?? 0}/{summary.total ?? 0}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[hw.status] || 'outline'}>
                          {STATUS_LABEL[hw.status] || hw.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(paths.dashboard.homework.detail(id))}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
