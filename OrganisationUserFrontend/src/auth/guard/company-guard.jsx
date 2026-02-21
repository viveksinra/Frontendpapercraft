'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { getCompanies, createCompany, selectActiveCompany, getActiveCompanyIdFromCookie } from 'src/lib/company-api';

const formatRoleLabel = (role) => {
  if (!role) return 'Viewer';
  return role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export function CompanyGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [requireSelection, setRequireSelection] = useState(false);
  const [requireCreate, setRequireCreate] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const autoSelectAttempted = useRef(false);

  const refreshState = useCallback(async () => {
    setLoading(true);
    try {
      const { companies: list = [], lastActiveCompanyId, activeCompanyId } = await getCompanies();
      setCompanies(list);
      const active = getActiveCompanyIdFromCookie();

      if (list.length === 0) {
        setRequireCreate(true);
        setRequireSelection(false);
        return false;
      }

      const fallbackCompanyId =
        active ||
        activeCompanyId ||
        lastActiveCompanyId ||
        (list.length ? list[0].id : null);

      if (!active && fallbackCompanyId && !autoSelectAttempted.current) {
        autoSelectAttempted.current = true;
        try {
          await selectActiveCompany(fallbackCompanyId);
          await new Promise((r) => setTimeout(r, 75));
          return refreshState();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[CompanyGuard] auto-select failed', err);
        }
      }

      if (!active) {
        // eslint-disable-next-line no-console
        console.warn('[CompanyGuard] No active company detected; gating dashboard until one is selected.');
        setRequireSelection(true);
        setRequireCreate(false);
        return false;
      }

      autoSelectAttempted.current = false;
      setRequireCreate(false);
      setRequireSelection(false);
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[CompanyGuard] refreshState failed', e);
      setSnackbar({ open: true, severity: 'error', message: 'Failed to load companies. Please retry.' });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function check() {
      const done = await refreshState();
      if (ignore) return;
      if (!done) {
        // stay blocked
      }
    }
    check();
    return () => {
      ignore = true;
    };
  }, [refreshState]);

  useEffect(() => {
    if (requireSelection) {
      // eslint-disable-next-line no-console
      console.warn('[CompanyGuard] Waiting on user to select a company before continuing.');
    }
  }, [requireSelection]);

  const blocked = useMemo(() => loading || requireSelection || requireCreate, [loading, requireSelection, requireCreate]);

  const handleCreate = async () => {
    if (!newCompany.trim()) return;
    try {
      setSubmitting(true);
      const created = await createCompany(newCompany.trim());
      const createdId = created?.id || created?._id;
      // Defensive: ensure server-side selection cookie and FE header
      if (createdId) {
        await selectActiveCompany(createdId);
        // small delay to allow cookie propagation
        await new Promise((r) => setTimeout(r, 50));
      }
      setNewCompany('');
      setSnackbar({ open: true, severity: 'success', message: 'Company created and selected.' });
      // Recompute state; remain blocked until active present
      await refreshState();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[CompanyGuard] create failed', e);
      setSnackbar({ open: true, severity: 'error', message: 'Failed to create company.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = async (companyId) => {
    try {
      setSubmitting(true);
      await selectActiveCompany(companyId);
      await new Promise((r) => setTimeout(r, 50));
      setSnackbar({ open: true, severity: 'success', message: 'Company selected.' });
      await refreshState();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[CompanyGuard] select failed', e);
      setSnackbar({ open: true, severity: 'error', message: 'Failed to select company.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!blocked ? children : null}
      <Dialog open={loading} hideBackdrop fullWidth maxWidth="xs">
        <DialogTitle>Loading</DialogTitle>
        <DialogContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
          <CircularProgress size={20} />
          Checking your companies…
        </DialogContent>
      </Dialog>
      <Dialog open={requireCreate} disableEscapeKeyDown fullWidth maxWidth="xs">
        <DialogTitle>Create your first company</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You need a company to use the dashboard. This sets your active workspace for all actions and API calls.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              label="Company name"
              placeholder="e.g. Acme Marketing"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
            />
            <Typography variant="caption" color="text.secondary">
              You can invite teammates and manage roles after creation. We’ll automatically set this as your active company.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!newCompany.trim() || submitting}>
            {submitting ? 'Creating…' : 'Create company'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={requireSelection} disableEscapeKeyDown fullWidth maxWidth="xs">
        <DialogTitle>Select a company</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Choose your active company. All content, settings, analytics, and publishing actions will be scoped to it.
          </Typography>
          <List sx={{ py: 0 }}>
            {(companies || []).map((c) => (
              <ListItem key={c.id} button onClick={() => handleSelect(c.id)} disabled={submitting}>
                <ListItemAvatar>
                  <Avatar src={c.logo} alt={c.displayName || c.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={c.displayName || c.name}
                  secondary={`Role: ${formatRoleLabel(c.role)}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequireCreate(true)} disabled={submitting}>
            Create new company
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}


