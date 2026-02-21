'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Stack,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Container,
} from '@mui/material';
import { MdCheckCircle, MdError, MdBusiness, MdPerson } from 'react-icons/md';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { getInviteDetails, acceptInvite } from 'src/lib/membership-api';
import { selectActiveCompany } from 'src/lib/company-api';

// ----------------------------------------------------------------------

const ROLE_CONFIG = {
  owner: { label: 'Owner', color: 'error' },
  admin: { label: 'Admin', color: 'warning' },
  manager: { label: 'Manager', color: 'info' },
  editor: { label: 'Editor', color: 'primary' },
  viewer: { label: 'Viewer', color: 'default' },
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
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading...
          </Typography>
        </Card>
      </Container>
    );
  }

  // Show loading while fetching invite
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading invite details...
          </Typography>
        </Card>
      </Container>
    );
  }

  // Show error state
  if (error && !inviteData) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <MdError size={64} color="#d32f2f" style={{ marginBottom: 16 }} />
          <Typography variant="h5" gutterBottom>
            Invalid Invite
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => router.push(paths.dashboard.root)}>
            Go to Dashboard
          </Button>
        </Card>
      </Container>
    );
  }

  // Show success state
  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <MdCheckCircle size={64} color="#2e7d32" style={{ marginBottom: 16 }} />
          <Typography variant="h5" gutterBottom>
            Welcome to {inviteData?.company?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You have successfully joined the team. Redirecting to dashboard...
          </Typography>
          <CircularProgress size={24} />
        </Card>
      </Container>
    );
  }

  const invite = inviteData?.invite;
  const company = inviteData?.company;
  const roleConfig = ROLE_CONFIG[invite?.role] || ROLE_CONFIG.viewer;
  const isInviteValid = invite?.status === 'pending' && !invite?.isExpired;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ p: 4 }}>
        <Stack spacing={4} alignItems="center">
          {/* Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Team Invitation
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have been invited to join a team
            </Typography>
          </Box>

          {/* Company info */}
          <Box
            sx={{
              width: '100%',
              p: 3,
              borderRadius: 2,
              bgcolor: 'action.hover',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <MdBusiness size={32} />
            </Box>
            <Typography variant="h5" gutterBottom>
              {company?.name || 'Unknown Company'}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                You will join as
              </Typography>
              <Chip
                label={roleConfig.label}
                color={roleConfig.color}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Box>

          {/* Current user info */}
          <Box
            sx={{
              width: '100%',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MdPerson size={24} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Logged in as
                </Typography>
                <Typography variant="subtitle2">{user?.email}</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Status messages */}
          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {!isInviteValid && (
            <Alert severity="warning" sx={{ width: '100%' }}>
              {invite?.status === 'used'
                ? 'This invitation has already been used.'
                : invite?.status === 'revoked'
                  ? 'This invitation has been revoked.'
                  : 'This invitation has expired.'}
            </Alert>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push(paths.dashboard.root)}
              disabled={accepting}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAccept}
              disabled={!isInviteValid || accepting}
              startIcon={accepting && <CircularProgress size={16} color="inherit" />}
            >
              {accepting ? 'Joining...' : 'Accept & Join'}
            </Button>
          </Stack>

          {/* Expiry notice */}
          {isInviteValid && (
            <Typography variant="caption" color="text.secondary" textAlign="center">
              This invitation will expire on{' '}
              {new Date(invite.expiresAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          )}
        </Stack>
      </Card>
    </Container>
  );
}

