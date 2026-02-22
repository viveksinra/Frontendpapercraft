'use client';

import { useParams } from 'next/navigation';
import { ProductDetailPage } from '@/components/store/ProductDetailPage';

// TODO: Get companyId from user's org membership
const COMPANY_ID = '';

export default function StudentProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  return (
    <ProductDetailPage
      companyId={COMPANY_ID}
      productId={productId}
      storePath="/student/store"
      successPath="/student/checkout/success"
    />
  );
}
