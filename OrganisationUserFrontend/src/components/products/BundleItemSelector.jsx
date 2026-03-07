'use client';

import { useState, useEffect } from 'react';
import { X, Search, Package } from 'lucide-react';

import { listProducts } from 'src/lib/product-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export default function BundleItemSelector({ items = [], bundlePrice = 0, currency = 'GBP', onChange }) {
  const activeCompanyId = getActiveCompanyIdFromCookie();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim() || !activeCompanyId) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const debounce = setTimeout(async () => {
      try {
        setSearching(true);
        const data = await listProducts(activeCompanyId, { search: query.trim(), status: 'active' });
        const allProducts = data?.products || data || [];
        // Exclude bundles and already-selected items
        const selectedIds = new Set(items.map((i) => i.productId));
        const filtered = allProducts.filter(
          (p) => p.type !== 'bundle' && !selectedIds.has(p._id || p.id)
        );
        if (!cancelled) setResults(filtered);
      } catch (_) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [query, activeCompanyId, items]);

  function addItem(product) {
    const id = product._id || product.id;
    const price = product.pricing?.isFree ? 0 : product.pricing?.basePrice || 0;
    onChange([...items, { productId: id, title: product.title, price }]);
    setQuery('');
    setResults([]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  const individualTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const savings = individualTotal > 0 && bundlePrice > 0
    ? Math.round(((individualTotal - bundlePrice) / individualTotal) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <h4 className="text-sm font-medium">Bundle Items</h4>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search products to add..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div className="rounded-md border max-h-40 overflow-y-auto">
          {results.map((product) => {
            const id = product._id || product.id;
            const price = product.pricing?.isFree ? 0 : product.pricing?.basePrice || 0;
            return (
              <button
                key={id}
                type="button"
                onClick={() => addItem(product)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-left hover:bg-muted transition-colors border-b last:border-b-0"
              >
                <span className="truncate">{product.title}</span>
                <span className="text-muted-foreground ml-2 whitespace-nowrap">
                  {price === 0 ? 'FREE' : formatPrice(price, currency)}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {searching && <p className="text-xs text-muted-foreground">Searching...</p>}

      {/* Selected items */}
      {items.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium">Included ({items.length} items)</p>
          {items.map((item, index) => (
            <div
              key={item.productId}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {item.price === 0 ? 'FREE' : formatPrice(item.price, currency)}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}

          {/* Savings summary */}
          <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm mt-1">
            <span className="text-muted-foreground">Individual total:</span>
            <span>{formatPrice(individualTotal, currency)}</span>
          </div>
          {bundlePrice > 0 && savings > 0 && (
            <div className="flex items-center justify-between rounded-md bg-green-50 dark:bg-green-950 px-3 py-2 text-sm">
              <span className="text-green-700 dark:text-green-300">Bundle savings:</span>
              <Badge variant="secondary" className="text-green-700 dark:text-green-300">
                {savings}% off
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Search and add at least 2 products to create a bundle.
        </p>
      )}

      {items.length > 0 && items.length < 2 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Bundle requires at least 2 items.
        </p>
      )}
    </div>
  );
}
