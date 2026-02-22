'use client';

import { PurchaseHistory } from '@/components/purchases/PurchaseHistory';

export default function StudentPurchasesPage() {
  return <PurchaseHistory storePath="/student/store" />;
}
