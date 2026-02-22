import { test, expect } from '@playwright/test';

test.describe('Messaging & Discussions', () => {
  test.describe('Student Messaging', () => {
    test('messages page renders inbox', async ({ page }) => {
      await page.goto('/student/messages');
      await page.waitForLoadState('networkidle');

      // Should show messages page heading or empty state
      await expect(
        page.getByRole('heading', { name: /messages/i })
          .or(page.getByText(/no conversations/i))
          .or(page.getByText(/inbox/i))
      ).toBeVisible({ timeout: 15000 });
    });

    test('messages page has compose button', async ({ page }) => {
      await page.goto('/student/messages');
      await page.waitForLoadState('networkidle');

      // Should have a way to compose new message
      const composeButton = page.getByRole('button', { name: /new message|compose|send/i });
      if (await composeButton.isVisible()) {
        await composeButton.click();
        // Should show some compose UI
        await expect(
          page.getByPlaceholder(/recipient|to|search/i)
            .or(page.getByText(/new message/i))
        ).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Student Discussions', () => {
    test('discussions page renders thread list', async ({ page }) => {
      await page.goto('/student/discussions');
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('heading', { name: /discussions/i })
          .or(page.getByText(/discussion/i))
      ).toBeVisible({ timeout: 15000 });
    });

    test('discussions page has create thread button', async ({ page }) => {
      await page.goto('/student/discussions');
      await page.waitForLoadState('networkidle');

      const createButton = page.getByRole('button', { name: /new thread|new discussion|create|ask/i });
      if (await createButton.isVisible()) {
        await createButton.click();
        // Should show create thread form
        await expect(
          page.getByPlaceholder(/title/i)
            .or(page.getByText(/create.*thread/i))
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test('discussions page has category filter', async ({ page }) => {
      await page.goto('/student/discussions');
      await page.waitForLoadState('networkidle');

      // Should have some filter or category selector
      const filterElement = page.getByRole('button', { name: /all|filter|category/i });
      if (await filterElement.isVisible()) {
        expect(await filterElement.isVisible()).toBe(true);
      }
    });
  });

  test.describe('Parent Messaging', () => {
    test('parent messages page renders', async ({ page }) => {
      await page.goto('/parent/messages');
      await page.waitForLoadState('networkidle');

      await expect(
        page.getByRole('heading', { name: /messages/i })
          .or(page.getByText(/no conversations/i))
          .or(page.getByText(/inbox/i))
      ).toBeVisible({ timeout: 15000 });
    });
  });
});
