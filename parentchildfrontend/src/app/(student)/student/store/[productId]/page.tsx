'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProductDetailPage } from '@/components/store/ProductDetailPage';

export default function StudentProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const companyId = user?.companyId || '';

  return (
    <ProductDetailPage
      companyId={companyId}
      productId={productId}
      storePath="/student/store"
      successPath="/student/checkout/success"
    />
  );
}
