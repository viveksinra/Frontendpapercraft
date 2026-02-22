'use client';

import { ProductCatalog } from '@/components/store/ProductCatalog';

// TODO: Get companyId from child's org membership
const COMPANY_ID = '';

export default function ParentStorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and purchase papers, tests, and bundles for your children.
        </p>
      </div>
      <ProductCatalog companyId={COMPANY_ID} basePath="/store" />
    </div>
  );
}
