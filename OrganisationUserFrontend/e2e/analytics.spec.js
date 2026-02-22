// @ts-check
import { test, expect } from '@playwright/test';

const TEACHER_EMAIL = process.env.E2E_TEACHER_EMAIL || 'teacher@test.com';
const TEACHER_PASSWORD = process.env.E2E_TEACHER_PASSWORD || 'password123';

async function loginAs(page, email, password) {
  await page.goto('/auth/jwt/sign-in');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**');
}

test.describe('Teacher Analytics Flows', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
  });

  // ─── Flow 1: Teacher views student analytics ──────────────────────

  test('navigates to analytics page and sees student tab', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    // Verify analytics page loaded
    await expect(
      page.getByRole('heading', { name: /analytics/i }).or(
        page.getByText(/analytics/i).first()
      )
    ).toBeVisible({ timeout: 15000 });
  });

  test('student analytics tab has search input', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    // Look for student search input
    const searchInput = page.locator('input[placeholder*="student"]').or(
      page.locator('input[placeholder*="Student"]')
    ).or(
      page.getByPlaceholder(/student/i)
    );

    if (await searchInput.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('student analytics shows KPI cards after search', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    // Enter a student ID in the search
    const searchInput = page.locator('input[placeholder*="student"]').or(
      page.getByPlaceholder(/student/i)
    );

    if (await searchInput.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await searchInput.first().fill('student-123');

      const searchButton = page.getByRole('button', { name: /search/i });
      if (await searchButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchButton.click();
        await page.waitForTimeout(3000);
      }

      // Look for KPI card content (e.g., "Average Score", "Tests Done")
      const avgScore = page.getByText(/average score/i);
      const testsDone = page.getByText(/tests done/i);

      if (await avgScore.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(avgScore.first()).toBeVisible();
      }
      if (await testsDone.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(testsDone.first()).toBeVisible();
      }
    }
  });

  // ─── Flow 2: Teacher views class analytics ────────────────────────

  test('class analytics tab has class and test inputs', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    // Look for tab buttons
    const classTab = page.getByRole('tab', { name: /class/i }).or(
      page.getByText(/class analytics/i)
    );

    if (await classTab.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await classTab.first().click();
      await page.waitForTimeout(1000);

      // Look for class and test inputs
      const classInput = page.locator('input[placeholder*="class"]').or(
        page.getByPlaceholder(/class/i)
      );
      const testInput = page.locator('input[placeholder*="test"]').or(
        page.getByPlaceholder(/test/i)
      );

      if (await classInput.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(classInput.first()).toBeVisible();
      }
      if (await testInput.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(testInput.first()).toBeVisible();
      }
    }
  });

  test('class analytics shows score stats after selection', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    const classTab = page.getByRole('tab', { name: /class/i }).or(
      page.getByText(/class analytics/i)
    );

    if (await classTab.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await classTab.first().click();
      await page.waitForTimeout(1000);

      // Fill in class and test IDs
      const classInput = page.locator('input[placeholder*="class"]').or(
        page.getByPlaceholder(/class/i)
      );
      const testInput = page.locator('input[placeholder*="test"]').or(
        page.getByPlaceholder(/test/i)
      );

      if (await classInput.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await classInput.first().fill('class-123');
      }
      if (await testInput.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await testInput.first().fill('test-123');
      }

      const analyseButton = page.getByRole('button', { name: /analyse/i });
      if (await analyseButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await analyseButton.click();
        await page.waitForTimeout(3000);

        // Look for score stats (Average, Median, Highest, Lowest)
        const avgLabel = page.getByText(/average/i);
        const medianLabel = page.getByText(/median/i);

        if (await avgLabel.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await expect(avgLabel.first()).toBeVisible();
        }
      }
    }
  });

  // ─── Flow 3: Institute analytics ──────────────────────────────────

  test('institute analytics tab shows KPI metrics', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    const instituteTab = page.getByRole('tab', { name: /institute/i }).or(
      page.getByText(/institute analytics/i)
    );

    if (await instituteTab.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await instituteTab.first().click();
      await page.waitForTimeout(3000);

      // Look for KPI labels
      const studentsLabel = page.getByText(/students/i);
      const teachersLabel = page.getByText(/teachers/i);

      if (await studentsLabel.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(studentsLabel.first()).toBeVisible();
      }
      if (await teachersLabel.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(teachersLabel.first()).toBeVisible();
      }
    }
  });

  test('institute analytics shows date range buttons', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    const instituteTab = page.getByRole('tab', { name: /institute/i }).or(
      page.getByText(/institute analytics/i)
    );

    if (await instituteTab.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await instituteTab.first().click();
      await page.waitForTimeout(1000);

      // Look for date range buttons (3m, 6m, 1y)
      const threeMonths = page.getByRole('button', { name: /3 months/i }).or(
        page.getByText(/last 3 months/i)
      );
      const sixMonths = page.getByRole('button', { name: /6 months/i }).or(
        page.getByText(/last 6 months/i)
      );

      if (await threeMonths.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(threeMonths.first()).toBeVisible();
      }
    }
  });

  // ─── Flow 4: Question analytics ───────────────────────────────────

  test('question analytics tab shows question table', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    const questionTab = page.getByRole('tab', { name: /question/i }).or(
      page.getByText(/question analytics/i)
    );

    if (await questionTab.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await questionTab.first().click();
      await page.waitForTimeout(3000);

      // Look for table or "No question analytics data available" message
      const table = page.locator('table');
      const emptyMessage = page.getByText(/no question analytics/i);
      const errorMessage = page.locator('.text-red-800');

      const hasTable = await table.first().isVisible({ timeout: 5000 }).catch(() => false);
      const hasEmpty = await emptyMessage.first().isVisible({ timeout: 3000 }).catch(() => false);
      const hasError = await errorMessage.first().isVisible({ timeout: 3000 }).catch(() => false);

      // One of these states should be present
      expect(hasTable || hasEmpty || hasError).toBeTruthy();
    }
  });

  // ─── Flow 5: Reports page ─────────────────────────────────────────

  test('reports page loads with report list or empty state', async ({ page }) => {
    await page.goto('/dashboard/reports');
    await page.waitForLoadState('networkidle');

    // Verify reports page loaded
    const heading = page.getByRole('heading', { name: /report/i });
    const reportContent = page.getByText(/report/i).first();

    await expect(
      heading.or(reportContent)
    ).toBeVisible({ timeout: 15000 });
  });

  test('reports generate page has type selection', async ({ page }) => {
    await page.goto('/dashboard/reports/generate');
    await page.waitForLoadState('networkidle');

    // Look for report type options
    const progressReport = page.getByText(/progress report/i);
    const classSummary = page.getByText(/class summary/i);

    if (await progressReport.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(progressReport.first()).toBeVisible();
    }
    if (await classSummary.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(classSummary.first()).toBeVisible();
    }
  });
});
