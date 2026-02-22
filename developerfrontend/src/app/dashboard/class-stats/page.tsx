'use client';

import { useState } from 'react';
import { Search, GraduationCap, BookOpen, Users as UsersIcon, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosInstance from '@/lib/axios';

interface ClassStatsData {
  organizationId: string;
  organizationName: string;
  totalClasses: number;
  activeClasses: number;
  archivedClasses: number;
  totalStudentsEnrolled: number;
  totalHomework: number;
  totalAnnouncements: number;
  classes: Array<{
    id: string;
    name: string;
    studentCount: number;
    homeworkCount: number;
    status: string;
  }>;
}

export default function ClassStatsPage() {
  const [orgId, setOrgId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClassStatsData | null>(null);

  async function handleSearch() {
    if (!orgId.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/api/v2/admin/organizations/${orgId.trim()}/class-stats`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch class stats');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const statCards = data ? [
    { label: 'Total Classes', value: data.totalClasses, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active', value: data.activeClasses, icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Students Enrolled', value: data.totalStudentsEnrolled, icon: UsersIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Homework', value: data.totalHomework, icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Class Stats</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View class management statistics for an organisation.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1 max-w-sm space-y-1.5">
          <Label>Organisation ID</Label>
          <Input
            placeholder="Enter organisation ID..."
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {data.classes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Class</th>
                        <th className="px-4 py-3 text-left font-medium">Students</th>
                        <th className="px-4 py-3 text-left font-medium">Homework</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.classes.map((cls) => (
                        <tr key={cls.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{cls.name}</td>
                          <td className="px-4 py-3 tabular-nums">{cls.studentCount}</td>
                          <td className="px-4 py-3 tabular-nums">{cls.homeworkCount}</td>
                          <td className="px-4 py-3">
                            <Badge variant={cls.status === 'active' ? 'success' : 'secondary'}>
                              {cls.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!data && !error && !loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Enter an organisation ID to view class statistics.
          </p>
        </div>
      )}
    </div>
  );
}
