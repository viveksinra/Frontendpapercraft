'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShoppingBag } from 'lucide-react';

import { getCatalog } from '@/lib/store-api';
import { ProductCard } from './ProductCard';
import { CatalogFilters } from './CatalogFilters';

interface ProductCatalogProps {
  companyId: string;
  basePath: string;
}

export function ProductCatalog({ companyId, basePath }: ProductCatalogProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const params: any = { sort };
        if (search.trim()) params.search = search.trim();
        if (type) params.type = type;

        const data = await getCatalog(companyId, params);
        if (!cancelled) {
          setProducts(data?.products || data || []);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load catalog');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [companyId, search, type, sort]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CatalogFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        sort={sort}
        onSortChange={setSort}
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            No products available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              basePath={basePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
