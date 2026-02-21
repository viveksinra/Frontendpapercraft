'use client';

import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { toast } from 'sonner';
import { lookupUser, type UserInfo } from '@/lib/admin-api';
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

export default function UsersPage() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);
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
      const res = await lookupUser(email.trim());
      const userData = res.user || res.data || res;
      if (userData && (userData.id || userData.email)) {
        setUser(userData);
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
        <p className="text-muted-foreground">Search for a user by email address.</p>
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
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="mt-1 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Login</dt>
                  <dd className="mt-1 text-sm">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Organization Memberships */}
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
                              : '—'}
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
