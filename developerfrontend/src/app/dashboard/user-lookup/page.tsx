'use client';

import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { toast } from 'sonner';
import { lookupUserEnhanced, type EnhancedUserInfo } from '@/lib/admin-api';
import { Input } from '@/components/ui/input';
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

export default function UserLookupPage() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<EnhancedUserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res: any = await lookupUserEnhanced(email.trim());
      const userData = res.user || res.data || res;
      if (userData && (userData.id || userData.email)) {
        setUser(userData as EnhancedUserInfo);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      if (err?.status === 404) {
        setUser(null);
      } else {
        toast.error(err?.message || 'Failed to look up user.');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Lookup</h2>
        <p className="text-muted-foreground">
          Search for any user by email. View role-specific details for students and parents.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Lookup'}
        </Button>
      </form>

      {searched && !loading && !user && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No user found for &ldquo;{email}&rdquo;.
          </CardContent>
        </Card>
      )}

      {user && (
        <div className="space-y-6">
          {/* User Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                {user.role && (
                  <Badge variant="secondary" className="ml-auto">
                    {user.role}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">User ID</dt>
                  <dd className="mt-1 font-mono text-xs">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd className="mt-1 text-sm">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                  <dd className="mt-1 text-sm capitalize">{user.role || '\u2014'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="mt-1 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '\u2014'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Student-specific: studentCode, organizations, linked parents */}
          {user.studentProfile && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Student Profile</CardTitle>
                  <CardDescription>Student-specific information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Student Code</dt>
                      <dd className="mt-1 font-mono text-sm font-bold">
                        {user.studentProfile.studentCode || '\u2014'}
                      </dd>
                    </div>
                  </dl>

                  {/* Organizations */}
                  {user.studentProfile.organizations &&
                    user.studentProfile.organizations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                          Organizations
                        </h4>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Organization Name</TableHead>
                                <TableHead>Organization ID</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {user.studentProfile.organizations.map((org) => (
                                <TableRow key={org.organizationId}>
                                  <TableCell className="font-medium">
                                    {org.organizationName}
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">
                                    {org.organizationId}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                  {/* Linked Parents */}
                  {user.studentProfile.linkedParents &&
                    user.studentProfile.linkedParents.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                          Linked Parents
                        </h4>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {user.studentProfile.linkedParents.map((parent) => (
                                <TableRow key={parent.id}>
                                  <TableCell className="font-medium">
                                    {parent.firstName} {parent.lastName}
                                  </TableCell>
                                  <TableCell>{parent.email}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                  {user.studentProfile.linkedParents &&
                    user.studentProfile.linkedParents.length === 0 && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        No linked parents found.
                      </p>
                    )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Parent-specific: linked children */}
          {user.parentProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Parent Profile</CardTitle>
                <CardDescription>Linked children for this parent account.</CardDescription>
              </CardHeader>
              <CardContent>
                {user.parentProfile.linkedChildren &&
                  user.parentProfile.linkedChildren.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Student Code</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.parentProfile.linkedChildren.map((child) => (
                          <TableRow key={child.id}>
                            <TableCell className="font-medium">
                              {child.firstName} {child.lastName}
                            </TableCell>
                            <TableCell>{child.email}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {child.studentCode || '\u2014'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No linked children found.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Organization Memberships (shown for all roles) */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Memberships</CardTitle>
              <CardDescription>Organizations this user belongs to.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.memberships && user.memberships.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.memberships.map((membership, idx) => (
                        <TableRow key={membership.organizationId || idx}>
                          <TableCell className="font-medium">
                            {membership.organizationName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{membership.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {membership.joinedAt
                              ? new Date(membership.joinedAt).toLocaleDateString()
                              : '\u2014'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This user is not a member of any organization.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
