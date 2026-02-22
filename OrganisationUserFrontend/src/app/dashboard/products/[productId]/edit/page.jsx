'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getProduct } from 'src/lib/product-api';

import CreateProductForm from 'src/components/products/CreateProductForm';

// ─────────────────────────────────────────────────────────────────

export default function EditProductPage() {
  const { productId } = useParams();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!activeCompanyId || !productId) {
      setError('Missing company or product ID');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await getProduct(activeCompanyId, productId);
        if (!cancelled) setProduct(data?.product || data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeCompanyId, productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-screen-md mx-auto px-4 py-6">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      </div>
    );
  }

  return <CreateProductForm existingProduct={product} />;
}
