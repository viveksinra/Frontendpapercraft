import { describe, it, expect } from 'vitest';
import {
  getEffectivePrice,
  formatPrice,
  getDiscountPercentage,
  isDiscountActive,
} from '../pricing';
import type { ProductPricing } from '../../types/payment';

describe('pricing utils', () => {
  describe('getEffectivePrice', () => {
    it('returns 0 for free products', () => {
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 0,
        discountPrice: null,
        discountValidUntil: null,
        isFree: true,
      };
      expect(getEffectivePrice(pricing)).toBe(0);
    });

    it('returns basePrice when no discount is set', () => {
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: null,
        discountValidUntil: null,
        isFree: false,
      };
      expect(getEffectivePrice(pricing)).toBe(30);
    });

    it('returns discountPrice when discount is active', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: 20,
        discountValidUntil: tomorrow,
        isFree: false,
      };
      expect(getEffectivePrice(pricing)).toBe(20);
    });

    it('returns basePrice when discount has expired', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: 20,
        discountValidUntil: yesterday,
        isFree: false,
      };
      expect(getEffectivePrice(pricing)).toBe(30);
    });

    it('returns basePrice when discountPrice is null even with valid date', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: null,
        discountValidUntil: tomorrow,
        isFree: false,
      };
      expect(getEffectivePrice(pricing)).toBe(30);
    });
  });

  describe('formatPrice', () => {
    it('formats GBP correctly with £ symbol', () => {
      expect(formatPrice(30, 'GBP')).toBe('£30.00');
    });

    it('formats INR correctly with ₹ symbol', () => {
      expect(formatPrice(500, 'INR')).toBe('₹500.00');
    });

    it('handles decimal values', () => {
      expect(formatPrice(19.99, 'GBP')).toBe('£19.99');
    });

    it('handles zero', () => {
      expect(formatPrice(0, 'GBP')).toBe('£0.00');
    });
  });

  describe('getDiscountPercentage', () => {
    it('returns discount percentage for active discount', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 100,
        discountPrice: 75,
        discountValidUntil: tomorrow,
        isFree: false,
      };
      expect(getDiscountPercentage(pricing)).toBe(25);
    });

    it('returns null when no discount is active', () => {
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 100,
        discountPrice: null,
        discountValidUntil: null,
        isFree: false,
      };
      expect(getDiscountPercentage(pricing)).toBeNull();
    });

    it('returns null when discount has expired', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 100,
        discountPrice: 75,
        discountValidUntil: yesterday,
        isFree: false,
      };
      expect(getDiscountPercentage(pricing)).toBeNull();
    });

    it('returns null when basePrice is 0', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 0,
        discountPrice: 0,
        discountValidUntil: tomorrow,
        isFree: true,
      };
      expect(getDiscountPercentage(pricing)).toBeNull();
    });

    it('rounds percentage to nearest integer', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: 19.99,
        discountValidUntil: tomorrow,
        isFree: false,
      };
      expect(getDiscountPercentage(pricing)).toBe(33); // (30-19.99)/30 = 33.37% ≈ 33%
    });
  });

  describe('isDiscountActive', () => {
    it('returns true when discount price set and not expired', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: 20,
        discountValidUntil: tomorrow,
        isFree: false,
      };
      expect(isDiscountActive(pricing)).toBe(true);
    });

    it('returns false when discount price is null', () => {
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: null,
        discountValidUntil: null,
        isFree: false,
      };
      expect(isDiscountActive(pricing)).toBe(false);
    });

    it('returns false when discount has expired', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: 20,
        discountValidUntil: yesterday,
        isFree: false,
      };
      expect(isDiscountActive(pricing)).toBe(false);
    });

    it('returns false when discountValidUntil is null', () => {
      const pricing: ProductPricing = {
        currency: 'GBP',
        basePrice: 30,
        discountPrice: 20,
        discountValidUntil: null,
        isFree: false,
      };
      expect(isDiscountActive(pricing)).toBe(false);
    });
  });
});
