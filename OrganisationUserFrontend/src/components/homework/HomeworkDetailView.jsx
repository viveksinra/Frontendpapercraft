'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getHomework, getHomeworkSubmissions, gradeSubmission, deleteHomework } from 'src/lib/homework-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// ----------------------------------------------------------------------

const STATUS_VARIANT = {
  active: 'default',
  past_due: 'destructive',
  completed: 'secondary',
  archived: 'outline',
};

const SUB_STATUS_VARIANT = {
  pending: 'outline',
  submitted: 'default',
  late: 'destructive',
  graded: 'secondary',
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm">{value || '\u2014'}</span>
    </div>
  );
}

// ----------------------------------------------------------------------

export default function HomeworkDetailView({ homeworkId }) {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homework, setHomework] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  // Grading dialog
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [grading, setGrading] = useState(false);

  const loadData = useCallback(async () => {
    if (!activeCompanyId || !homeworkId) return;
    try {
      setLoading(true);
      setError(null);
      const [hw, subs] = await Promise.all([
        getHomework(activeCompanyId, homeworkId),
        getHomeworkSubmissions(activeCompanyId, homeworkId),
      ]);
      setHomework(hw);
      setSubmissions(subs?.submissions || subs || []);
    } catch (err) {
      setError(err.message || 'Failed to load homework');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, homeworkId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openGradeDialog(sub) {
    setGradingSubmission(sub);
    setGradeScore(sub.score != null ? String(sub.score) : '');
    setGradeFeedback(sub.feedback || '');
    setGradeOpen(true);
  }

  async function handleGrade() {
    if (!gradingSubmission) return;
    try {
      setGrading(true);
      await gradeSubmission(activeCompanyId, homeworkId, gradingSubmission._id || gradingSubmission.id, {
        score: Number(gradeScore),
        feedback: gradeFeedback.trim(),
      });
      setGradeOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to archive this homework?')) return;
    try {
      await deleteHomework(activeCompanyId, homeworkId);
      router.push(paths.dashboard.homework.root);
    } catch (err) {
      setError(err.message || 'Failed to archive homework');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!homework) {
    return (
      <div className="container max-w-screen-lg mx-auto px-4 py-6">
        <p className="text-muted-foreground">Homework not found.</p>
      </div>
    );
  }

  const summary = homework.submissionSummary || {};
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'submissions', label: `Submissions (${submissions.length})` },
  ];

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.homework.root)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{homework.title}</h1>
              <p className="text-sm text-muted-foreground">
                {homework.type === 'test' ? 'Test-based' : 'Question-based'} homework
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={STATUS_VARIANT[homework.status] || 'outline'}>
              {homework.status}
            </Badge>
            {homework.status !== 'archived' && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Archive
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Progress summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: summary.total ?? 0 },
            { label: 'Completed', value: summary.completed ?? 0 },
            { label: 'Pending', value: summary.pending ?? 0 },
            { label: 'Overdue', value: summary.overdue ?? 0 },
            { label: 'Late', value: summary.late ?? 0 },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border p-3 text-center">
              <div className="text-xl font-bold tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow label="Description" value={homework.description} />
            <InfoRow label="Total Marks" value={homework.totalMarks} />
            <InfoRow label="Due Date" value={homework.dueDate ? new Date(homework.dueDate).toLocaleString('en-GB') : null} />
            <InfoRow label="Assigned" value={homework.assignedAt ? new Date(homework.assignedAt).toLocaleDateString('en-GB') : null} />
            <InfoRow label="Late Submissions" value={homework.lateSubmissionAllowed ? 'Allowed' : 'Not allowed'} />
            {homework.lateDeadline && (
              <InfoRow label="Late Deadline" value={new Date(homework.lateDeadline).toLocaleString('en-GB')} />
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="flex flex-col gap-4">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[100px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((sub) => {
                      const id = sub._id || sub.id;
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">{sub.studentName || sub.studentUserId}</TableCell>
                          <TableCell>
                            <Badge variant={SUB_STATUS_VARIANT[sub.status] || 'outline'}>
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {sub.score != null ? `${sub.score}/${sub.totalMarks}` : '\u2014'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-GB') : '\u2014'}
                          </TableCell>
                          <TableCell>
                            {(sub.status === 'submitted' || sub.status === 'late') && (
                              <Button variant="ghost" size="sm" onClick={() => openGradeDialog(sub)}>
                                Grade
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Grade dialog */}
        <Dialog open={gradeOpen} onOpenChange={setGradeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label>Score (out of {gradingSubmission?.totalMarks ?? homework.totalMarks})</Label>
                <Input
                  type="number"
                  min="0"
                  max={gradingSubmission?.totalMarks ?? homework.totalMarks}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Feedback</Label>
                <Textarea
                  rows={3}
                  placeholder="Optional feedback for the student..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGradeOpen(false)}>Cancel</Button>
              <Button onClick={handleGrade} disabled={grading}>
                {grading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Grade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
