'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { getOrganization, type OrganizationDetail } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  const [org, setOrg] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await getOrganization(orgId);
        setOrg(res.organization || res.data || res);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load organization details.');
      } finally {
        setLoading(false);
      }
    }
    if (orgId) fetchOrg();
  }, [orgId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/organizations')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Button>
        <div className="py-20 text-center text-muted-foreground">
          Organization not found or could not be loaded.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard/organizations')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Organizations
      </Button>

      {/* Organization Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-xl">{org.name}</CardTitle>
              <CardDescription className="font-mono text-xs">{org.slug}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                  {org.status || '—'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Owner Email</dt>
              <dd className="mt-1 text-sm">{org.ownerEmail || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Members</dt>
              <dd className="mt-1 text-sm">{org.memberCount ?? org.members?.length ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
              <dd className="mt-1 text-sm">
                {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {org.members && org.members.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {org.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No members found.</p>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Usage Statistics</CardTitle>
          </div>
          <CardDescription>Usage metrics for this organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border p-4 text-center">
              <dt className="text-sm font-medium text-muted-foreground">Questions Created</dt>
              <dd className="mt-1 text-2xl font-bold">&mdash;</dd>
            </div>
            <div className="rounded-md border p-4 text-center">
              <dt className="text-sm font-medium text-muted-foreground">Tests Created</dt>
              <dd className="mt-1 text-2xl font-bold">&mdash;</dd>
            </div>
            <div className="rounded-md border p-4 text-center">
              <dt className="text-sm font-medium text-muted-foreground">Total Submissions</dt>
              <dd className="mt-1 text-2xl font-bold">&mdash;</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
