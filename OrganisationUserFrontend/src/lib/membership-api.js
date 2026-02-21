import axios from 'src/lib/axios';
import { backendUrl } from 'src/lib/v2-endpoints';

function getTenantId() {
  if (typeof window === 'undefined') return 'devTenant';
  const host = window.location?.host || '';
  return host.includes('localhost') ? 'devTenant' : host.split(':')[0];
}

function membershipsBase(companyId) {
  return backendUrl(`/api/v2/companies/${companyId}/memberships`);
}

function invitesBase() {
  return backendUrl('/api/v2/invites');
}

export async function getMembers(companyId) {
  const url = membershipsBase(companyId);
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  // Transform API response to match frontend expected fields
  const members = res.data?.myData?.members || res.data?.members || [];
  return members.map((member) => ({
    ...member,
    userEmail: member.email || member.userEmail,
    displayName: member.displayName || '',
    firstName: member.firstName || '',
    lastName: member.lastName || '',
    photoURL: member.photoURL || '',
    joinedAt: member.createdAt || member.joinedAt,
  }));
}

/**
 * Create an invite for a user to join the company
 * @param {string} companyId - The company ID
 * @param {string} email - The email of the person to invite
 * @param {string} role - The role to assign (admin, manager, editor, viewer)
 * @returns {Promise<object>} The created invite
 */
export async function inviteMember(companyId, email, role) {
  const url = `${membershipsBase(companyId)}/invite`;
  const res = await axios.post(
    url,
    { email, role },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
      withCredentials: true,
    }
  );
  // Extract invite from response
  const invite = res.data?.myData?.invite || res.data?.invite || res.data;
  return invite;
}

/**
 * Get invite details by code (public)
 * @param {string} inviteCode - The invite code
 * @returns {Promise<object>} The invite details including company info
 */
export async function getInviteDetails(inviteCode) {
  const url = `${invitesBase()}/${inviteCode}`;
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
    },
    withCredentials: true,
  });
  return res.data?.myData || res.data;
}

/**
 * Accept an invite to join a company
 * @param {string} inviteCode - The invite code
 * @returns {Promise<object>} The created membership
 */
export async function acceptInvite(inviteCode) {
  const url = `${invitesBase()}/${inviteCode}/accept`;
  const res = await axios.post(
    url,
    {},
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
      },
      withCredentials: true,
    }
  );
  return res.data?.myData || res.data;
}

/**
 * Get all pending invites for a company
 * @param {string} companyId - The company ID
 * @returns {Promise<Array>} List of invites
 */
export async function getInvites(companyId) {
  const url = `${membershipsBase(companyId)}/invites`;
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
    withCredentials: true,
  });
  const invites = res.data?.myData?.invites || res.data?.invites || [];
  return invites;
}

export async function updateMemberRole(companyId, userEmail, role) {
  const url = membershipsBase(companyId);
  const res = await axios.patch(
    `${url}/${encodeURIComponent(userEmail)}`,
    { role },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
      withCredentials: true,
    }
  );
  return res.data;
}

export async function removeMember(companyId, userEmail) {
  const url = membershipsBase(companyId);
  const res = await axios.delete(`${url}/${encodeURIComponent(userEmail)}`, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
    withCredentials: true,
  });
  return res.data;
}

/**
 * Revoke a pending invite
 * @param {string} companyId - The company ID
 * @param {string} inviteCode - The invite code to revoke
 * @returns {Promise<object>} The result
 */
export async function revokeInvite(companyId, inviteCode) {
  const url = `${membershipsBase(companyId)}/invite/${inviteCode}`;
  const res = await axios.delete(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
    withCredentials: true,
  });
  return res.data;
}
