'use client';

import { useState, useEffect } from 'react';
import { Loader2, Receipt } from 'lucide-react';

import { getParentPurchases } from '@/lib/store-api';
import { PurchaseCard } from './PurchaseCard';

interface ParentPurchaseHistoryProps {
  storePath: string;
}

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export function ParentPurchaseHistory({ storePath }: ParentPurchaseHistoryProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getParentPurchases();
        if (!cancelled) setPurchases(data?.purchases || data || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load purchases');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        {error}
      </div>
    );
  }

  // Group by child
  const byChild = new Map<string, any[]>();
  for (const p of purchases) {
    const childName = p.childName || 'Unknown';
    if (!byChild.has(childName)) byChild.set(childName, []);
    byChild.get(childName)!.push(p);
  }

  const totalSpent = purchases
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Purchase History</h1>
        <p className="mt-1 text-muted-foreground">
          View purchases made for your children.
          {totalSpent > 0 && (
            <span className="font-medium text-foreground ml-2">
              Total spent: {formatPrice(totalSpent)}
            </span>
          )}
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Receipt className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No purchases yet.</p>
        </div>
      ) : (
        Array.from(byChild.entries()).map(([childName, childPurchases]) => (
          <div key={childName} className="space-y-3">
            <h2 className="text-lg font-semibold">{childName}</h2>
            {childPurchases.map((purchase) => (
              <PurchaseCard
                key={purchase._id || purchase.id}
                purchase={purchase}
                storePath={storePath}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
