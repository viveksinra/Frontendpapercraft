'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

interface Answer {
  questionId: string;
  answer: unknown;
  isCorrect: boolean;
  marksAwarded: number;
  timeSpent: number;
  flagged: boolean;
}

interface SectionTransition {
  sectionIndex: number;
  startedAt: string;
  lockedAt: string;
}

interface TestAttempt {
  id: string;
  studentId: string;
  testId: string;
  attemptNumber: number;
  status: string;
  startedAt: string;
  submittedAt: string;
  answers: Answer[];
  questionOrder: string[];
  optionOrders: Record<string, string[]>;
  sectionTransitions: SectionTransition[];
}

async function searchAttempts(searchType: string, query: string) {
  const res = await axiosInstance.get('/api/v2/admin/test-attempts', {
    params: { [searchType]: query },
  });
  return res.data;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '\u2014';
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined) return '\u2014';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function TestDebuggingPage() {
  const [searchType, setSearchType] = useState('email');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await searchAttempts(searchType, query.trim());
      const data = res.attempts || res.data || res;
      setAttempts(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err: any) {
      if (err?.status === 404) {
        setAttempts([]);
      } else {
        toast.error(err?.message || 'Failed to search test attempts.');
        setAttempts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Test Debugging</h2>
        <p className="text-muted-foreground">
          Search and view any student&apos;s test attempt details for debugging.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Student Email</SelectItem>
            <SelectItem value="testId">Test ID</SelectItem>
            <SelectItem value="attemptId">Attempt ID</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              searchType === 'email'
                ? 'student@example.com'
                : searchType === 'testId'
                  ? 'Enter test ID...'
                  : 'Enter attempt ID...'
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

      {searched && !loading && attempts.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No test attempts found for &ldquo;{query}&rdquo;.
          </CardContent>
        </Card>
      )}

      {attempts.map((attempt, idx) => (
        <div key={attempt.id || idx} className="space-y-4">
          {/* Attempt Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Attempt #{attempt.attemptNumber ?? idx + 1}
                  </CardTitle>
                  <CardDescription>
                    {attempt.id ? `ID: ${attempt.id}` : ''}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    attempt.status === 'completed'
                      ? 'success'
                      : attempt.status === 'in_progress'
                        ? 'info' as any
                        : 'outline'
                  }
                >
                  {attempt.status || 'unknown'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Student ID</dt>
                  <dd className="mt-1 font-mono text-xs">{attempt.studentId || '\u2014'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Test ID</dt>
                  <dd className="mt-1 font-mono text-xs">{attempt.testId || '\u2014'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Attempt Number</dt>
                  <dd className="mt-1 text-sm">{attempt.attemptNumber ?? '\u2014'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className="mt-1 text-sm">{attempt.status || '\u2014'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Started At</dt>
                  <dd className="mt-1 text-sm">{formatDate(attempt.startedAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Submitted At</dt>
                  <dd className="mt-1 text-sm">{formatDate(attempt.submittedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Answers List */}
          {attempt.answers && attempt.answers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Answers ({attempt.answers.length})</CardTitle>
                <CardDescription>Detailed answer data for each question.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question ID</TableHead>
                        <TableHead>Answer</TableHead>
                        <TableHead>Correct</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Time Spent</TableHead>
                        <TableHead>Flagged</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attempt.answers.map((answer, ansIdx) => (
                        <TableRow key={answer.questionId || ansIdx} className={ansIdx % 2 === 1 ? 'bg-muted/20' : ''}>
                          <TableCell className="font-mono text-xs">
                            {answer.questionId || '\u2014'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate font-mono text-xs">
                            {formatAnswerValue(answer.answer)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={answer.isCorrect ? 'success' : 'destructive'}>
                              {answer.isCorrect ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>{answer.marksAwarded ?? '\u2014'}</TableCell>
                          <TableCell>
                            {answer.timeSpent != null ? `${answer.timeSpent}s` : '\u2014'}
                          </TableCell>
                          <TableCell>
                            {answer.flagged ? (
                              <Badge variant="warning">Flagged</Badge>
                            ) : (
                              '\u2014'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Randomization Display */}
          {(attempt.questionOrder || attempt.optionOrders) && (
            <Card>
              <CardHeader>
                <CardTitle>Randomization Data</CardTitle>
                <CardDescription>
                  Question and option ordering for this attempt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {attempt.questionOrder && attempt.questionOrder.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      Question Order
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {attempt.questionOrder.map((qId, qIdx) => (
                        <Badge key={qIdx} variant="outline" className="font-mono text-xs">
                          {qIdx + 1}. {qId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {attempt.optionOrders && Object.keys(attempt.optionOrders).length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      Option Orders
                    </h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question ID</TableHead>
                            <TableHead>Option Order</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(attempt.optionOrders).map(([qId, order]) => (
                            <TableRow key={qId}>
                              <TableCell className="font-mono text-xs">{qId}</TableCell>
                              <TableCell className="font-mono text-xs">
                                {Array.isArray(order) ? order.join(', ') : JSON.stringify(order)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section Transitions */}
          {attempt.sectionTransitions && attempt.sectionTransitions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Section Transitions</CardTitle>
                <CardDescription>
                  Timing data for each section during the attempt.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section Index</TableHead>
                        <TableHead>Started At</TableHead>
                        <TableHead>Locked At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attempt.sectionTransitions.map((transition, tIdx) => (
                        <TableRow key={tIdx}>
                          <TableCell>{transition.sectionIndex}</TableCell>
                          <TableCell className="text-sm">
                            {formatDate(transition.startedAt)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(transition.lockedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Separator between multiple attempts */}
          {idx < attempts.length - 1 && (
            <Separator className="my-6" />
          )}
        </div>
      ))}
    </div>
  );
}
