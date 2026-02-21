'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { getCompanies, createCompany, selectActiveCompany, getActiveCompanyIdFromCookie } from 'src/lib/company-api';

const formatRoleLabel = (role) => {
  if (!role) return 'Teacher';
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
          console.error('[CompanyGuard] auto-select failed', err);
        }
      }

      if (!active) {
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
      console.error('[CompanyGuard] refreshState failed', e);
      toast.error('Failed to load companies. Please retry.');
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
    return () => { ignore = true; };
  }, [refreshState]);

  const blocked = useMemo(() => loading || requireSelection || requireCreate, [loading, requireSelection, requireCreate]);

  const handleCreate = async () => {
    if (!newCompany.trim()) return;
    try {
      setSubmitting(true);
      const created = await createCompany(newCompany.trim());
      const createdId = created?.id || created?._id;
      if (createdId) {
        await selectActiveCompany(createdId);
        await new Promise((r) => setTimeout(r, 50));
      }
      setNewCompany('');
      toast.success('Company created and selected.');
      await refreshState();
    } catch (e) {
      console.error('[CompanyGuard] create failed', e);
      toast.error('Failed to create company.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = async (companyId) => {
    try {
      setSubmitting(true);
      await selectActiveCompany(companyId);
      await new Promise((r) => setTimeout(r, 50));
      toast.success('Company selected.');
      await refreshState();
    } catch (e) {
      console.error('[CompanyGuard] select failed', e);
      toast.error('Failed to select company.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!blocked ? children : null}

      {/* Loading dialog */}
      <Dialog open={loading}>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Loading</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Checking your companies...</span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create first company dialog */}
      <Dialog open={requireCreate}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Create your first company</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              You need a company to use the dashboard. This sets your active workspace for all actions.
            </p>
            <Input
              autoFocus
              placeholder="e.g. Acme Tutoring"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You can invite teammates and manage roles after creation.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" disabled>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newCompany.trim() || submitting}>
              {submitting ? 'Creating...' : 'Create company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select company dialog */}
      <Dialog open={requireSelection}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Select a company</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="mb-3 text-sm text-muted-foreground">
              Choose your active company. All actions will be scoped to it.
            </p>
            <div className="space-y-1">
              {(companies || []).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  disabled={submitting}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent disabled:opacity-50"
                >
                  <img
                    src={c.logo || '/favicon.ico'}
                    alt={c.displayName || c.name}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.displayName || c.name}</p>
                    <p className="text-xs text-muted-foreground">Role: {formatRoleLabel(c.role)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRequireSelection(false); setRequireCreate(true); }} disabled={submitting}>
              Create new company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
