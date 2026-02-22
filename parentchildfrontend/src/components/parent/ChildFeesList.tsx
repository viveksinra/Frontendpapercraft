'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getChildFees } from '@/lib/parent-api';

interface FeeItem {
  _id: string;
  className: string;
  amount: number;
  currency: string;
  amountPaid: number;
  status: string;
  dueDate: string | null;
}

function formatCurrency(amount: number, currency: string = 'GBP') {
  const locale = currency === 'GBP' ? 'en-GB' : 'en-IN';
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    case 'partial': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
    case 'unpaid': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
}

export function ChildFeesList({ childId }: { childId: string }) {
  const router = useRouter();
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChildFees(childId);
        setFees(data?.fees || data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load fees');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fees</h1>
          <p className="text-sm text-muted-foreground">View your child&apos;s fee records</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : fees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Fee Records</h3>
            <p className="mt-1 text-sm text-muted-foreground">No fee records found for this child.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {fees.map((fee) => {
            const outstanding = Math.max(0, fee.amount - fee.amountPaid);
            return (
              <Card key={fee._id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">{fee.className || 'Class Fee'}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>Total: {formatCurrency(fee.amount, fee.currency)}</span>
                        <span>Paid: {formatCurrency(fee.amountPaid, fee.currency)}</span>
                        {outstanding > 0 && (
                          <span className="font-medium text-red-600 dark:text-red-400">
                            Due: {formatCurrency(outstanding, fee.currency)}
                          </span>
                        )}
                        {fee.dueDate && (
                          <span>Due by {new Date(fee.dueDate).toLocaleDateString('en-GB')}</span>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadge(fee.status)}`}>
                      {fee.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
