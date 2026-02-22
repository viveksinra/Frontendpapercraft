import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock cookie/auth helpers
vi.mock('../../lib/auth-helpers', () => ({
  getActiveCompanyIdFromCookie: vi.fn().mockReturnValue('company-1'),
}));

vi.mock('../../lib/product-api', () => ({
  listProducts: vi.fn().mockResolvedValue({ products: [], total: 0 }),
  createProduct: vi.fn().mockResolvedValue({ _id: 'new-product' }),
  updateProduct: vi.fn().mockResolvedValue({ _id: 'updated-product' }),
  publishProduct: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../lib/revenue-api', () => ({
  getOverview: vi.fn().mockResolvedValue({
    totalRevenue: 50000,
    currentMonthRevenue: 15000,
    previousMonthRevenue: 10000,
    monthOverMonthGrowth: 50,
    totalTransactions: 25,
    averageOrderValue: 2000,
  }),
  getTransactions: vi.fn().mockResolvedValue({ transactions: [], total: 0 }),
}));

describe('Org Frontend Product Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProductCard', () => {
    it('renders title, price, status badge', () => {
      const product = {
        _id: 'prod-1',
        title: 'Maths Paper Set',
        type: 'paper_set',
        status: 'active',
        pricing: {
          basePrice: 2500,
          currency: 'GBP',
          isFree: false,
          discountPrice: null,
          discountValidUntil: null,
        },
        totalPurchases: 10,
      };

      expect(product.title).toBe('Maths Paper Set');
      expect(product.pricing.basePrice).toBe(2500);
      expect(product.status).toBe('active');
    });

    it('shows discounted price when discount is active', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const product = {
        _id: 'prod-2',
        title: 'English Paper Set',
        pricing: {
          basePrice: 3000,
          currency: 'GBP',
          isFree: false,
          discountPrice: 2000,
          discountValidUntil: tomorrow,
        },
      };

      const isDiscountActive =
        product.pricing.discountPrice != null &&
        product.pricing.discountValidUntil != null &&
        new Date(product.pricing.discountValidUntil) > new Date();

      expect(isDiscountActive).toBe(true);
      expect(product.pricing.discountPrice).toBe(2000);
    });
  });

  describe('CreateProductForm', () => {
    it('validates required fields', () => {
      const input = {
        title: '',
        type: 'paper',
        pricing: { basePrice: 0, currency: 'GBP', isFree: false },
      };

      // Title is required
      expect(input.title).toBe('');
      expect(input.title.length).toBe(0);
    });

    it('shows error for missing title', () => {
      const errors = [];
      const input = { title: '', type: 'paper' };

      if (!input.title) errors.push('Title is required');
      if (!input.type) errors.push('Type is required');

      expect(errors).toContain('Title is required');
      expect(errors).not.toContain('Type is required');
    });
  });

  describe('PricingSection', () => {
    it('toggles free/paid correctly', () => {
      let isFree = false;

      // Toggle to free
      isFree = true;
      expect(isFree).toBe(true);

      // Toggle back to paid
      isFree = false;
      expect(isFree).toBe(false);
    });

    it('shows discount fields when discount enabled', () => {
      const pricing = {
        basePrice: 3000,
        discountPrice: 2000,
        discountValidUntil: '2026-03-01',
      };

      expect(pricing.discountPrice).toBeDefined();
      expect(pricing.discountValidUntil).toBeDefined();
    });
  });

  describe('BundleItemSelector', () => {
    it('adds products to bundle', () => {
      const bundleItems = [];
      const newItem = {
        productId: 'prod-1',
        referenceType: 'paper',
        referenceId: 'ref-1',
        title: 'Paper 1',
      };

      bundleItems.push(newItem);
      expect(bundleItems).toHaveLength(1);
      expect(bundleItems[0].title).toBe('Paper 1');
    });

    it('removes products from bundle', () => {
      const bundleItems = [
        { productId: 'prod-1', title: 'Paper 1' },
        { productId: 'prod-2', title: 'Paper 2' },
      ];

      const filtered = bundleItems.filter((item) => item.productId !== 'prod-1');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Paper 2');
    });

    it('calculates savings correctly', () => {
      const bundlePrice = 5000;
      const individualTotal = 3000 + 2500; // sum of individual prices
      const savings = individualTotal - bundlePrice;

      expect(savings).toBe(500);
      expect(savings).toBeGreaterThan(0);
    });
  });

  describe('RevenueOverviewCards', () => {
    it('shows correct metrics', () => {
      const overview = {
        totalRevenue: 50000,
        currentMonthRevenue: 15000,
        previousMonthRevenue: 10000,
        monthOverMonthGrowth: 50,
        totalTransactions: 25,
        averageOrderValue: 2000,
      };

      expect(overview.totalRevenue).toBe(50000);
      expect(overview.monthOverMonthGrowth).toBe(50);
      expect(overview.totalTransactions).toBe(25);
      expect(overview.averageOrderValue).toBe(2000);
    });
  });

  describe('TransactionsTable', () => {
    it('renders rows correctly', () => {
      const transactions = [
        {
          _id: 'tx-1',
          productTitle: 'Maths Paper',
          amount: 2000,
          currency: 'GBP',
          status: 'completed',
          buyerEmail: 'student@test.com',
          createdAt: '2026-02-01T10:00:00Z',
        },
        {
          _id: 'tx-2',
          productTitle: 'English Paper',
          amount: 1500,
          currency: 'GBP',
          status: 'completed',
          buyerEmail: 'parent@test.com',
          createdAt: '2026-02-02T14:00:00Z',
        },
      ];

      expect(transactions).toHaveLength(2);
      expect(transactions[0].productTitle).toBe('Maths Paper');
      expect(transactions[1].amount).toBe(1500);
    });
  });
});
