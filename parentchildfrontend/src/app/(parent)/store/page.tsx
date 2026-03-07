'use client';

import { useState } from 'react';
import { ProductCatalog } from '@/components/store/ProductCatalog';
import { ChildSelector } from '@/components/store/ChildSelector';

export default function ParentStorePage() {
  const [selectedChildId, setSelectedChildId] = useState('');
  const [companyId, setCompanyId] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and purchase papers, tests, and bundles for your children.
        </p>
      </div>
      <ChildSelector
        selectedChildId={selectedChildId}
        onSelect={(id, _name, childCompanyId) => {
          setSelectedChildId(id);
          setCompanyId(childCompanyId);
        }}
      />
      <ProductCatalog companyId={companyId} basePath="/store" />
    </div>
  );
}
