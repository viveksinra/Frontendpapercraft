'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { lookupStudentDebug, type StudentDebugInfo } from '@/lib/admin-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '\u2014';
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'info' as any;
    case 'abandoned':
    case 'timed_out':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function StudentDebugPage() {
  const [searchType, setSearchType] = useState('email');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [student, setStudent] = useState<StudentDebugInfo | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const params = searchType === 'email'
        ? { email: query.trim() }
        : { studentCode: query.trim() };
      const res: any = await lookupStudentDebug(params);
      const data = res.student || res.data || res;
      if (data && (data.studentId || data.email)) {
        setStudent(data as StudentDebugInfo);
      } else {
        setStudent(null);
      }
    } catch (err: any) {
      if (err?.status === 404) {
        setStudent(null);
      } else {
        toast.error(err?.message || 'Failed to look up student.');
        setStudent(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Student Debug View</h2>
        <p className="text-muted-foreground">
          Search for a student by email or student code to view all their test attempts across organizations.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-[160px]" aria-label="Search type">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="studentCode">Student Code</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search query"
            placeholder={
              searchType === 'email'
                ? 'student@example.com'
                : 'Enter student code...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {searched && !loading && !student && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No student found for &ldquo;{query}&rdquo;.
          </CardContent>
        </Card>
      )}

      {student && (
        <div className="space-y-6">
          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
                <div>
                  <CardTitle>
                    {student.firstName} {student.lastName}
                  </CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Student ID</dt>
                  <dd className="mt-1 font-mono text-xs">{student.studentId || '\u2014'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Student Code</dt>
                  <dd className="mt-1 font-mono text-sm font-bold">
                    {student.studentCode || '\u2014'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd className="mt-1 text-sm">{student.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Total Attempts</dt>
                  <dd className="mt-1 text-sm">
                    {student.attempts ? student.attempts.length : 0}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Attempts */}
          <Card>
            <CardHeader>
              <CardTitle>
                Test Attempts ({student.attempts ? student.attempts.length : 0})
              </CardTitle>
              <CardDescription>
                All test attempts for this student across all organizations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student.attempts && student.attempts.length > 0 ? (
                <div className="space-y-3">
                  {student.attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{attempt.testName || '\u2014'}</span>
                        <Badge variant={getStatusVariant(attempt.status)}>
                          {attempt.status || 'unknown'}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                        <div>Org: {attempt.organizationName || '\u2014'}</div>
                        <div>Attempt #{attempt.attemptNumber ?? '\u2014'}</div>
                        <div>
                          Score: {attempt.score != null && attempt.totalMarks != null
                            ? `${attempt.score}/${attempt.totalMarks}`
                            : attempt.score != null
                              ? String(attempt.score)
                              : '\u2014'}
                        </div>
                        <div>Started: {formatDate(attempt.startedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No test attempts found for this student.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
