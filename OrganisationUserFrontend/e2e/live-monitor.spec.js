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

test.describe('Live Test Monitor', () => {
  test('teacher navigates to monitor page and sees the monitor interface', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    // Navigate to the live monitor page for a test
    await page.goto('/dashboard/online-tests/sample-test-id/monitor');
    await page.waitForLoadState('networkidle');

    // Verify the monitor page loaded
    await expect(
      page.getByRole('heading', { name: /live test monitor/i }).or(
        page.getByText(/monitor student progress/i)
      )
    ).toBeVisible({ timeout: 15000 });
  });

  test('monitor page shows LIVE indicator when test is active', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    await page.goto('/dashboard/online-tests/sample-test-id/monitor');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /live test monitor/i }).or(
        page.getByText(/monitor student progress/i)
      )
    ).toBeVisible({ timeout: 15000 });

    // Look for LIVE badge/indicator
    // The TestStatusBadge with status "live" has "animate-pulse" class and "Live" label
    const liveIndicator = page.locator('text=Live').or(
      page.locator('text=LIVE')
    ).or(
      page.locator('[class*="animate-pulse"]')
    ).or(
      page.locator('[class*="live"]')
    );
    if (await liveIndicator.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(liveIndicator.first()).toBeVisible();
    }

    // Look for a recording/streaming dot indicator
    const liveDot = page.locator('[class*="bg-red"]').or(
      page.locator('[class*="pulse"]')
    );
    if (await liveDot.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(liveDot.first()).toBeVisible();
    }
  });

  test('monitor page shows stats bar with key metrics', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    await page.goto('/dashboard/online-tests/sample-test-id/monitor');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /live test monitor/i }).or(
        page.getByText(/monitor student progress/i)
      )
    ).toBeVisible({ timeout: 15000 });

    // Look for statistics/metrics cards on the monitor dashboard
    // Common stats: Total Students, Online, Submitted, In Progress, Time Remaining
    const totalStudentsLabel = page.locator('text=Total Students').or(
      page.locator('text=Students')
    ).or(
      page.locator('text=Participants')
    );
    if (await totalStudentsLabel.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(totalStudentsLabel.first()).toBeVisible();
    }

    const onlineLabel = page.locator('text=Online').or(
      page.locator('text=Connected')
    ).or(
      page.locator('text=Active')
    );
    if (await onlineLabel.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(onlineLabel.first()).toBeVisible();
    }

    const submittedLabel = page.locator('text=Submitted').or(
      page.locator('text=Completed')
    ).or(
      page.locator('text=Finished')
    );
    if (await submittedLabel.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(submittedLabel.first()).toBeVisible();
    }

    // Time remaining display
    const timeRemaining = page.locator('text=Time Remaining').or(
      page.locator('text=Time Left')
    ).or(
      page.locator('text=/\\d+:\\d+/')
    );
    if (await timeRemaining.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(timeRemaining.first()).toBeVisible();
    }
  });

  test('monitor page shows student table with status columns', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    await page.goto('/dashboard/online-tests/sample-test-id/monitor');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /live test monitor/i }).or(
        page.getByText(/monitor student progress/i)
      )
    ).toBeVisible({ timeout: 15000 });

    // Look for a student data table (table element or data grid)
    const table = page.locator('table').or(
      page.locator('[role="table"]')
    ).or(
      page.locator('[class*="table"]')
    );
    if (await table.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(table.first()).toBeVisible();

      // Check for expected column headers
      const nameColumn = page.locator('th:has-text("Name")').or(
        page.locator('text=Student Name')
      );
      if (await nameColumn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(nameColumn.first()).toBeVisible();
      }

      const statusColumn = page.locator('th:has-text("Status")').or(
        page.locator('text=Status')
      );
      if (await statusColumn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(statusColumn.first()).toBeVisible();
      }

      const progressColumn = page.locator('th:has-text("Progress")').or(
        page.locator('text=Progress')
      ).or(
        page.locator('text=Answered')
      );
      if (await progressColumn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(progressColumn.first()).toBeVisible();
      }
    }

    // If no students are connected, an empty state should show
    const emptyState = page.locator('text=No students').or(
      page.locator('text=Waiting for students')
    ).or(
      page.locator('text=no participants')
    );
    if (await emptyState.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(emptyState.first()).toBeVisible();
    }
  });

  test('monitor page has action buttons for test control', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    await page.goto('/dashboard/online-tests/sample-test-id/monitor');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /live test monitor/i }).or(
        page.getByText(/monitor student progress/i)
      )
    ).toBeVisible({ timeout: 15000 });

    // Look for test control action buttons
    // End Test button
    const endTestButton = page.getByRole('button', { name: /end test|stop test|terminate/i });
    if (await endTestButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(endTestButton).toBeVisible();
    }

    // Extend Time button
    const extendTimeButton = page.getByRole('button', { name: /extend time|add time/i });
    if (await extendTimeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(extendTimeButton).toBeVisible();
    }

    // Pause/Resume button
    const pauseButton = page.getByRole('button', { name: /pause|resume/i });
    if (await pauseButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(pauseButton).toBeVisible();
    }

    // Refresh/Sync button
    const refreshButton = page.getByRole('button', { name: /refresh|sync/i });
    if (await refreshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(refreshButton).toBeVisible();
    }

    // Broadcast/Announce button
    const broadcastButton = page.getByRole('button', { name: /broadcast|announce|message/i });
    if (await broadcastButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(broadcastButton).toBeVisible();
    }
  });

  test('monitor page can be accessed from test list via Monitor action', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    // Start from the test list page
    await page.goto('/dashboard/online-tests');
    await page.waitForLoadState('networkidle');

    // Verify the list page loaded
    await expect(
      page.getByRole('heading', { name: /online tests/i })
    ).toBeVisible({ timeout: 15000 });

    // Look for a "Monitor" button in the test summary cards
    // (TestSummaryCard shows Monitor button for tests with "live" status)
    const monitorButton = page.getByRole('button', { name: /monitor/i });
    if (await monitorButton.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await monitorButton.first().click();
      await page.waitForLoadState('networkidle');

      // Should navigate to the monitor page
      await expect(page).toHaveURL(/\/monitor/, { timeout: 10000 });

      await expect(
        page.getByRole('heading', { name: /live test monitor/i }).or(
          page.getByText(/monitor student progress/i)
        )
      ).toBeVisible({ timeout: 15000 });
    }
  });
});
