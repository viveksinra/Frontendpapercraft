'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  School,
  Building,
  Hash,
  Users,
  Loader2,
  GraduationCap,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getStudentProfile,
  getStudentParents,
  getStudentTestHistory,
} from 'src/lib/student-admin-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
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

  const activeCompanyId = getActiveCompanyIdFromCookie();

  useEffect(() => {
    if (!activeCompanyId || !studentId) {
      setError('Missing company or student ID');
      setLoading(false);
      return;
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
              <InfoRow
                icon={Hash}
                label="Student Code"
                value={student?.studentCode}
              />
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Linked Parents
            </CardTitle>
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
      </div>
    </div>
  );
}
