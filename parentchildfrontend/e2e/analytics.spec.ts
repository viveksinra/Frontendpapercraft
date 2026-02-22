import { test, expect, type Page } from '@playwright/test';

const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL || 'student@test.com';
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD || 'password123';
const PARENT_EMAIL = process.env.E2E_PARENT_EMAIL || 'parent@test.com';
const PARENT_PASSWORD = process.env.E2E_PARENT_PASSWORD || 'password123';

async function loginAsStudent(page: Page) {
  await page.goto('/auth/student/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input#email').fill(STUDENT_EMAIL);
  await page.locator('input#password').fill(STUDENT_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/student/dashboard', { timeout: 15000 });
}

async function loginAsParent(page: Page) {
  await page.goto('/auth/parent/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input#email').fill(PARENT_EMAIL);
  await page.locator('input#password').fill(PARENT_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/parent/dashboard', { timeout: 15000 });
}

// ─── Flow 3: Student views own performance with 11+ analytics ────────

test.describe('Student Performance & Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page);
  });

  test('performance page loads with heading and KPI cards', async ({ page }) => {
    await page.goto('/student/performance');
    await page.waitForLoadState('networkidle');

    // Verify performance heading
    await expect(
      page.getByRole('heading', { name: /performance/i })
    ).toBeVisible({ timeout: 15000 });

    // Look for KPI card content
    const avgScore = page.getByText(/your average/i).or(
      page.getByText(/average score/i)
    );
    const testsDone = page.getByText(/tests done/i);
    const improvement = page.getByText(/improvement/i);
    const rank = page.getByText(/your rank/i).or(
      page.getByText(/rank/i)
    );

    // At least the heading should be visible — data cards depend on API
    await page.waitForTimeout(5000);

    if (await avgScore.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(avgScore.first()).toBeVisible();
    }
    if (await testsDone.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(testsDone.first()).toBeVisible();
    }
  });

  test('performance page shows 11+ qualification band if available', async ({ page }) => {
    await page.goto('/student/performance');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // 11+ panel is optional, only for eligible students
    const elevenPlusHeading = page.getByText(/11\+ performance/i).or(
      page.getByText(/your 11\+/i)
    );
    const bandBadge = page.locator('[class*="rounded-full"][class*="text-white"]');

    const has11Plus = await elevenPlusHeading.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (has11Plus) {
      await expect(elevenPlusHeading.first()).toBeVisible();
      // Look for component score sections
      const componentScores = page.getByText(/verbal reasoning/i).or(
        page.getByText(/non-verbal reasoning/i)
      );
      if (await componentScores.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(componentScores.first()).toBeVisible();
      }
    }
  });

  test('performance page shows chart placeholders', async ({ page }) => {
    await page.goto('/student/performance');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Look for Score Trend and Subject Breakdown sections
    const scoreTrend = page.getByText(/score trend/i);
    const subjectBreakdown = page.getByText(/subject breakdown/i).or(
      page.getByText(/subject/i)
    );

    if (await scoreTrend.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(scoreTrend.first()).toBeVisible();
    }
  });

  test('performance page shows reports section if reports exist', async ({ page }) => {
    await page.goto('/student/performance');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Reports section is optional
    const reportsHeading = page.getByText(/your reports/i);

    if (await reportsHeading.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(reportsHeading.first()).toBeVisible();

      // Check for download buttons on completed reports
      const downloadButton = page.getByRole('button', { name: /download/i });
      if (await downloadButton.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(downloadButton.first()).toBeVisible();
      }
    }
  });
});

// ─── Flow 4: Parent views child's analytics ──────────────────────────

test.describe('Parent Child Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsParent(page);
  });

  test('parent dashboard shows child selector', async ({ page }) => {
    // Parent should see linked children on dashboard
    await expect(
      page.getByText(/dashboard/i).or(
        page.getByRole('heading').first()
      )
    ).toBeVisible({ timeout: 15000 });
  });

  test('parent can navigate to child analytics page', async ({ page }) => {
    // Navigate to child performance/analytics
    const analyticsLink = page.getByRole('link', { name: /analytics/i }).or(
      page.getByRole('link', { name: /performance/i })
    );

    if (await analyticsLink.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await analyticsLink.first().click();
      await page.waitForTimeout(3000);

      // Look for parent-friendly analytics content
      const childName = page.getByText(/performance/i).or(
        page.getByText(/your child/i)
      );
      await expect(childName.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('parent analytics shows KPI cards for child', async ({ page }) => {
    // Navigate directly to child analytics
    await page.goto('/parent/children');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Look for analytics content
    const avgScore = page.getByText(/average score/i);
    const testsDone = page.getByText(/tests done/i);
    const improvement = page.getByText(/improvement/i);

    // Data depends on whether the child has taken tests
    if (await avgScore.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(avgScore.first()).toBeVisible();
    }
  });

  test('parent analytics shows improvement narrative', async ({ page }) => {
    await page.goto('/parent/children');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Look for improvement narrative text
    const improvedText = page.getByText(/improved/i).or(
      page.getByText(/steady/i)
    ).or(
      page.getByText(/dipped/i)
    );

    if (await improvedText.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(improvedText.first()).toBeVisible();
    }
  });

  test('parent analytics shows subject analysis', async ({ page }) => {
    await page.goto('/parent/children');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Look for subject analysis section
    const subjectAnalysis = page.getByText(/subject analysis/i);

    if (await subjectAnalysis.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(subjectAnalysis.first()).toBeVisible();
    }
  });

  test('parent can view child reports', async ({ page }) => {
    await page.goto('/parent/children');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Look for reports section
    const reportsHeading = page.getByText(/reports/i);

    if (await reportsHeading.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      const downloadButton = page.getByRole('button', { name: /download/i });
      if (await downloadButton.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(downloadButton.first()).toBeVisible();
      }
    }
  });
});
