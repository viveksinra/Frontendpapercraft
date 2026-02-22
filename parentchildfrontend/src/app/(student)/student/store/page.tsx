'use client';

import { ProductCatalog } from '@/components/store/ProductCatalog';

// TODO: Get companyId from user's org membership
const COMPANY_ID = ''; // Will be populated from user context

export default function StudentStorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store</h1>
        <p className="mt-1 text-muted-foreground">
          Browse papers, tests, and bundles available from your institute.
        </p>
      </div>
      <ProductCatalog companyId={COMPANY_ID} basePath="/student/store" />
    </div>
  );
}
