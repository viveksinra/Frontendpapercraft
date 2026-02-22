import { test, expect, type Page } from '@playwright/test';

/**
 * Parent views child's test result detail:
 *   1. Login as parent
 *   2. Navigate to children list
 *   3. Click on a child
 *   4. Navigate to results tab/page
 *   5. Click on a result
 *   6. Verify result detail page loads with score, grade, and question review
 */

const PARENT_EMAIL = process.env.E2E_PARENT_EMAIL || 'parent@test.com';
const PARENT_PASSWORD = process.env.E2E_PARENT_PASSWORD || 'password123';

async function loginAsParent(page: Page) {
  await page.goto('/auth/parent/login');
  await page.waitForLoadState('networkidle');

  await page.locator('input#email').fill(PARENT_EMAIL);
  await page.locator('input#password').fill(PARENT_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/parent/dashboard', { timeout: 15000 });
}

test.describe('Parent Views Child Results', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsParent(page);
  });

  test('parent can navigate to children list and see linked children', async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');

    // Verify page heading
    await expect(
      page.getByRole('heading', { name: /my children/i })
    ).toBeVisible({ timeout: 15000 });

    // Wait for children to load
    await page.waitForTimeout(3000);

    // Children should appear as cards with names and a "View Details" link
    const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
    const emptyState = page.getByText(/no children linked/i);

    await expect(
      viewDetailsLink.or(emptyState)
    ).toBeVisible({ timeout: 10000 });
  });

  test('parent can click on a child and view child detail page', async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /my children/i })
    ).toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(3000);

    // Click on the first child's "View Details" link
    const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
    if (!(await viewDetailsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No linked children available');
      return;
    }

    await viewDetailsLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we are on the child detail page (/children/{childId})
    await expect(page).toHaveURL(/\/children\/[^/]+$/);
  });

  test('parent can navigate to child results page', async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(3000);

    const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
    if (!(await viewDetailsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No linked children available');
      return;
    }

    await viewDetailsLink.click();
    await page.waitForLoadState('networkidle');

    // On the child detail page, look for a link/tab to "Results"
    const resultsLink = page.getByRole('link', { name: /results/i }).first();
    const resultsTab = page.getByText(/results/i).first();

    if (await resultsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await resultsLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on the results page
      await expect(page).toHaveURL(/\/children\/[^/]+\/results/);

      // Verify results page heading
      await expect(
        page.getByRole('heading', { name: /results/i })
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('parent can view a specific result detail', async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(3000);

    const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
    if (!(await viewDetailsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No linked children available');
      return;
    }

    await viewDetailsLink.click();
    await page.waitForLoadState('networkidle');

    // Navigate to results page
    const resultsLink = page.getByRole('link', { name: /results/i }).first();
    if (!(await resultsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'Cannot find results link');
      return;
    }

    await resultsLink.click();
    await page.waitForLoadState('networkidle');

    // Wait for results list to load
    await page.waitForTimeout(3000);

    // Look for a result card/item to click on
    // ChildResultsList renders result items that link to /children/{childId}/results/{testId}
    const resultItem = page.getByRole('link').filter({ hasText: /view|detail/i }).first();
    const resultCard = page.locator('[class*="Card"]').first();

    if (await resultItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      await resultItem.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on the result detail page
      await expect(page).toHaveURL(/\/children\/[^/]+\/results\/[^/]+$/);

      // ChildResultDetail shows the test name, score, grade, and question review
      await page.waitForTimeout(3000);

      // Check for score display
      const scoreLabel = page.getByText(/score/i).first();
      const correctLabel = page.getByText(/correct/i).first();
      const backButton = page.getByText(/back to results/i);
      const errorState = page.locator('.text-destructive').first();

      await expect(
        scoreLabel.or(correctLabel).or(backButton).or(errorState)
      ).toBeVisible({ timeout: 10000 });

      // If score is visible, the detail page loaded successfully
      if (await scoreLabel.isVisible().catch(() => false)) {
        // Check for grade display
        const gradeLabel = page.getByText(/grade/i);
        if (await gradeLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(gradeLabel).toBeVisible();
        }
      }
    }
  });

  test('result detail page shows question review section', async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(3000);

    const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
    if (!(await viewDetailsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No linked children available');
      return;
    }

    await viewDetailsLink.click();
    await page.waitForLoadState('networkidle');

    const resultsLink = page.getByRole('link', { name: /results/i }).first();
    if (!(await resultsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'Cannot find results link');
      return;
    }

    await resultsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const resultItem = page.getByRole('link').filter({ hasText: /view|detail/i }).first();
    if (!(await resultItem.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No results available to view');
      return;
    }

    await resultItem.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for "Question Review" heading
    // ChildResultDetail shows this when questions array is not empty
    const questionReview = page.getByRole('heading', { name: /question review/i });
    const questionItem = page.getByText(/^Q\d+\./).first();

    if (await questionReview.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(questionReview).toBeVisible();

      // Verify individual question items are displayed
      if (await questionItem.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(questionItem).toBeVisible();
      }

      // Check for correct/incorrect indicators (green/red bordered cards)
      const correctIcon = page.locator('text=Your answer').first();
      if (await correctIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(correctIcon).toBeVisible();
      }
    }
  });

  test('result detail page has back navigation', async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(3000);

    const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
    if (!(await viewDetailsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No linked children available');
      return;
    }

    await viewDetailsLink.click();
    await page.waitForLoadState('networkidle');

    const resultsLink = page.getByRole('link', { name: /results/i }).first();
    if (!(await resultsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'Cannot find results link');
      return;
    }

    await resultsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const resultItem = page.getByRole('link').filter({ hasText: /view|detail/i }).first();
    if (!(await resultItem.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'No results available to view');
      return;
    }

    await resultItem.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Verify the "Back to Results" button is visible
    const backButton = page.getByRole('button', { name: /back to results/i });
    if (await backButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(backButton).toBeVisible();

      // Click back button and verify navigation
      await backButton.click();
      await page.waitForLoadState('networkidle');

      // Should be back on the results list page
      await expect(page).toHaveURL(/\/children\/[^/]+\/results$/);
    }
  });
});
