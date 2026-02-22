'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Plus } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { listProducts, publishProduct, unpublishProduct } from 'src/lib/product-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import ProductList from 'src/components/products/ProductList';

// ─────────────────────────────────────────────────────────────────

export default function ProductsListPage() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const loadProducts = useCallback(async () => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await listProducts(activeCompanyId, params);
      setProducts(data?.products || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, statusFilter, typeFilter, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handlePublish(productId) {
    try {
      await publishProduct(activeCompanyId, productId);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to publish product');
    }
  }

  async function handleUnpublish(productId) {
    try {
      await unpublishProduct(activeCompanyId, productId);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to unpublish product');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Products & Pricing</h1>
            <p className="text-sm text-muted-foreground">
              Manage your sellable content, pricing, and bundles.
            </p>
          </div>
          <Button onClick={() => router.push(paths.dashboard.products.create)}>
            <Plus className="mr-2 h-4 w-4" /> New Product
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Types</option>
            <option value="paper">Paper</option>
            <option value="paper_set">Paper Set</option>
            <option value="test">Test</option>
            <option value="bundle">Bundle</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Product List */}
        <ProductList
          products={products}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
        />
      </div>
    </div>
  );
}
