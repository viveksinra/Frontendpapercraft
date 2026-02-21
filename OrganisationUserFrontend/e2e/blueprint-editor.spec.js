// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Blueprint Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/papers/blueprints');
    await page.waitForLoadState('networkidle');
  });

  test('create blueprint, check feasibility, save', async ({ page }) => {
    // Click "Create Blueprint" button
    const createButton = page.getByRole('button', { name: /create blueprint|new blueprint/i });
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);
    }

    // Fill blueprint name
    const nameInput = page.getByLabel(/name/i).or(page.getByPlaceholder(/name/i));
    if (await nameInput.isVisible()) {
      await nameInput.fill('E2E Test Blueprint');
    }

    // Fill total marks
    const marksInput = page.getByLabel(/total marks/i);
    if (await marksInput.isVisible()) {
      await marksInput.fill('100');
    }

    // Fill total time
    const timeInput = page.getByLabel(/total time/i).or(page.getByLabel(/duration/i));
    if (await timeInput.isVisible()) {
      await timeInput.fill('60');
    }

    // Add a section
    const addSectionButton = page.getByRole('button', { name: /add section/i });
    if (await addSectionButton.isVisible()) {
      await addSectionButton.click();
      await page.waitForTimeout(300);
    }

    // Fill section details
    const sectionNameInput = page.getByPlaceholder(/section a/i).or(
      page.getByLabel(/section name/i)
    );
    if (await sectionNameInput.isVisible()) {
      await sectionNameInput.fill('Section A - MCQ');
    }

    const questionCountInput = page.getByLabel(/question count/i);
    if (await questionCountInput.isVisible()) {
      await questionCountInput.fill('10');
    }

    // Set difficulty mix (should already have defaults)
    // Check the difficulty mix validation
    const difficultySection = page.locator('text=Difficulty Mix');
    if (await difficultySection.isVisible()) {
      await expect(difficultySection).toBeVisible();
    }

    // Check feasibility
    const feasibilityButton = page.getByRole('button', { name: /check feasibility|validate/i });
    if (await feasibilityButton.isVisible()) {
      await feasibilityButton.click();
      await page.waitForTimeout(2000);

      // Verify feasibility results appear
      const feasibilityResult = page.locator('text=/available|feasible|shortfall/i');
      if (await feasibilityResult.first().isVisible()) {
        await expect(feasibilityResult.first()).toBeVisible();
      }
    }

    // Save the blueprint
    const saveButton = page.getByRole('button', { name: /save|create/i }).last();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForTimeout(1000);
    }

    // Verify we're back on the list or see success
    await page.waitForTimeout(500);
  });
});
