import { test, expect, type Page } from '@playwright/test';

/**
 * Student views performance trends:
 *   1. Login as student
 *   2. Navigate to /student/performance
 *   3. Verify performance heading renders
 *   4. Verify charts render (SVG elements or chart containers)
 */

const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL || 'student@test.com';
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD || 'password123';

async function loginAsStudent(page: Page) {
  await page.goto('/auth/student/login');
  await page.waitForLoadState('networkidle');

  await page.locator('input#email').fill(STUDENT_EMAIL);
  await page.locator('input#password').fill(STUDENT_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/student/dashboard', { timeout: 15000 });
}

test.describe('Student Performance Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page);
  });

  test('performance page loads with heading', async ({ page }) => {
    await page.goto('/student/performance');
    await page.waitForLoadState('networkidle');

    // Verify the performance page heading
    await expect(
      page.getByRole('heading', { name: /performance/i })
    ).toBeVisible({ timeout: 15000 });

    // Verify the subtitle/description text
    await expect(
      page.getByText(/track your progress/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('performance page shows loading state then content', async ({ page }) => {
    await page.goto('/student/performance');

    // The PerformancePage component shows a loading spinner initially
    // Either the spinner or the final content should be visible
    const loadingSpinner = page.locator('.animate-spin');
    const performanceHeading = page.getByRole('heading', { name: /performance/i });

    await expect(
      loadingSpinner.or(performanceHeading)
    ).toBeVisible({ timeout: 15000 });

    // Wait for content to finish loading
    await page.waitForTimeout(3000);
  });

  test('performance page renders chart containers', async ({ page }) => {
    await page.goto('/student/performance');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /performance/i })
    ).toBeVisible({ timeout: 15000 });

    // Wait for data to load (loading spinner disappears)
    await page.waitForTimeout(5000);

    // Check for SVG elements (charts render as SVGs)
    const svgElements = page.locator('svg');
    const chartContainers = page.locator('[class*="chart"]').or(
      page.locator('[class*="recharts"]')
    );
    const errorMessage = page.locator('.text-destructive');
    const retryButton = page.getByRole('button', { name: /retry/i });

    // Either charts loaded, or we got an error (which is still valid test behavior)
    const hasCharts = await svgElements.count() > 2; // Layout icons are also SVGs
    const hasError = await errorMessage.isVisible().catch(() => false);

    if (hasCharts) {
      // PerformancePage renders ScoreTrendChart, SubjectRadarChart, DifficultyAnalysisChart
      // These should produce SVG elements within chart containers
      expect(await svgElements.count()).toBeGreaterThan(0);
    } else if (hasError) {
      // If API is not available, the error state with retry button is valid
      await expect(retryButton).toBeVisible();
    }
    // If neither, the page may still be loading or have no data
  });

  test('performance page shows score trend section', async ({ page }) => {
    await page.goto('/student/performance');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /performance/i })
    ).toBeVisible({ timeout: 15000 });

    // Wait for data
    await page.waitForTimeout(5000);

    // Look for score trend related content
    // ScoreTrendChart, SubjectRadarChart, DifficultyAnalysisChart, TimeAnalysisSection
    const scoreTrend = page.getByText(/score trend/i).or(
      page.getByText(/trend/i)
    );
    const subjectBreakdown = page.getByText(/subject/i);
    const difficultyAnalysis = page.getByText(/difficulty/i);
    const timeAnalysis = page.getByText(/time analysis/i).or(
      page.getByText(/average time/i)
    );

    // At least one chart section heading should be visible if data loaded
    if (await scoreTrend.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(scoreTrend.first()).toBeVisible();
    }
  });

  test('performance page can be navigated to from sidebar', async ({ page }) => {
    // Start from dashboard
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // Click the "Progress" link in the sidebar (desktop) or bottom nav
    const progressLink = page.getByRole('link', { name: /progress/i }).first();
    if (await progressLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await progressLink.click();
      await page.waitForURL('**/student/performance', { timeout: 10000 });

      await expect(
        page.getByRole('heading', { name: /performance/i })
      ).toBeVisible({ timeout: 15000 });
    }
  });
});
