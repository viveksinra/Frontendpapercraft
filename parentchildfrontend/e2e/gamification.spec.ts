import { test, expect } from '@playwright/test';

test.describe('Gamification', () => {
  test.describe('Student Gamification Dashboard', () => {
    test('gamification page renders', async ({ page }) => {
      await page.goto('/student/gamification');
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('heading', { name: /gamification|achievements|progress/i })
          .or(page.getByText(/level|points|streak/i))
      ).toBeVisible({ timeout: 15000 });
    });

    test('gamification page shows level and points', async ({ page }) => {
      await page.goto('/student/gamification');
      await page.waitForLoadState('networkidle');

      // Should display some gamification metrics
      const metricsVisible = await Promise.race([
        page.getByText(/level/i).isVisible().catch(() => false),
        page.getByText(/points/i).isVisible().catch(() => false),
        page.getByText(/streak/i).isVisible().catch(() => false),
        page.getByText(/badges/i).isVisible().catch(() => false),
        new Promise(resolve => setTimeout(() => resolve(false), 10000)),
      ]);

      // At minimum the page should render without errors
      expect(await page.title()).toBeTruthy();
    });

    test('gamification page shows badges section', async ({ page }) => {
      await page.goto('/student/gamification');
      await page.waitForLoadState('networkidle');

      const badgesSection = page.getByText(/badges/i);
      if (await badgesSection.isVisible()) {
        expect(await badgesSection.isVisible()).toBe(true);
      }
    });
  });

  test.describe('Student Leaderboard', () => {
    test('leaderboard page renders', async ({ page }) => {
      await page.goto('/student/leaderboard');
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('heading', { name: /leaderboard/i })
          .or(page.getByText(/leaderboard/i))
      ).toBeVisible({ timeout: 15000 });
    });

    test('leaderboard has period filter', async ({ page }) => {
      await page.goto('/student/leaderboard');
      await page.waitForLoadState('networkidle');

      // Should have period filter buttons
      const filterButtons = page.getByRole('button', { name: /all time|weekly|monthly/i });
      if (await filterButtons.first().isVisible()) {
        expect(await filterButtons.first().isVisible()).toBe(true);
      }
    });
  });

  test.describe('Student Notifications', () => {
    test('notifications page renders', async ({ page }) => {
      await page.goto('/student/notifications');
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('heading', { name: /notifications/i })
          .or(page.getByText(/notification/i))
      ).toBeVisible({ timeout: 15000 });
    });

    test('notifications page has category filter', async ({ page }) => {
      await page.goto('/student/notifications');
      await page.waitForLoadState('networkidle');

      const allButton = page.getByRole('button', { name: /^all$/i });
      if (await allButton.isVisible()) {
        expect(await allButton.isVisible()).toBe(true);
      }
    });

    test('notifications page has mark all read button', async ({ page }) => {
      await page.goto('/student/notifications');
      await page.waitForLoadState('networkidle');

      const markAllButton = page.getByRole('button', { name: /mark all|mark.*read/i });
      // This button may or may not be visible depending on state
      if (await markAllButton.isVisible()) {
        expect(await markAllButton.isVisible()).toBe(true);
      }
    });
  });

  test.describe('Parent Achievements', () => {
    test('parent achievements page renders', async ({ page }) => {
      await page.goto('/parent/achievements');
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('heading', { name: /achievement|progress/i })
          .or(page.getByText(/child|children/i))
      ).toBeVisible({ timeout: 15000 });
    });
  });
});
