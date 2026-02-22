'use client';

import { ShoppingBag } from 'lucide-react';

import ProductCard from './ProductCard';

// ─────────────────────────────────────────────────────────────────

export default function ProductList({ products, onPublish, onUnpublish }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No products found. Create your first product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
        />
      ))}
    </div>
  );
}
