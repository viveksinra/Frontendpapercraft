'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductDetailPage } from '@/components/store/ProductDetailPage';
import { ChildSelector } from '@/components/store/ChildSelector';

// TODO: Get companyId from child's org membership
const COMPANY_ID = '';

export default function ParentProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedChildName, setSelectedChildName] = useState('');

  return (
    <div className="space-y-4">
      <ChildSelector
        selectedChildId={selectedChildId}
        onSelect={(id, name) => {
          setSelectedChildId(id);
          setSelectedChildName(name);
        }}
      />
      <ProductDetailPage
        companyId={COMPANY_ID}
        productId={productId}
        studentUserId={selectedChildId || undefined}
        storePath="/store"
        successPath={`/checkout/success?child=${encodeURIComponent(selectedChildName)}`}
      />
    </div>
  );
}
