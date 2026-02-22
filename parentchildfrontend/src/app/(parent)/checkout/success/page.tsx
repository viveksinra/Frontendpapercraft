'use client';

import { useSearchParams } from 'next/navigation';
import { CheckoutSuccessPage } from '@/components/store/CheckoutSuccessPage';

export default function ParentCheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const childName = searchParams.get('child') || undefined;

  return (
    <CheckoutSuccessPage
      sessionId={sessionId}
      storePath="/store"
      childName={childName}
    />
  );
}
