'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, GraduationCap } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { listStudents } from 'src/lib/student-admin-api';
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

export default function StudentsListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
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
        const data = await listStudents(activeCompanyId);
        if (!cancelled) {
          setStudents(data?.students || data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load students');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeCompanyId]);

  const filtered = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (s.firstName && s.lastName)
      ? `${s.firstName} ${s.lastName}`
      : s.name || '';
    return (
      name.toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.studentCode || '').toLowerCase().includes(q) ||
      (s.yearGroup || '').toLowerCase().includes(q)
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
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            View and manage students in your organisation.
          </p>
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
            placeholder="Search by name, email, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <GraduationCap className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {students.length === 0
                ? 'No students found in this organisation.'
                : 'No students match your search.'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Year Group</TableHead>
                  <TableHead>Student Code</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => {
                  const id = student.id || student._id;
                  const name = (student.firstName && student.lastName)
                    ? `${student.firstName} ${student.lastName}`
                    : student.name || '\u2014';

                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{student.email || '\u2014'}</TableCell>
                      <TableCell>
                        {student.yearGroup ? (
                          <Badge variant="secondary">{student.yearGroup}</Badge>
                        ) : (
                          '\u2014'
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {student.studentCode || '\u2014'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(paths.dashboard.students.profile(id))}
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
