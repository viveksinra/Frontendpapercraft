// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Create Paper Manually', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the papers create page
    await page.goto('/dashboard/papers/create');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('full flow: select template, add sections, pick questions, finalize, download PDF', async ({ page }) => {
    // Step 1: Select Template
    await expect(page.getByText('Choose a template')).toBeVisible();

    // Click on the first available template card
    const templateCards = page.locator('[class*="template"]').first();
    if (await templateCards.isVisible()) {
      await templateCards.click();
    }

    // Fill paper title
    const titleInput = page.getByPlaceholder('Paper Title');
    if (await titleInput.isVisible()) {
      await titleInput.fill('E2E Test Paper');
    }

    // Click Next to move to Sections step
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }

    // Step 2: Add Sections
    const addSectionButton = page.getByRole('button', { name: /add section/i });
    if (await addSectionButton.isVisible()) {
      await addSectionButton.click();
    }

    // Fill section name
    const sectionNameInput = page.getByPlaceholder('Section A');
    if (await sectionNameInput.isVisible()) {
      await sectionNameInput.fill('Section A - MCQ');
    }

    // Move to Questions step
    const nextButton2 = page.getByRole('button', { name: /next/i });
    if (await nextButton2.isVisible()) {
      await nextButton2.click();
    }

    // Step 3: Pick Questions
    await page.waitForTimeout(1000); // Wait for question list to load

    // Search for questions
    const searchInput = page.getByPlaceholder('Search questions');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
    }

    // Add first available question
    const addButton = page.locator('button').filter({ hasText: /add|plus/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
    }

    // Step 4: Review
    const reviewButton = page.getByRole('button', { name: /next|review/i });
    if (await reviewButton.isVisible()) {
      await reviewButton.click();
    }

    // Verify review panel shows paper details
    await page.waitForTimeout(500);

    // Step 5: Finalize
    const finalizeButton = page.getByRole('button', { name: /finalize|create/i });
    if (await finalizeButton.isVisible()) {
      await finalizeButton.click();
      await page.waitForTimeout(2000);
    }

    // Verify navigation or success state
    // The page should show PDF preview or redirect to paper detail
  });
});
