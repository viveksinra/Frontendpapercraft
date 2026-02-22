'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getFailedPayments, type FailedPayment } from '@/lib/admin-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatCurrency(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function FailedPaymentsMonitor() {
  const [payments, setPayments] = useState<FailedPayment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data: any = await getFailedPayments({ page, limit });
      const result = data.payments || data.data?.payments || [];
      setPayments(result);
      setTotal(data.total || data.data?.total || 0);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load failed payments.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle>Failed Payments</CardTitle>
              <CardDescription>
                Recent payment failures across the platform ({total} total)
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadPayments} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && payments.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No failed payments found. All payments are healthy.
          </p>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-sm">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">{payment.orgName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {payment.customerEmail}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="text-xs font-normal">
                          {payment.errorMessage}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
