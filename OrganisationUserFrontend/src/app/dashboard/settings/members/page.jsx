'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Copy,
  MoreVertical,
  UserPlus,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit,
  X,
  Check,
  RefreshCw,
  Loader2,
} from 'lucide-react';
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// ----------------------------------------------------------------------

const ROLE_CONFIG = {
  owner: {
    label: 'Owner',
    color: 'destructive',
    description: 'Full access. Can delete company and transfer ownership.',
  },
  admin: {
    label: 'Admin',
    color: 'warning',
    description: 'Can manage members, settings, and all content.',
  },
  senior_teacher: {
    label: 'Senior Teacher',
    color: 'default',
    description: 'Creates papers, manages question bank.',
  },
  teacher: {
    label: 'Teacher',
    color: 'secondary',
    description: 'Creates questions, assigns tests.',
  },
  content_reviewer: {
    label: 'Content Reviewer',
    color: 'outline',
    description: 'Reviews and approves questions.',
  },
  student: {
    label: 'Student',
    color: 'default',
    description: 'Takes tests and views results.',
  },
  parent: {
    label: 'Parent',
    color: 'default',
    description: 'Views child progress and results.',
  },
};

const ROLE_ORDER = ['owner', 'admin', 'senior_teacher', 'teacher', 'content_reviewer', 'student', 'parent'];
const ASSIGNABLE_ROLES = ['admin', 'senior_teacher', 'teacher', 'content_reviewer', 'student', 'parent'];

