'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Search, Loader2 } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { listClasses } from 'src/lib/class-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

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

export default function ClassesListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCompanyId = getActiveCompanyIdFromCookie();

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await listClasses(activeCompanyId);
        if (!cancelled) {
          setClasses(data?.classes || data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load classes');
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

  const filtered = classes.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.subject || '').toLowerCase().includes(q) ||
      (c.yearGroup || '').toLowerCase().includes(q)
    );
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
            <p className="text-sm text-muted-foreground">
              Manage your classes, students, and teachers.
            </p>
          </div>
          <Button onClick={() => router.push(paths.dashboard.classes.create)}>
            <Plus className="mr-2 h-4 w-4" /> Create Class
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name, subject, or year group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {classes.length === 0
                ? 'No classes created yet. Create your first class to get started.'
                : 'No classes match your search.'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Year Group</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((cls) => {
                  const id = cls._id || cls.id;
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.subject || '\u2014'}</TableCell>
                      <TableCell>
                        {cls.yearGroup ? (
                          <Badge variant="secondary">{cls.yearGroup}</Badge>
                        ) : '\u2014'}
                      </TableCell>
                      <TableCell>{cls.studentCount ?? cls.students?.length ?? 0}</TableCell>
                      <TableCell>
                        <Badge variant={cls.status === 'active' ? 'default' : 'secondary'}>
                          {cls.status === 'active' ? 'Active' : 'Archived'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(paths.dashboard.classes.detail(id))}
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
