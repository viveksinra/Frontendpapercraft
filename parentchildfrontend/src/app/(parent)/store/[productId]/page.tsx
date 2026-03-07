'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductDetailPage } from '@/components/store/ProductDetailPage';
import { ChildSelector } from '@/components/store/ChildSelector';

export default function ParentProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedChildName, setSelectedChildName] = useState('');
  const [companyId, setCompanyId] = useState('');

  return (
    <div className="space-y-4">
      <ChildSelector
        selectedChildId={selectedChildId}
        onSelect={(id, name, childCompanyId) => {
          setSelectedChildId(id);
          setSelectedChildName(name);
          setCompanyId(childCompanyId);
        }}
      />
      <ProductDetailPage
        companyId={companyId}
        productId={productId}
        studentUserId={selectedChildId || undefined}
        storePath="/store"
        successPath={`/checkout/success?child=${encodeURIComponent(selectedChildName)}`}
      />
    </div>
  );
}
