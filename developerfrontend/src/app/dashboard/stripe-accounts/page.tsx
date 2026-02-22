'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getConnectedAccounts, type ConnectedAccount } from '@/lib/admin-api';
import { ConnectedAccountsList } from '@/components/stripe/ConnectedAccountsList';
import { AccountStatusMonitor } from '@/components/stripe/AccountStatusMonitor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function StripeAccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const result: any = await getConnectedAccounts(params);
      const data = result.data || result;
      setAccounts(data.accounts || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      if (err?.status === 404) {
        setAccounts([]);
        setTotal(0);
      } else {
        toast.error(err?.message || 'Failed to load Stripe accounts.');
        setAccounts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAccounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stripe Accounts</h2>
          <p className="text-muted-foreground">
            Monitor connected Stripe accounts and onboarding status across all institutes.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAccounts} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-end gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-end gap-2">
          <Input
            placeholder="Search by org name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="outline" size="sm" disabled={loading}>
            Search
          </Button>
        </form>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="restricted">Restricted</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && accounts.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-muted-foreground">Loading accounts...</span>
        </div>
      )}

      {!loading && accounts.length === 0 && (
        <div className="rounded-md border p-10 text-center text-muted-foreground">
          No Stripe accounts found. Institutes will appear here after connecting their Stripe accounts.
        </div>
      )}

      {accounts.length > 0 && (
        <>
          <AccountStatusMonitor accounts={accounts} />
          <ConnectedAccountsList accounts={accounts} total={total} />
        </>
      )}
    </div>
  );
}
