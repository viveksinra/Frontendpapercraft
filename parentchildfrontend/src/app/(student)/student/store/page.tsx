'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProductCatalog } from '@/components/store/ProductCatalog';

export default function StudentStorePage() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store</h1>
        <p className="mt-1 text-muted-foreground">
          Browse papers, tests, and bundles available from your institute.
        </p>
      </div>
      <ProductCatalog companyId={companyId} basePath="/student/store" />
    </div>
  );
}
