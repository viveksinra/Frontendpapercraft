'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CheckoutCancelPageProps {
  storePath: string;
}

export function CheckoutCancelPage({ storePath }: CheckoutCancelPageProps) {
  return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
          <XCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold">Payment Cancelled</h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. No charges were made to your account.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link href={storePath}>Back to Store</Link>
        </Button>
      </div>
    </div>
  );
}
