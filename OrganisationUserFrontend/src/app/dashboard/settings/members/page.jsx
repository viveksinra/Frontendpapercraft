'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  InputAdornment,
  Menu,
  Collapse,
  Skeleton,
  Divider,
  alpha,
} from '@mui/material';
import {
  MdContentCopy,
  MdMoreVert,
  MdPersonAdd,
  MdSearch,
  MdExpandMore,
  MdExpandLess,
  MdDelete,
  MdEdit,
  MdClose,
  MdCheck,
  MdRefresh,
} from 'react-icons/md';
import { useAuthContext } from 'src/auth/hooks';
import {
  getMembers,
  inviteMember,
  getInvites,
  updateMemberRole,
  removeMember,
  revokeInvite,
} from 'src/lib/membership-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

// ----------------------------------------------------------------------

const ROLE_CONFIG = {
  owner: {
    label: 'Owner',
    color: 'error',
    description: 'Full access. Can delete company and transfer ownership.',
  },
  admin: {
    label: 'Admin',
    color: 'warning',
    description: 'Can manage members, settings, and all content.',
  },
  manager: {
    label: 'Manager',
    color: 'info',
    description: 'Can manage templates, pages, and publish content.',
  },
  editor: {
    label: 'Editor',
    color: 'primary',
    description: 'Can create and edit content but cannot publish.',
  },
  viewer: {
    label: 'Viewer',
    color: 'default',
    description: 'Read-only access to view all content.',
  },
};

const ROLE_ORDER = ['owner', 'admin', 'manager', 'editor', 'viewer'];
const ASSIGNABLE_ROLES = ['admin', 'manager', 'editor', 'viewer'];

// Generate avatar background color from email
function stringToColor(str) {
  if (!str) return '#757575'; // Default gray for undefined/null
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#1565c0',
    '#00838f', '#558b2f', '#e64a19', '#5d4037', '#455a64',
  ];
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(email, firstName, lastName) {
  // If we have first and last name, use those
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  if (!email) return '??'; // Default for undefined/null
  const name = email.split('@')[0];
  if (name.includes('.')) {
    const parts = name.split('.');
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatTimeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return then.toLocaleDateString();
}

function getExpiryStatus(createdAt) {
  const created = new Date(createdAt);
  const expiry = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diffMs = expiry - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMs <= 0) return { expired: true, text: 'Expired' };
  if (diffHours < 24) return { expired: false, text: `${diffHours}h left`, urgent: true };
  const diffDays = Math.floor(diffHours / 24);
  return { expired: false, text: `${diffDays}d left` };
}

// ----------------------------------------------------------------------

