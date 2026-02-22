import { describe, it, expect } from 'vitest';
import {
  getCompletionPercentage,
  isHomeworkOverdue,
  isHomeworkDueSoon,
  getEffectiveDeadline,
  canSubmitHomework,
  formatCurrency,
  getOutstandingBalance,
} from '../homework';

describe('homework utils', () => {
  describe('getCompletionPercentage', () => {
    it('returns 0 for empty summary', () => {
      expect(getCompletionPercentage({ total: 0, completed: 0, pending: 0, overdue: 0, late: 0 })).toBe(0);
    });

    it('calculates percentage correctly', () => {
      expect(getCompletionPercentage({ total: 10, completed: 7, pending: 2, overdue: 1, late: 0 })).toBe(70);
    });

    it('returns 100 when all completed', () => {
      expect(getCompletionPercentage({ total: 5, completed: 5, pending: 0, overdue: 0, late: 0 })).toBe(100);
    });
  });

  describe('isHomeworkOverdue', () => {
    it('returns true for past date', () => {
      expect(isHomeworkOverdue('2020-01-01T00:00:00.000Z')).toBe(true);
    });

    it('returns false for future date', () => {
      expect(isHomeworkOverdue('2099-01-01T00:00:00.000Z')).toBe(false);
    });

    it('accepts Date objects', () => {
      expect(isHomeworkOverdue(new Date('2020-01-01'))).toBe(true);
    });
  });

  describe('isHomeworkDueSoon', () => {
    it('returns false for past date', () => {
      expect(isHomeworkDueSoon('2020-01-01T00:00:00.000Z')).toBe(false);
    });

    it('returns false for date far in future', () => {
      expect(isHomeworkDueSoon('2099-01-01T00:00:00.000Z')).toBe(false);
    });

    it('returns true for date within 24 hours', () => {
      const soon = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      expect(isHomeworkDueSoon(soon)).toBe(true);
    });
  });

  describe('getEffectiveDeadline', () => {
    it('returns dueDate when late submissions not allowed', () => {
      const due = new Date('2026-03-01');
      expect(getEffectiveDeadline(due, false, null)).toEqual(due);
    });

    it('returns lateDeadline when allowed and provided', () => {
      const due = new Date('2026-03-01');
      const late = new Date('2026-03-05');
      expect(getEffectiveDeadline(due, true, late)).toEqual(late);
    });

    it('returns dueDate when allowed but no lateDeadline', () => {
      const due = new Date('2026-03-01');
      expect(getEffectiveDeadline(due, true, null)).toEqual(due);
    });
  });

  describe('canSubmitHomework', () => {
    it('returns false for archived homework', () => {
      expect(canSubmitHomework('archived', 'pending', '2099-01-01', false, null)).toBe(false);
    });

    it('returns false for already submitted', () => {
      expect(canSubmitHomework('active', 'submitted', '2099-01-01', false, null)).toBe(false);
    });

    it('returns false for already graded', () => {
      expect(canSubmitHomework('active', 'graded', '2099-01-01', false, null)).toBe(false);
    });

    it('returns true for pending with future deadline', () => {
      expect(canSubmitHomework('active', 'pending', '2099-01-01', false, null)).toBe(true);
    });

    it('returns false for pending with past deadline', () => {
      expect(canSubmitHomework('active', 'pending', '2020-01-01', false, null)).toBe(false);
    });

    it('returns true when late deadline is in future', () => {
      expect(canSubmitHomework('past_due', 'pending', '2020-01-01', true, '2099-01-01')).toBe(true);
    });
  });

  describe('formatCurrency', () => {
    it('formats GBP', () => {
      const result = formatCurrency(100.5, 'GBP');
      expect(result).toContain('100.50');
    });

    it('formats INR', () => {
      const result = formatCurrency(1000, 'INR');
      expect(result).toContain('1,000.00');
    });
  });

  describe('getOutstandingBalance', () => {
    it('returns difference', () => {
      expect(getOutstandingBalance(500, 200)).toBe(300);
    });

    it('returns 0 when fully paid', () => {
      expect(getOutstandingBalance(500, 500)).toBe(0);
    });

    it('returns 0 when overpaid', () => {
      expect(getOutstandingBalance(500, 600)).toBe(0);
    });
  });
});
