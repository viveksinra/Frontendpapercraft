'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { User, XCircle, Loader2, Building, CheckCircle } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { selectActiveCompany } from 'src/lib/company-api';
import { acceptInvite, getInviteDetails } from 'src/lib/membership-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const ROLE_CONFIG = {
  owner: { label: 'Owner' },
  admin: { label: 'Admin' },
  senior_teacher: { label: 'Senior Teacher' },
  teacher: { label: 'Teacher' },
  content_reviewer: { label: 'Content Reviewer' },
  student: { label: 'Student' },
  parent: { label: 'Parent' },
};

// ----------------------------------------------------------------------

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const { user, authenticated, loading: authLoading } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const inviteCode = params.code;

  // Fetch invite details
  const fetchInvite = useCallback(async () => {
    if (!inviteCode) {
      setError('Invalid invite link');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getInviteDetails(inviteCode);
      setInviteData(data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load invite';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [inviteCode]);

  useEffect(() => {
    if (!authLoading && authenticated) {
      fetchInvite();
    }
  }, [authLoading, authenticated, fetchInvite]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authenticated) {
      const returnUrl = `/invite/${inviteCode}`;
      router.push(`${paths.auth.jwt.signIn}?returnTo=${encodeURIComponent(returnUrl)}`);
    }
  }, [authLoading, authenticated, inviteCode, router]);

  const handleAccept = async () => {
    try {
      setAccepting(true);
      setError(null);
      const result = await acceptInvite(inviteCode);
      setSuccess(true);

      // Select the new company
      if (result.company?.id) {
        await selectActiveCompany(result.company.id);
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(paths.dashboard.root);
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to accept invite';
      setError(errorMsg);
    } finally {
      setAccepting(false);
    }
  };

  // Show loading while checking auth
  if (authLoading || (!authenticated && !error)) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while fetching invite
  if (loading) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading invite details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error && !inviteData) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <Card>
          <CardContent className="flex flex-col items-center p-8 text-center">
            <XCircle className="mb-4 h-16 w-16 text-destructive" />
            <h2 className="mb-2 text-xl font-semibold">Invalid Invite</h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={() => router.push(paths.dashboard.root)}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <Card>
          <CardContent className="flex flex-col items-center p-8 text-center">
            <CheckCircle className="mb-4 h-16 w-16 text-green-600" />
            <h2 className="mb-2 text-xl font-semibold">
              Welcome to {inviteData?.company?.name}!
            </h2>
            <p className="mb-6 text-muted-foreground">
              You have successfully joined the team. Redirecting to dashboard...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const invite = inviteData?.invite;
  const company = inviteData?.company;
  const roleConfig = ROLE_CONFIG[invite?.role] || ROLE_CONFIG.student;
  const isInviteValid = invite?.status === 'pending' && !invite?.isExpired;

  return (
    <div className="mx-auto max-w-sm py-16">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold">Team Invitation</h1>
              <p className="text-muted-foreground">You have been invited to join a team</p>
            </div>

            {/* Company info */}
            <div className="w-full rounded-lg bg-muted p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">
                {company?.name || 'Unknown Company'}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">You will join as</span>
                <Badge variant="secondary" className="font-semibold">
                  {roleConfig.label}
                </Badge>
              </div>
            </div>

            {/* Current user info */}
            <div className="w-full rounded-md border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Logged in as</p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Status messages */}
            {error && (
              <div className="w-full rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {!isInviteValid && (
              <div className="w-full rounded-md border border-yellow-500/50 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                {invite?.status === 'used'
                  ? 'This invitation has already been used.'
                  : invite?.status === 'revoked'
                    ? 'This invitation has been revoked.'
                    : 'This invitation has expired.'}
              </div>
            )}

            {/* Actions */}
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(paths.dashboard.root)}
                disabled={accepting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAccept}
                disabled={!isInviteValid || accepting}
              >
                {accepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {accepting ? 'Joining...' : 'Accept & Join'}
              </Button>
            </div>

            {/* Expiry notice */}
            {isInviteValid && (
              <p className="text-center text-xs text-muted-foreground">
                This invitation will expire on{' '}
                {new Date(invite.expiresAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
