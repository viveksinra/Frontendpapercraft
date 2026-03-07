'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Receipt } from 'lucide-react';

import { listClasses } from 'src/lib/class-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { listFees, updateFee, sendFeeReminder } from 'src/lib/fee-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

// ----------------------------------------------------------------------

const FEE_STATUS_VARIANT = {
  unpaid: 'destructive',
  partial: 'secondary',
  paid: 'default',
};

function formatCurrency(amount, currency = 'GBP') {
  const locale = currency === 'GBP' ? 'en-GB' : 'en-IN';
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}

export default function FeesPage() {
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Update dialog
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatingFee, setUpdatingFee] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [saving, setSaving] = useState(false);

  // Load classes
  useEffect(() => {
    if (!activeCompanyId) return undefined;
    let cancelled = false;
    async function load() {
      try {
        const data = await listClasses(activeCompanyId, { status: 'active' });
        if (!cancelled) {
          const raw = data?.classes || data?.data || data;
          const list = Array.isArray(raw) ? raw : [];
          setClasses(list);
          if (list.length > 0) setSelectedClassId(list[0]._id || list[0].id);
        }
      } catch (_) { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [activeCompanyId]);

  // Load fees for selected class
  useEffect(() => {
    if (!activeCompanyId || !selectedClassId) return undefined;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await listFees(activeCompanyId, { classId: selectedClassId });
        if (!cancelled) {
          setFees(data?.fees || data?.records || []);
          setSummary(data?.summary || null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load fees');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeCompanyId, selectedClassId]);

  function openUpdate(fee) {
    setUpdatingFee(fee);
    setAmountPaid(String(fee.amountPaid ?? 0));
    setUpdateOpen(true);
  }

  async function handleUpdate() {
    if (!updatingFee) return;
    try {
      setSaving(true);
      await updateFee(activeCompanyId, updatingFee.studentUserId, {
        classId: selectedClassId,
        amountPaid: Number(amountPaid),
      });
      setUpdateOpen(false);
      // Reload
      const data = await listFees(activeCompanyId, { classId: selectedClassId });
      setFees(data?.fees || data?.records || []);
      setSummary(data?.summary || null);
    } catch (err) {
      setError(err.message || 'Failed to update fee');
    } finally {
      setSaving(false);
    }
  }

  async function handleSendReminder() {
    if (!selectedClassId) return;
    try {
      await sendFeeReminder(activeCompanyId, { classId: selectedClassId });
      alert('Fee reminders sent!');
    } catch (err) {
      setError(err.message || 'Failed to send reminders');
    }
  }

  const filtered = fees.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (f.studentName || '').toLowerCase().includes(q);
  });

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Fee Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage student fee payments by class.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Class selector */}
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-1.5 flex-1 max-w-xs">
            <Label>Class</Label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {classes.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={handleSendReminder} disabled={!selectedClassId}>
            Send Reminders
          </Button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border p-3 text-center">
              <div className="text-xl font-bold tabular-nums text-green-600">{summary.paidCount}</div>
              <div className="text-xs text-muted-foreground">Paid</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-xl font-bold tabular-nums text-yellow-600">{summary.partialCount}</div>
              <div className="text-xs text-muted-foreground">Partial</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-xl font-bold tabular-nums text-red-600">{summary.unpaidCount}</div>
              <div className="text-xs text-muted-foreground">Unpaid</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-xl font-bold tabular-nums">{formatCurrency(summary.totalOutstanding ?? 0, summary.currency)}</div>
              <div className="text-xs text-muted-foreground">Outstanding</div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Receipt className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {fees.length === 0 ? 'No fee records found for this class.' : 'No results match your search.'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((fee) => {
                  const id = fee._id || fee.id;
                  const outstanding = Math.max(0, (fee.amount || 0) - (fee.amountPaid || 0));
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{fee.studentName || fee.studentUserId}</TableCell>
                      <TableCell className="tabular-nums">{formatCurrency(fee.amount, fee.currency)}</TableCell>
                      <TableCell className="tabular-nums">{formatCurrency(fee.amountPaid, fee.currency)}</TableCell>
                      <TableCell className="tabular-nums">{formatCurrency(outstanding, fee.currency)}</TableCell>
                      <TableCell>
                        <Badge variant={FEE_STATUS_VARIANT[fee.status] || 'outline'}>
                          {fee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-GB') : '\u2014'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openUpdate(fee)}>
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Update dialog */}
        <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Payment</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="text-sm text-muted-foreground">
                Total fee: {updatingFee ? formatCurrency(updatingFee.amount, updatingFee.currency) : ''}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Amount Paid</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  max={updatingFee?.amount}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