function MemberCard({ member, currentUserEmail, currentUserRole, onRoleChange, onRemove }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const memberEmail = member?.userEmail || '';
  const displayName = member?.displayName || '';
  const firstName = member?.firstName || '';
  const lastName = member?.lastName || '';
  const isCurrentUser = memberEmail === currentUserEmail;
  const isOwner = member?.role === 'owner';
  const canManage = !isCurrentUser && !isOwner && (currentUserRole === 'owner' || currentUserRole === 'admin');
  const canAssignAdmin = currentUserRole === 'owner';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRoleSelect = (role) => {
    onRoleChange(memberEmail, role);
    handleMenuClose();
  };

  const handleRemoveClick = () => {
    onRemove(memberEmail);
    handleMenuClose();
  };

  const roleConfig = ROLE_CONFIG[member?.role] || ROLE_CONFIG.viewer;

  return (
    <Card
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: stringToColor(memberEmail),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {getInitials(memberEmail, firstName, lastName)}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" noWrap>
            {displayName || memberEmail || 'Unknown'}
          </Typography>
          {isCurrentUser && (
            <Chip label="You" size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
          )}
        </Stack>
        {displayName && memberEmail && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {memberEmail}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Chip
            label={roleConfig.label}
            color={roleConfig.color}
            size="small"
            sx={{ height: 22, fontSize: 11 }}
          />
          <Typography variant="caption" color="text.secondary">
            Joined {member?.joinedAt ? formatTimeAgo(member.joinedAt) : 'Unknown'}
          </Typography>
        </Stack>
      </Box>

      {/* Actions */}
      {canManage && (
        <>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MdMoreVert size={20} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ px: 2, py: 0.5, display: 'block' }}
            >
              Change Role
            </Typography>
            {ASSIGNABLE_ROLES.filter((r) => r !== 'admin' || canAssignAdmin).map((role) => (
              <MenuItem
                key={role}
                selected={member?.role === role}
                onClick={() => handleRoleSelect(role)}
                sx={{ fontSize: 14 }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                  <Chip
                    label={ROLE_CONFIG[role].label}
                    color={ROLE_CONFIG[role].color}
                    size="small"
                    sx={{ height: 20, fontSize: 11 }}
                  />
                  {member?.role === role && <MdCheck size={16} />}
                </Stack>
              </MenuItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleRemoveClick} sx={{ color: 'error.main', fontSize: 14 }}>
              <MdDelete size={16} style={{ marginRight: 8 }} />
              Remove Member
            </MenuItem>
          </Menu>
        </>
      )}
    </Card>
  );
}

function InviteCard({ invite, onCopy, onRevoke }) {
  const [copied, setCopied] = useState(false);
  const expiry = getExpiryStatus(invite.createdAt);
  const isUsed = invite.status === 'used';
  const isRevoked = invite.status === 'revoked';
  const isInactive = isUsed || isRevoked || expiry.expired;

  const handleCopy = () => {
    const inviteUrl = `${window.location.origin}/invite/${invite.code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const roleConfig = ROLE_CONFIG[invite.role] || ROLE_CONFIG.viewer;

  return (
    <Card
      sx={{
        p: 2,
        opacity: isInactive ? 0.6 : 1,
        bgcolor: isInactive ? 'action.disabledBackground' : 'background.paper',
      }}
    >
      <Stack spacing={1.5}>
        {/* Email and role */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Invited
            </Typography>
            <Typography variant="body2" fontWeight={600} noWrap>
              {invite.email}
            </Typography>
          </Box>
          <Stack alignItems="flex-end" spacing={0.5}>
            <Chip
              label={roleConfig.label}
              color={roleConfig.color}
              size="small"
              sx={{ height: 22, fontSize: 11 }}
            />
            {isUsed ? (
              <Chip
                label={`Joined${invite.usedBy ? ` as ${invite.usedBy}` : ''}`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ height: 20, fontSize: 10 }}
              />
            ) : isRevoked ? (
              <Chip
                label="Revoked"
                size="small"
                color="error"
                variant="outlined"
                sx={{ height: 20, fontSize: 10 }}
              />
            ) : expiry.expired ? (
              <Chip
                label="Expired"
                size="small"
                color="error"
                variant="outlined"
                sx={{ height: 20, fontSize: 10 }}
              />
            ) : (
              <Typography
                variant="caption"
                color={expiry.urgent ? 'warning.main' : 'text.secondary'}
              >
                {expiry.text}
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Actions row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary" noWrap>
            {formatTimeAgo(invite.createdAt)}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {!isInactive && (
              <>
                <Tooltip title={copied ? 'Copied!' : 'Copy invite link'}>
                  <IconButton size="small" onClick={handleCopy}>
                    {copied ? <MdCheck size={16} color="green" /> : <MdContentCopy size={16} />}
                  </IconButton>
                </Tooltip>
                <Button
                  size="small"
                  color="error"
                  onClick={() => onRevoke(invite.code)}
                  sx={{ minWidth: 'auto', px: 1, fontSize: 12 }}
                >
                  Revoke
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export default function MembersSettingsPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Invite dialog
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteEmailError, setInviteEmailError] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [lastInvite, setLastInvite] = useState(null);
  const [inviteDialogError, setInviteDialogError] = useState('');

  // Role change dialog
  const [roleChangeDialog, setRoleChangeDialog] = useState({ open: false, email: null, role: null });
  const [changingRole, setChangingRole] = useState(false);

  // Remove dialog
  const [removeDialog, setRemoveDialog] = useState({ open: false, email: null });
  const [removing, setRemoving] = useState(false);

  // Revoke dialog
  const [revokeDialog, setRevokeDialog] = useState({ open: false, code: null });
  const [revoking, setRevoking] = useState(false);

  // Permissions reference
  const [showPermissions, setShowPermissions] = useState(false);

  const activeCompanyId = getActiveCompanyIdFromCookie();
  const currentUserEmail = user?.email?.toLowerCase();

  const currentUserRole = useMemo(() => {
    const membership = members.find((m) => m.userEmail === currentUserEmail);
    return membership?.role || 'viewer';
  }, [members, currentUserEmail]);

  const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin';

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.userEmail.toLowerCase().includes(q));
    }

    if (roleFilter !== 'all') {
      result = result.filter((m) => m.role === roleFilter);
    }

    // Sort by role hierarchy then by email
    result.sort((a, b) => {
      const roleA = ROLE_ORDER.indexOf(a.role);
      const roleB = ROLE_ORDER.indexOf(b.role);
      if (roleA !== roleB) return roleA - roleB;
      return a.userEmail.localeCompare(b.userEmail);
    });

    return result;
  }, [members, searchQuery, roleFilter]);

  // Separate pending and used invites
  const { pendingInvites, usedInvites } = useMemo(() => {
    const pending = invites.filter((i) => i.status === 'pending');
    const used = invites.filter((i) => i.status === 'used');
    return { pendingInvites: pending, usedInvites: used };
  }, [invites]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [membersData, invitesData] = await Promise.all([
        getMembers(activeCompanyId),
        canInvite ? getInvites(activeCompanyId).catch(() => []) : Promise.resolve([]),
      ]);
      setMembers(membersData);
      setInvites(invitesData);
    } catch (err) {
      console.error('Failed to load members:', err);
      setError(err.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, canInvite]);

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }
    loadData();
  }, [activeCompanyId, loadData]);

  // Invite handlers
  const handleInviteClick = () => {
    setInviteDialogOpen(true);
    setLastInvite(null);
    setInviteEmail('');
    setInviteEmailError('');
    setInviteDialogError('');
    setSelectedRole('editor');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInviteSubmit = async () => {
    // Validate email
    const trimmedEmail = inviteEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setInviteEmailError('Email is required');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setInviteEmailError('Please enter a valid email address');
      return;
    }
    setInviteEmailError('');
    setInviteDialogError('');

    try {
      setInviting(true);
      const result = await inviteMember(activeCompanyId, trimmedEmail, selectedRole);
      setLastInvite(result);
      const invitesData = await getInvites(activeCompanyId);
      setInvites(invitesData);
    } catch (err) {
      // Extract error message from API response
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create invite';
      setInviteDialogError(errorMsg);
    } finally {
      setInviting(false);
    }
  };

  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
    setLastInvite(null);
    setInviteEmail('');
    setInviteEmailError('');
    setInviteDialogError('');
  };

  // Role change handlers
  const handleRoleChangeRequest = (email, role) => {
    setRoleChangeDialog({ open: true, email, role });
  };

  const handleRoleChangeConfirm = async () => {
    if (!roleChangeDialog.email || !roleChangeDialog.role) return;
    try {
      setChangingRole(true);
      await updateMemberRole(activeCompanyId, roleChangeDialog.email, roleChangeDialog.role);
      setMembers((prev) =>
        prev.map((m) =>
          m.userEmail === roleChangeDialog.email ? { ...m, role: roleChangeDialog.role } : m
        )
      );
      setSuccess(`Role updated for ${roleChangeDialog.email}`);
      setRoleChangeDialog({ open: false, email: null, role: null });
    } catch (err) {
      setError(err.message || 'Failed to update role');
    } finally {
      setChangingRole(false);
    }
  };

  // Remove member handlers
  const handleRemoveRequest = (email) => {
    setRemoveDialog({ open: true, email });
  };

  const handleRemoveConfirm = async () => {
    if (!removeDialog.email) return;
    try {
      setRemoving(true);
      await removeMember(activeCompanyId, removeDialog.email);
      setMembers((prev) => prev.filter((m) => m.userEmail !== removeDialog.email));
      setSuccess(`Removed ${removeDialog.email} from team`);
      setRemoveDialog({ open: false, email: null });
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setRemoving(false);
    }
  };

  // Revoke invite handlers
  const handleRevokeRequest = (code) => {
    setRevokeDialog({ open: true, code });
  };

  const handleRevokeConfirm = async () => {
    if (!revokeDialog.code) return;
    try {
      setRevoking(true);
      await revokeInvite(activeCompanyId, revokeDialog.code);
      setInvites((prev) => prev.filter((i) => i.code !== revokeDialog.code));
      setSuccess('Invite revoked');
      setRevokeDialog({ open: false, code: null });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to revoke invite');
    } finally {
      setRevoking(false);
    }
  };

  // Clear success message after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={300} height={24} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Team Members
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your team members and their access levels. {members.length} member
              {members.length !== 1 ? 's' : ''} in your organization.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<MdRefresh size={18} />}
              onClick={loadData}
            >
              Refresh
            </Button>
            {canInvite && (
              <Button
                variant="contained"
                startIcon={<MdPersonAdd size={18} />}
                onClick={handleInviteClick}
              >
                Invite Member
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Role Permissions Reference */}
      <Card sx={{ overflow: 'hidden' }}>
        <Button
          fullWidth
          onClick={() => setShowPermissions(!showPermissions)}
          sx={{
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderRadius: 0,
            color: 'text.secondary',
          }}
          endIcon={showPermissions ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
        >
          <Typography variant="subtitle2">Role Permissions Reference</Typography>
        </Button>
        <Collapse in={showPermissions}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Grid container spacing={2}>
              {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                <Grid item xs={12} sm={6} md={4} key={role}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Chip
                      label={config.label}
                      color={config.color}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {config.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>
      </Card>

      {/* Search and Filter */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdSearch size={20} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Roles</MenuItem>
          {ROLE_ORDER.map((role) => (
            <MenuItem key={role} value={role}>
              {ROLE_CONFIG[role].label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Members Grid */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Members ({filteredMembers.length})
        </Typography>
        {filteredMembers.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery || roleFilter !== 'all'
                ? 'No members match your filters'
                : 'No team members yet'}
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredMembers.map((member, index) => (
              <Grid item xs={12} sm={6} key={member.userEmail || `member-${index}`}>
                <MemberCard
                  member={member}
                  currentUserEmail={currentUserEmail}
                  currentUserRole={currentUserRole}
                  onRoleChange={handleRoleChangeRequest}
                  onRemove={handleRemoveRequest}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Pending Invites */}
      {canInvite && pendingInvites.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Pending Invitations ({pendingInvites.length})
          </Typography>
          <Grid container spacing={2}>
            {pendingInvites.map((invite, index) => (
              <Grid item xs={12} sm={6} md={4} key={invite.code || `pending-${index}`}>
                <InviteCard invite={invite} onRevoke={handleRevokeRequest} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Used Invites (collapsed) */}
      {canInvite && usedInvites.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Recently Used Invites ({usedInvites.length})
          </Typography>
          <Grid container spacing={2}>
            {usedInvites.slice(0, 3).map((invite, index) => (
              <Grid item xs={12} sm={6} md={4} key={invite.code || `used-${index}`}>
                <InviteCard invite={invite} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={handleCloseInviteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            Invite Team Member
            <IconButton size="small" onClick={handleCloseInviteDialog}>
              <MdClose size={20} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {!lastInvite ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Enter the email address of the person you want to invite and select their role.
                  They will receive an email with a link to join your organization.
                </Typography>
                {inviteDialogError && (
                  <Alert severity="error" onClose={() => setInviteDialogError('')}>
                    {inviteDialogError}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (inviteEmailError) setInviteEmailError('');
                  }}
                  error={Boolean(inviteEmailError)}
                  helperText={inviteEmailError}
                  placeholder="colleague@example.com"
                  autoFocus
                />
                <TextField
                  select
                  fullWidth
                  label="Role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {ASSIGNABLE_ROLES.filter((r) => r !== 'admin' || currentUserRole === 'owner').map(
                    (role) => (
                      <MenuItem key={role} value={role}>
                        <Stack spacing={0.5}>
                          <Typography variant="body2">{ROLE_CONFIG[role].label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ROLE_CONFIG[role].description}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    )
                  )}
                </TextField>
              </>
            ) : (
              <>
                <Alert severity="success">
                  Invitation sent successfully to <strong>{lastInvite.email}</strong>!
                </Alert>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Invite Link:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fontSize: 13,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {`${window.location.origin}/invite/${lastInvite.code}`}
                    </Typography>
                    <Tooltip title="Copy invite link">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/invite/${lastInvite.code}`
                          );
                        }}
                        size="small"
                      >
                        <MdContentCopy size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Alert severity="info">
                  An email has been sent to the invitee. They can also use the link above to join.
                  The invite expires in 7 days.
                </Alert>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>{lastInvite ? 'Close' : 'Cancel'}</Button>
          {!lastInvite && (
            <Button
              variant="contained"
              onClick={handleInviteSubmit}
              disabled={inviting || !inviteEmail.trim()}
              startIcon={inviting && <CircularProgress size={16} color="inherit" />}
            >
              {inviting ? 'Sending...' : 'Send Invite'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={roleChangeDialog.open}
        onClose={() => setRoleChangeDialog({ open: false, email: null, role: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Member Role?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to change the role of{' '}
            <strong>{roleChangeDialog.email}</strong> to{' '}
            <Chip
              label={ROLE_CONFIG[roleChangeDialog.role]?.label}
              color={ROLE_CONFIG[roleChangeDialog.role]?.color}
              size="small"
            />
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleChangeDialog({ open: false, email: null, role: null })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleRoleChangeConfirm}
            disabled={changingRole}
            startIcon={changingRole && <CircularProgress size={16} color="inherit" />}
          >
            {changingRole ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <Dialog
        open={removeDialog.open}
        onClose={() => setRemoveDialog({ open: false, email: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove Team Member?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove <strong>{removeDialog.email}</strong> from your
            organization? They will lose access to all company resources.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialog({ open: false, email: null })}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveConfirm}
            disabled={removing}
            startIcon={removing && <CircularProgress size={16} color="inherit" />}
          >
            {removing ? 'Removing...' : 'Remove Member'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Invite Confirmation Dialog */}
      <Dialog
        open={revokeDialog.open}
        onClose={() => setRevokeDialog({ open: false, code: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Revoke Invite?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to revoke this invite? The code will no longer be valid.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeDialog({ open: false, code: null })}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRevokeConfirm}
            disabled={revoking}
            startIcon={revoking && <CircularProgress size={16} color="inherit" />}
          >
            {revoking ? 'Revoking...' : 'Revoke Invite'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
