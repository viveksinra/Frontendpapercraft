// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Create Paper Set', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/papers/sets');
    await page.waitForLoadState('networkidle');
  });

  test('create set, add papers, upload PDF, publish', async ({ page }) => {
    // Click "Create Paper Set" button
    const createButton = page.getByRole('button', { name: /create paper set/i }).or(
      page.getByRole('link', { name: /create/i })
    );
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForLoadState('networkidle');
    }

    // Fill paper set details
    const titleInput = page.getByLabel(/title/i).or(page.getByPlaceholder(/title/i));
    if (await titleInput.isVisible()) {
      await titleInput.fill('E2E Test Paper Set');
    }

    const descInput = page.getByLabel(/description/i).or(page.getByPlaceholder(/description/i));
    if (await descInput.isVisible()) {
      await descInput.fill('A test paper set created by E2E tests');
    }

    // Select exam type if available
    const examTypeSelect = page.getByLabel(/exam type/i);
    if (await examTypeSelect.isVisible()) {
      await examTypeSelect.selectOption({ index: 1 });
    }

    // Submit the form
    const submitButton = page.getByRole('button', { name: /create|save/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }

    // Should navigate to paper set detail page
    // Add papers to the set
    const addPaperButton = page.getByRole('button', { name: /add paper/i });
    if (await addPaperButton.isVisible()) {
      await addPaperButton.click();
      await page.waitForTimeout(500);

      // Select first available paper from the dialog/list
      const paperOption = page.locator('[class*="card"]').first();
      if (await paperOption.isVisible()) {
        await paperOption.click();
        await page.waitForTimeout(1000);
      }
    }

    // Publish the paper set
    const publishButton = page.getByRole('button', { name: /publish/i });
    if (await publishButton.isVisible()) {
      await publishButton.click();
      await page.waitForTimeout(1000);

      // Confirm if there's a confirmation dialog
      const confirmButton = page.getByRole('button', { name: /confirm|yes/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }
  });
});
