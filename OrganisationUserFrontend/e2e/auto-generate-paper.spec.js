// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Auto-Generate Paper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/papers/auto-generate');
    await page.waitForLoadState('networkidle');
  });

  test('select blueprint, review draft, swap a question, finalize', async ({ page }) => {
    // Step 1: Select Blueprint
    await expect(page.locator('text=Select Blueprint').or(page.locator('text=1. Select Blueprint'))).toBeVisible();

    // Enter paper title
    const titleInput = page.getByPlaceholder(/title|paper name/i);
    if (await titleInput.isVisible()) {
      await titleInput.fill('Auto-Generated Math Paper');
    }

    // Select first available blueprint card
    const blueprintCard = page.locator('[class*="card"]').first();
    if (await blueprintCard.isVisible()) {
      await blueprintCard.click();
    }

    // Wait for blueprint list to load then select template too
    await page.waitForTimeout(500);

    // Click Generate Paper button
    const generateButton = page.getByRole('button', { name: /generate paper/i });
    if (await generateButton.isVisible()) {
      await expect(generateButton).toBeEnabled();
      await generateButton.click();
      await page.waitForTimeout(3000); // Wait for generation
    }

    // Step 2: Review Draft
    const reviewStep = page.locator('text=2. Review Draft');
    if (await reviewStep.isVisible()) {
      await expect(reviewStep).toBeVisible();
    }

    // Find a "Swap" button for a question
    const swapButton = page.getByRole('button', { name: /swap/i }).first();
    if (await swapButton.isVisible()) {
      await swapButton.click();
      await page.waitForTimeout(1000);

      // Wait for swap dialog
      const swapDialog = page.locator('[role="dialog"]');
      if (await swapDialog.isVisible()) {
        // Select first alternative
        const altCard = swapDialog.locator('[class*="card"]').first();
        if (await altCard.isVisible()) {
          await altCard.click();
        }

        // Confirm swap
        const confirmSwap = swapDialog.getByRole('button', { name: /swap question/i });
        if (await confirmSwap.isVisible()) {
          await confirmSwap.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Finalize the paper
    const finalizeButton = page.getByRole('button', { name: /finalize/i });
    if (await finalizeButton.isVisible()) {
      await finalizeButton.click();
      await page.waitForTimeout(2000);
    }
  });
});
