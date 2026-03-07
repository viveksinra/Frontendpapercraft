'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  X,
  User,
  Mail,
  Hash,
  Copy,
  Send,
  Users,
  Check,
  School,
  Loader2,
  Building,
  UserPlus,
  ArrowLeft,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  inviteParent,
  getStudentProfile,
  getStudentParents,
  getStudentTestHistory,
} from 'src/lib/student-admin-api';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

// ----------------------------------------------------------------------

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-all">{value || '\u2014'}</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

export default function StudentProfileView({ studentId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [parents, setParents] = useState([]);
  const [testHistory, setTestHistory] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  const activeCompanyId = getActiveCompanyIdFromCookie();

  const handleCopyCode = useCallback(async () => {
    if (!student?.studentCode) return;
    try {
      await navigator.clipboard.writeText(student.studentCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = student.studentCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  }, [student?.studentCode]);

  const handleInviteParent = async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setInviteError('Please enter a valid email address');
      return;
    }
    try {
      setInviting(true);
      setInviteError(null);
      await inviteParent(activeCompanyId, studentId, email);
      setInviteSuccess(true);
    } catch (err) {
      setInviteError(err.message || 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
    setInviteEmail('');
    setInviteSuccess(false);
    setInviteError(null);
  };

  useEffect(() => {
    if (!activeCompanyId || !studentId) {
      setError('Missing company or student ID');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [profileData, parentsData, historyData] = await Promise.allSettled([
          getStudentProfile(activeCompanyId, studentId),
          getStudentParents(activeCompanyId, studentId),
          getStudentTestHistory(activeCompanyId, studentId),
        ]);

        if (cancelled) return;

        if (profileData.status === 'fulfilled') {
          setStudent(profileData.value?.student || profileData.value);
        } else {
          setError(profileData.reason?.message || 'Failed to load student profile');
          return;
        }

        if (parentsData.status === 'fulfilled') {
          setParents(parentsData.value?.parents || parentsData.value || []);
        }

        if (historyData.status === 'fulfilled') {
          setTestHistory(historyData.value?.summary || historyData.value || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load student data');
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
  }, [activeCompanyId, studentId]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="container max-w-screen-lg mx-auto px-4 py-6">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      </div>
    );
  }

  // --- Derived values ---
  const totalTests = testHistory?.totalTests ?? 0;
  const averageScore = testHistory?.averageScore != null
    ? `${Number(testHistory.averageScore).toFixed(1)}%`
    : '\u2014';

  const organisations = Array.isArray(student?.organisations)
    ? student.organisations
    : student?.organisations
      ? [student.organisations]
      : [];

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Back button */}
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
          <p className="text-sm text-muted-foreground">
            View student information, linked parents, and test history.
          </p>
        </div>

        {/* Profile info card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {student?.firstName && student?.lastName
                ? `${student.firstName} ${student.lastName}`
                : student?.name || 'Student'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <InfoRow
                icon={Mail}
                label="Email"
                value={student?.email}
              />
              <InfoRow
                icon={GraduationCap}
                label="Year Group"
                value={student?.yearGroup}
              />
              <InfoRow
                icon={School}
                label="School"
                value={student?.school}
              />
              <div className="flex items-start gap-3 py-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Student Code</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium font-mono break-all">
                      {student?.studentCode || '\u2014'}
                    </p>
                    {student?.studentCode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={handleCopyCode}
                        title={codeCopied ? 'Copied!' : 'Copy student code'}
                      >
                        {codeCopied ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {organisations.length > 0 && (
                <div className="flex items-start gap-3 py-2 md:col-span-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Organisations</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {organisations.map((org, idx) => (
                        <Badge key={idx} variant="secondary">
                          {typeof org === 'string' ? org : org.name || org.displayName || 'Org'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test history summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{averageScore}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Linked Parents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Linked Parents
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInviteDialogOpen(true)}
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              Invite Parent
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {parents.length === 0 ? (
              <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground">No linked parents found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Relationship</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parents.map((parent, idx) => (
                    <TableRow key={parent.id || parent._id || idx}>
                      <TableCell className="font-medium">
                        {parent.firstName && parent.lastName
                          ? `${parent.firstName} ${parent.lastName}`
                          : parent.name || '\u2014'}
                      </TableCell>
                      <TableCell>{parent.email || '\u2014'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {parent.relationship || 'Parent'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Invite Parent Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={(open) => { if (!open) handleCloseInviteDialog(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Invite Parent</DialogTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCloseInviteDialog}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {!inviteSuccess ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Send an email with the student code to a parent so they can link their account.
                </p>

                {inviteError && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                    {inviteError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="parent-email" className="text-sm font-medium">
                    Parent&apos;s Email Address
                  </label>
                  <Input
                    id="parent-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      if (inviteError) setInviteError(null);
                    }}
                    placeholder="parent@example.com"
                    autoFocus
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseInviteDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteParent}
                    disabled={inviting || !inviteEmail.trim()}
                  >
                    {inviting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {inviting ? 'Sending...' : 'Send Invite'}
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200">
                  Invitation sent successfully to <strong>{inviteEmail}</strong>!
                </div>
                <p className="text-sm text-muted-foreground">
                  The parent will receive an email with the student code and instructions to sign up.
                </p>
                <DialogFooter>
                  <Button onClick={handleCloseInviteDialog}>Done</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
