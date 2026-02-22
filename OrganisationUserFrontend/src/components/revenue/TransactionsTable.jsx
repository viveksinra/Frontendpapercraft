'use client';

import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

// ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

const STATUS_VARIANT = {
  completed: 'default',
  pending: 'secondary',
  failed: 'destructive',
  refunded: 'outline',
  expired: 'outline',
};

export default function TransactionsTable({
  transactions = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  currency = 'GBP',
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Recent Transactions</h3>
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">Recent Transactions</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Buyer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, i) => (
              <TableRow key={tx._id || tx.id || i}>
                <TableCell className="font-medium">{tx.buyerName || 'Unknown'}</TableCell>
                <TableCell>{tx.productTitle || tx.productId}</TableCell>
                <TableCell>{formatPrice(tx.amount, currency)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(tx.createdAt || tx.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[tx.status] || 'outline'}>
                    {tx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