// Badge color helper: maps ROLE_CONFIG color to className
function getRoleBadgeProps(color) {
  switch (color) {
    case 'destructive':
      return { variant: 'destructive' };
    case 'warning':
      return { variant: 'default', className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' };
    case 'default':
      return { variant: 'default' };
    case 'secondary':
      return { variant: 'secondary' };
    case 'outline':
      return { variant: 'outline' };
    default:
      return { variant: 'default' };
  }
}

// Generate avatar background color from email
function stringToColor(str) {
  if (!str) return '#757575';
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
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  if (!email) return '??';
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
  const memberEmail = member?.userEmail || '';
  const displayName = member?.displayName || '';
  const firstName = member?.firstName || '';
  const lastName = member?.lastName || '';
  const isCurrentUser = memberEmail === currentUserEmail;
  const isOwner = member?.role === 'owner';
  const canManage = !isCurrentUser && !isOwner && (currentUserRole === 'owner' || currentUserRole === 'admin');
  const canAssignAdmin = currentUserRole === 'owner';

  const handleRoleSelect = (role) => {
    onRoleChange(memberEmail, role);
  };

  const handleRemoveClick = () => {
    onRemove(memberEmail);
  };

  const roleConfig = ROLE_CONFIG[member?.role] || ROLE_CONFIG.student;
  const badgeProps = getRoleBadgeProps(roleConfig.color);

  return (
    <Card className="py-0 gap-0">
      <CardContent className="flex items-center gap-3 p-4">
        {/* Avatar */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ backgroundColor: stringToColor(memberEmail) }}
        >
          {getInitials(memberEmail, firstName, lastName)}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">
              {displayName || memberEmail || 'Unknown'}
            </p>
            {isCurrentUser && (
              <Badge variant="outline" className="h-5 text-[11px] px-1.5">
                You
              </Badge>
            )}
          </div>
          {displayName && memberEmail && (
            <p className="truncate text-xs text-muted-foreground">
              {memberEmail}
            </p>
          )}
          <div className="mt-1 flex items-center gap-2">
            <Badge {...badgeProps} className={`h-[22px] text-[11px] ${badgeProps.className || ''}`}>
              {roleConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Joined {member?.joinedAt ? formatTimeAgo(member.joinedAt) : 'Unknown'}
            </span>
          </div>
        </div>

        {/* Actions */}
        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <p className="px-2 py-1.5 text-xs text-muted-foreground">
                Change Role
              </p>
              {ASSIGNABLE_ROLES.filter((r) => r !== 'admin' || canAssignAdmin).map((role) => {
                const roleBadgeProps = getRoleBadgeProps(ROLE_CONFIG[role].color);
                return (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="flex items-center justify-between"
                  >
                    <Badge {...roleBadgeProps} className={`h-5 text-[11px] ${roleBadgeProps.className || ''}`}>
                      {ROLE_CONFIG[role].label}
                    </Badge>
                    {member?.role === role && <Check className="size-4" />}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleRemoveClick}
              >
                <Trash2 className="size-4" />
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
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

  const roleConfig = ROLE_CONFIG[invite.role] || ROLE_CONFIG.student;
  const badgeProps = getRoleBadgeProps(roleConfig.color);

  return (
    <Card className={`py-0 gap-0 ${isInactive ? 'opacity-60 bg-muted/50' : ''}`}>
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Email and role */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-xs text-muted-foreground">Invited</span>
            <p className="truncate text-sm font-semibold">{invite.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge {...badgeProps} className={`h-[22px] text-[11px] ${badgeProps.className || ''}`}>
              {roleConfig.label}
            </Badge>
            {isUsed ? (
              <Badge variant="outline" className="h-5 border-green-300 bg-green-50 text-[10px] text-green-700">
                Joined{invite.usedBy ? ` as ${invite.usedBy}` : ''}
              </Badge>
            ) : isRevoked ? (
              <Badge variant="outline" className="h-5 border-red-300 bg-red-50 text-[10px] text-red-700">
                Revoked
              </Badge>
            ) : expiry.expired ? (
              <Badge variant="outline" className="h-5 border-red-300 bg-red-50 text-[10px] text-red-700">
                Expired
              </Badge>
            ) : (
              <span className={`text-xs ${expiry.urgent ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
                {expiry.text}
              </span>
            )}
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between">
          <span className="truncate text-xs text-muted-foreground">
            {formatTimeAgo(invite.createdAt)}
          </span>
          <div className="flex items-center gap-1">
            {!isInactive && (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCopy}
                  title={copied ? 'Copied!' : 'Copy invite link'}
                >
                  {copied ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onRevoke(invite.code)}
                >
                  Revoke
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
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
  const [selectedRole, setSelectedRole] = useState('teacher');
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
    return membership?.role || 'student';
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
    setSelectedRole('teacher');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInviteSubmit = async () => {
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
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="h-6 w-72 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
            <p className="text-sm text-muted-foreground">
              Manage your team members and their access levels. {members.length} member
              {members.length !== 1 ? 's' : ''} in your organization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            {canInvite && (
              <Button onClick={handleInviteClick}>
                <UserPlus className="size-4" />
                Invite Member
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="shrink-0 text-red-500 hover:text-red-700">
            <X className="size-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="flex items-start justify-between gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="shrink-0 text-green-500 hover:text-green-700">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Role Permissions Reference */}
      <Card className="gap-0 overflow-hidden py-0">
        <button
          onClick={() => setShowPermissions(!showPermissions)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/50"
        >
          <span>Role Permissions Reference</span>
          {showPermissions ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showPermissions ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(ROLE_CONFIG).map(([role, config]) => {
                const roleBadgeProps = getRoleBadgeProps(config.color);
                return (
                  <div key={role} className="rounded-lg bg-muted/50 p-3">
                    <Badge {...roleBadgeProps} className={`mb-2 ${roleBadgeProps.className || ''}`}>
                      {config.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLE_ORDER.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_CONFIG[role].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Members Grid */}
      <div>
        <p className="mb-3 text-sm font-semibold text-muted-foreground">
          Members ({filteredMembers.length})
        </p>
        {filteredMembers.length === 0 ? (
          <Card className="py-0 gap-0">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery || roleFilter !== 'all'
                  ? 'No members match your filters'
                  : 'No team members yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredMembers.map((member, index) => (
              <MemberCard
                key={member.userEmail || `member-${index}`}
                member={member}
                currentUserEmail={currentUserEmail}
                currentUserRole={currentUserRole}
                onRoleChange={handleRoleChangeRequest}
                onRemove={handleRemoveRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending Invites */}
      {canInvite && pendingInvites.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-muted-foreground">
            Pending Invitations ({pendingInvites.length})
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {pendingInvites.map((invite, index) => (
              <InviteCard
                key={invite.code || `pending-${index}`}
                invite={invite}
                onRevoke={handleRevokeRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* Used Invites */}
      {canInvite && usedInvites.length > 0 && (
        <div>
          <p className="mb-3 text-xs text-muted-foreground">
            Recently Used Invites ({usedInvites.length})
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {usedInvites.slice(0, 3).map((invite, index) => (
              <InviteCard
                key={invite.code || `used-${index}`}
                invite={invite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={(open) => { if (!open) handleCloseInviteDialog(); }}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Invite Team Member</DialogTitle>
              <Button variant="ghost" size="icon-sm" onClick={handleCloseInviteDialog}>
                <X className="size-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {!lastInvite ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Enter the email address of the person you want to invite and select their role.
                  They will receive an email with a link to join your organization.
                </p>
                {inviteDialogError && (
                  <div className="flex items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                    <span>{inviteDialogError}</span>
                    <button onClick={() => setInviteDialogError('')} className="shrink-0 text-red-500 hover:text-red-700">
                      <X className="size-4" />
                    </button>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="invite-email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      if (inviteEmailError) setInviteEmailError('');
                    }}
                    placeholder="colleague@example.com"
                    autoFocus
                    className={inviteEmailError ? 'border-red-500 focus-visible:ring-red-500/20' : ''}
                  />
                  {inviteEmailError && (
                    <p className="text-xs text-red-600">{inviteEmailError}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="invite-role" className="text-sm font-medium">
                    Role
                  </label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSIGNABLE_ROLES.filter((r) => r !== 'admin' || currentUserRole === 'owner').map(
                        (role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm">{ROLE_CONFIG[role].label}</span>
                              <span className="text-xs text-muted-foreground">
                                {ROLE_CONFIG[role].description}
                              </span>
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200">
                  Invitation sent successfully to <strong>{lastInvite.email}</strong>!
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold">Invite Link:</p>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-muted p-3">
                    <span className="truncate font-mono text-[13px] font-semibold">
                      {`${window.location.origin}/invite/${lastInvite.code}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Copy invite link"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/invite/${lastInvite.code}`
                        );
                      }}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
                  An email has been sent to the invitee. They can also use the link above to join.
                  The invite expires in 7 days.
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseInviteDialog}>
              {lastInvite ? 'Close' : 'Cancel'}
            </Button>
            {!lastInvite && (
              <Button
                onClick={handleInviteSubmit}
                disabled={inviting || !inviteEmail.trim()}
              >
                {inviting && <Loader2 className="size-4 animate-spin" />}
                {inviting ? 'Sending...' : 'Send Invite'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={roleChangeDialog.open}
        onOpenChange={(open) => {
          if (!open) setRoleChangeDialog({ open: false, email: null, role: null });
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Member Role?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to change the role of{' '}
            <strong>{roleChangeDialog.email}</strong> to{' '}
            {(() => {
              const rcfg = ROLE_CONFIG[roleChangeDialog.role];
              if (!rcfg) return null;
              const rbp = getRoleBadgeProps(rcfg.color);
              return (
                <Badge {...rbp} className={`${rbp.className || ''}`}>
                  {rcfg.label}
                </Badge>
              );
            })()}
            ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleChangeDialog({ open: false, email: null, role: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleRoleChangeConfirm} disabled={changingRole}>
              {changingRole && <Loader2 className="size-4 animate-spin" />}
              {changingRole ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <Dialog
        open={removeDialog.open}
        onOpenChange={(open) => {
          if (!open) setRemoveDialog({ open: false, email: null });
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Team Member?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <strong>{removeDialog.email}</strong> from your
            organization? They will lose access to all company resources.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialog({ open: false, email: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveConfirm}
              disabled={removing}
            >
              {removing && <Loader2 className="size-4 animate-spin" />}
              {removing ? 'Removing...' : 'Remove Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Invite Confirmation Dialog */}
      <Dialog
        open={revokeDialog.open}
        onOpenChange={(open) => {
          if (!open) setRevokeDialog({ open: false, code: null });
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Revoke Invite?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to revoke this invite? The code will no longer be valid.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialog({ open: false, code: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevokeConfirm}
              disabled={revoking}
            >
              {revoking && <Loader2 className="size-4 animate-spin" />}
              {revoking ? 'Revoking...' : 'Revoke Invite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
