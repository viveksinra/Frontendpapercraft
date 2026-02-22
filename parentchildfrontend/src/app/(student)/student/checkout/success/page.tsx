'use client';

import { useSearchParams } from 'next/navigation';
import { CheckoutSuccessPage } from '@/components/store/CheckoutSuccessPage';

export default function StudentCheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';

  return (
    <CheckoutSuccessPage
      sessionId={sessionId}
      storePath="/student/store"
    />
  );
}
