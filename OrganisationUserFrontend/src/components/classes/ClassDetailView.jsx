'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Users, GraduationCap, UserPlus, Trash2 } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getClass,
  getClassStudents,
  addStudentsToClass,
  removeStudentFromClass,
  addTeacherToClass,
  removeTeacherFromClass,
  deleteClass,
} from 'src/lib/class-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

// ----------------------------------------------------------------------

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm">{value || '\u2014'}</span>
    </div>
  );
}

// ----------------------------------------------------------------------

export default function ClassDetailView({ classId }) {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  // Dialog state
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [teacherIdInput, setTeacherIdInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!activeCompanyId || !classId) return;
    try {
      setLoading(true);
      setError(null);
      const [cls, studs] = await Promise.all([
        getClass(activeCompanyId, classId),
        getClassStudents(activeCompanyId, classId),
      ]);
      setClassData(cls);
      setStudents(studs?.students || studs || []);
    } catch (err) {
      setError(err.message || 'Failed to load class');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, classId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAddStudents() {
    const ids = studentIdInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    try {
      setActionLoading(true);
      await addStudentsToClass(activeCompanyId, classId, ids);
      setAddStudentOpen(false);
      setStudentIdInput('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to add students');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemoveStudent(studentId) {
    try {
      setActionLoading(true);
      await removeStudentFromClass(activeCompanyId, classId, studentId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to remove student');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAddTeacher() {
    if (!teacherIdInput.trim()) return;
    try {
      setActionLoading(true);
      await addTeacherToClass(activeCompanyId, classId, teacherIdInput.trim());
      setAddTeacherOpen(false);
      setTeacherIdInput('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to add teacher');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemoveTeacher(teacherId) {
    try {
      setActionLoading(true);
      await removeTeacherFromClass(activeCompanyId, classId, teacherId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to remove teacher');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to archive this class?')) return;
    try {
      await deleteClass(activeCompanyId, classId);
      router.push(paths.dashboard.classes.root);
    } catch (err) {
      setError(err.message || 'Failed to archive class');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="container max-w-screen-lg mx-auto px-4 py-6">
        <p className="text-muted-foreground">Class not found.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'students', label: `Students (${classData.studentCount ?? students.length})` },
    { id: 'teachers', label: `Teachers (${classData.teachers?.length ?? 0})` },
  ];

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.classes.root)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{classData.name}</h1>
              <p className="text-sm text-muted-foreground">
                {classData.subject}{classData.yearGroup ? ` \u2022 ${classData.yearGroup}` : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={classData.status === 'active' ? 'default' : 'secondary'}>
              {classData.status === 'active' ? 'Active' : 'Archived'}
            </Badge>
            {classData.status === 'active' && (
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

        {/* Tab content */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow label="Description" value={classData.description} />
            <InfoRow label="Year Group" value={classData.yearGroup} />
            <InfoRow label="Subject" value={classData.subject} />
            <InfoRow label="Student Count" value={classData.studentCount} />
            {classData.schedule && (
              <>
                <InfoRow label="Schedule Days" value={classData.schedule.dayOfWeek?.join(', ')} />
                <InfoRow label="Time" value={classData.schedule.time} />
                <InfoRow label="Location" value={classData.schedule.location} />
              </>
            )}
            <InfoRow label="Created" value={new Date(classData.createdAt).toLocaleDateString('en-GB')} />
          </div>
        )}

        {activeTab === 'students' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Students
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Students</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 py-4">
                    <Label>Student User IDs (comma-separated)</Label>
                    <Input
                      placeholder="userId1, userId2, ..."
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddStudentOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddStudents} disabled={actionLoading}>
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No students in this class yet.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Fee Status</TableHead>
                      <TableHead className="w-[80px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => {
                      const id = s.userId || s._id || s.id;
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">{s.name || '\u2014'}</TableCell>
                          <TableCell>{s.email || '\u2014'}</TableCell>
                          <TableCell>
                            {s.feeStatus && (
                              <Badge variant={s.feeStatus === 'paid' ? 'default' : s.feeStatus === 'partial' ? 'secondary' : 'destructive'}>
                                {s.feeStatus}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveStudent(id)}
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
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
        )}

        {activeTab === 'teachers' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Dialog open={addTeacherOpen} onOpenChange={setAddTeacherOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Teacher</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 py-4">
                    <Label>Teacher User ID</Label>
                    <Input
                      placeholder="Enter teacher user ID..."
                      value={teacherIdInput}
                      onChange={(e) => setTeacherIdInput(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddTeacherOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTeacher} disabled={actionLoading}>
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {(!classData.teachers || classData.teachers.length === 0) ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Users className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No teachers assigned yet.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher ID</TableHead>
                      <TableHead className="w-[80px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.teachers.map((tid) => (
                      <TableRow key={tid}>
                        <TableCell className="font-mono text-sm">{tid}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTeacher(tid)}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
