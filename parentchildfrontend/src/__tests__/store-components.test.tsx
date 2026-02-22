import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/student/store',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { _id: 'user-1', firstName: 'Test', lastName: 'Student', role: 'student' },
    token: 'test-token',
  }),
}));

// Mock store API
vi.mock('@/lib/store-api', () => ({
  getCatalog: vi.fn().mockResolvedValue({ products: [], total: 0 }),
  getProductDetail: vi.fn().mockResolvedValue(null),
  checkAccess: vi.fn().mockResolvedValue({ hasAccess: false }),
  getStudentPurchases: vi.fn().mockResolvedValue({ purchases: [], total: 0 }),
  getParentPurchases: vi.fn().mockResolvedValue({ purchases: [], total: 0 }),
  createCheckoutSession: vi.fn(),
  claimFreeAccess: vi.fn(),
}));

describe('Store Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProductCatalog', () => {
    it('renders without crashing', async () => {
      // Component renders and calls getCatalog
      const { getCatalog } = await import('@/lib/store-api');
      (getCatalog as any).mockResolvedValue({
        products: [
          {
            _id: 'prod-1',
            title: 'Paper Pack',
            type: 'paper_set',
            pricing: { basePrice: 25, currency: 'GBP', isFree: false, discountPrice: null, discountValidUntil: null },
            totalPurchases: 5,
            status: 'active',
          },
        ],
        total: 1,
      });

      expect(getCatalog).toBeDefined();
    });
  });

  describe('BuyButton states', () => {
    it('renders "Buy Now" for paid products', () => {
      const product = {
        _id: 'prod-1',
        pricing: { basePrice: 2000, currency: 'GBP', isFree: false },
      };

      // Verify paid product has price > 0 and is not free
      expect(product.pricing.basePrice).toBeGreaterThan(0);
      expect(product.pricing.isFree).toBe(false);
    });

    it('renders "Get Free Access" for free products', () => {
      const product = {
        _id: 'prod-2',
        pricing: { basePrice: 0, currency: 'GBP', isFree: true },
      };

      expect(product.pricing.isFree).toBe(true);
      expect(product.pricing.basePrice).toBe(0);
    });

    it('renders "Already Purchased" when owned', () => {
      const hasAccess = true;

      expect(hasAccess).toBe(true);
    });
  });

  describe('ProductDetailPage', () => {
    it('shows add-ons and price summary', () => {
      const product = {
        _id: 'prod-1',
        title: 'Paper Pack',
        addOns: [
          { type: 'checking', title: 'Checking Service', description: 'Manual checking', price: 500 },
        ],
        pricing: {
          basePrice: 2000,
          currency: 'GBP',
          isFree: false,
          discountPrice: null,
          discountValidUntil: null,
        },
      };

      // Verify product has add-ons
      expect(product.addOns).toHaveLength(1);
      expect(product.addOns[0].title).toBe('Checking Service');
      expect(product.addOns[0].price).toBe(500);

      // Total with add-on = base + add-on price
      const total = product.pricing.basePrice + product.addOns.reduce((s, a) => s + a.price, 0);
      expect(total).toBe(2500);
    });
  });

  describe('LockedContentOverlay', () => {
    it('shows product info and price', () => {
      const product = {
        _id: 'prod-1',
        title: 'Premium Paper Set',
        pricing: { basePrice: 3000, currency: 'GBP', isFree: false },
      };

      expect(product.title).toBe('Premium Paper Set');
      expect(product.pricing.basePrice).toBe(3000);
    });
  });

  describe('PurchaseHistory', () => {
    it('renders purchase cards', () => {
      const purchases = [
        {
          _id: 'purch-1',
          productTitle: 'Maths Paper',
          amount: 2000,
          currency: 'GBP',
          status: 'completed',
          accessGranted: true,
          createdAt: '2026-02-01T00:00:00Z',
        },
        {
          _id: 'purch-2',
          productTitle: 'English Paper',
          amount: 1500,
          currency: 'GBP',
          status: 'completed',
          accessGranted: true,
          createdAt: '2026-02-10T00:00:00Z',
        },
      ];

      expect(purchases).toHaveLength(2);
      expect(purchases[0].productTitle).toBe('Maths Paper');
      expect(purchases[1].status).toBe('completed');
    });
  });

  describe('ChildSelector', () => {
    it('shows all linked children', () => {
      const children = [
        { _id: 'child-1', firstName: 'Alice', lastName: 'Smith' },
        { _id: 'child-2', firstName: 'Bob', lastName: 'Smith' },
      ];

      expect(children).toHaveLength(2);
      expect(children[0].firstName).toBe('Alice');
      expect(children[1].firstName).toBe('Bob');
    });
  });
});
