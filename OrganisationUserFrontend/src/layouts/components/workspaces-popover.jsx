'use client';

import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  getCompanies,
  createCompany,
  selectActiveCompany,
  getActiveCompanyIdFromCookie,
} from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scrollbar } from 'src/components/scrollbar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';

export function WorkspacesPopover({ data = [], className }) {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState(Array.isArray(data) && data.length ? data : []);
  const [workspace, setWorkspace] = useState(Array.isArray(data) && data.length ? data[0] : null);
  const [loading, setLoading] = useState(!Array.isArray(data) || data.length === 0);
  const [createOpen, setCreateOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyUsername, setNewCompanyUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const { companies: list = [], activeCompanyId, lastActiveCompanyId } = await getCompanies();
        if (ignore) return;
        const normalized = list.map((c, idx) => ({
          id: c.id || c._id || String(idx),
          name: c.name,
          displayName: c.displayName || c.name,
          plan: c.plan || 'Standard',
          logo: c.logo || '/favicon.ico',
          role: c.role || 'teacher',
        }));
        setCompanies(normalized);
        const active =
          getActiveCompanyIdFromCookie() ||
          activeCompanyId ||
          lastActiveCompanyId ||
          (normalized[0]?.id ?? null);
        const current = normalized.find((c) => c.id === active) || normalized[0] || null;
        setWorkspace(current || null);
      } catch (e) {
        console.error('[WorkspacesPopover] failed to load companies', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (!data || data.length === 0) {
      load();
    } else {
      setCompanies(data);
      setWorkspace(data[0] || null);
    }
    return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Array.isArray(data) ? data.length : data]);

  const handleChangeWorkspace = useCallback(
    async (newValue) => {
      try {
        await selectActiveCompany(newValue.id);
        setWorkspace(newValue);
      } catch (e) {
        console.error('[WorkspacesPopover] select company failed', e);
      } finally {
        setOpen(false);
      }
    },
    []
  );

  const validateUsername = useCallback((value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 30) return 'Username must be 30 characters or less';
    if (!/^[a-z0-9_-]+$/.test(value)) return 'Only lowercase letters, numbers, underscores, and hyphens';
    return '';
  }, []);

  const handleUsernameChange = useCallback(
    (e) => {
      const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      setNewCompanyUsername(value);
      setUsernameError(validateUsername(value));
    },
    [validateUsername]
  );

  const handleCreateCompany = useCallback(async () => {
    if (!newCompanyName.trim()) return;
    const usernameErr = validateUsername(newCompanyUsername);
    if (usernameErr) {
      setUsernameError(usernameErr);
      return;
    }
    try {
      const created = await createCompany(newCompanyName.trim(), newCompanyUsername.trim());
      const normalized = {
        id: created?.id || created?._id,
        name: created?.name || newCompanyName.trim(),
        plan: 'Free',
        logo: '/favicon.ico',
      };
      if (normalized.id) {
        await selectActiveCompany(normalized.id);
        await new Promise((r) => setTimeout(r, 50));
      }
      setCompanies((prev) => [normalized, ...prev]);
      setWorkspace(normalized);
      setCreateOpen(false);
      setNewCompanyName('');
      setNewCompanyUsername('');
      setUsernameError('');
      toast.success('Company created and selected.');
    } catch (e) {
      console.error('[WorkspacesPopover] create company failed', e);
      const errorMsg = e.response?.data?.message || 'Failed to create company.';
      toast.error(errorMsg);
    }
  }, [newCompanyName, newCompanyUsername, validateUsername]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent',
              className
            )}
          >
            {workspace ? (
              <img
                src={workspace.logo}
                alt={workspace.displayName || workspace.name}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="h-7 w-7 shrink-0 rounded-full bg-muted" />
            )}

            <span className="hidden max-w-[140px] truncate font-medium sm:inline">
              {workspace?.displayName || workspace?.name || (loading ? 'Loading...' : 'Select company')}
            </span>

            {workspace?.role && (
              <Badge variant="outline" className="hidden capitalize sm:inline-flex">
                {workspace.role.replace('_', ' ')}
              </Badge>
            )}

            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-60 p-0" align="start">
          <Scrollbar className="max-h-60">
            <div className="p-1">
              {(companies || []).map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChangeWorkspace(option)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent',
                    option.id === workspace?.id && 'bg-accent'
                  )}
                >
                  <img
                    src={option.logo}
                    alt={option.name}
                    className="h-6 w-6 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate font-medium">{option.displayName || option.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {option.role?.replace('_', ' ') || 'teacher'}
                    </p>
                  </div>
                  {option.id === workspace?.id && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              ))}
            </div>
          </Scrollbar>

          <div className="border-t p-1">
            <button
              onClick={() => {
                setOpen(false);
                setCreateOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Create workspace
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Company name</label>
              <Input
                autoFocus
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="My Company"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Username</label>
              <Input
                value={newCompanyUsername}
                onChange={handleUsernameChange}
                placeholder="my-company"
                maxLength={30}
                className={usernameError ? 'border-destructive' : ''}
              />
              <p className={cn('mt-1 text-xs', usernameError ? 'text-destructive' : 'text-muted-foreground')}>
                {usernameError || 'Unique identifier (3-30 chars).'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setNewCompanyName('');
                setNewCompanyUsername('');
                setUsernameError('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCompany}
              disabled={!newCompanyName.trim() || !newCompanyUsername.trim() || !!usernameError}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
