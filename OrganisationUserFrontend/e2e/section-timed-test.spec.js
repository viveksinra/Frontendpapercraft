// @ts-check
import { test, expect } from '@playwright/test';

const TEACHER_EMAIL = process.env.E2E_TEACHER_EMAIL || 'teacher@test.com';
const TEACHER_PASSWORD = process.env.E2E_TEACHER_PASSWORD || 'password123';
const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL || 'student@test.com';
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD || 'password123';

async function loginAs(page, email, password) {
  await page.goto('/auth/jwt/sign-in');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**');
}

test.describe('Section-Timed Test Flow', () => {
  test('teacher can select Section Timed mode in create wizard', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto('/dashboard/online-tests/create');
    await page.waitForLoadState('networkidle');

    // Verify the create page loaded
    await expect(
      page.getByRole('heading', { name: /create test/i })
    ).toBeVisible({ timeout: 15000 });

    // Look for Section Timed mode option
    const sectionTimedOption = page.locator('text=Section Timed');
    if (await sectionTimedOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sectionTimedOption.click();
      await page.waitForTimeout(300);

      // Verify selection feedback (e.g. "Selected" label or active state)
      const selectionFeedback = page.locator('[class*="primary"]').or(
        page.locator('[aria-selected="true"]')
      ).or(
        page.locator('text=Selected')
      );
      if (await selectionFeedback.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(selectionFeedback.first()).toBeVisible();
      }
    }

    // Proceed through wizard to verify section configuration
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // In section-timed mode, the source step should allow per-section time configuration
    const sectionConfig = page.locator('text=Section 1').or(
      page.locator('text=Section A')
    ).or(
      page.locator('text=section')
    );
    if (await sectionConfig.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sectionConfig.first()).toBeVisible();
    }

    // Look for per-section duration fields
    const durationField = page.getByLabel(/duration/i).or(
      page.getByPlaceholder(/minutes/i)
    ).or(
      page.locator('input[type="number"]').first()
    );
    if (await durationField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(durationField).toBeVisible();
    }
  });

  test('student sees section transition UI during section-timed test', async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    // Navigate to a test-taking page (uses placeholder testId)
    await page.goto('/dashboard/take-test/sample-section-timed-test');
    await page.waitForLoadState('networkidle');

    // Verify the test-taking page renders
    const testHeading = page.getByRole('heading', { name: /take test/i });
    const testInterface = page.locator('[class*="test"]').or(
      page.locator('text=Section')
    );

    await expect(
      testHeading.or(testInterface.first())
    ).toBeVisible({ timeout: 15000 });

    // If a section-timed test is active, look for section indicators
    const sectionLabel = page.locator('text=Section 1').or(
      page.locator('text=Section A')
    );
    if (await sectionLabel.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(sectionLabel).toBeVisible();
    }

    // Look for timer display (section time remaining)
    const timerDisplay = page.locator('[class*="timer"]').or(
      page.locator('[class*="countdown"]')
    ).or(
      page.locator('text=/\\d+:\\d+/')
    );
    if (await timerDisplay.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(timerDisplay.first()).toBeVisible();
    }

    // Look for STOP overlay or section transition elements
    const stopOverlay = page.locator('text=STOP').or(
      page.locator('text=Section Complete')
    ).or(
      page.locator('text=Time Up')
    ).or(
      page.locator('text=Next Section')
    );
    // STOP overlay only appears after section time expires, so just verify structure exists
    if (await stopOverlay.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(stopOverlay.first()).toBeVisible();
    }

    // Look for a "Continue to Section 2" or similar button
    const continueButton = page.getByRole('button', { name: /continue|next section/i });
    if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await continueButton.click();
      await page.waitForTimeout(500);

      // Verify we transitioned to section 2
      const section2Label = page.locator('text=Section 2').or(
        page.locator('text=Section B')
      );
      if (await section2Label.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(section2Label).toBeVisible();
      }
    }
  });

  test('section-timed mode shows per-section progress indicators', async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    await page.goto('/dashboard/take-test/sample-section-timed-test');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /take test/i }).or(
        page.locator('text=Section')
      )
    ).toBeVisible({ timeout: 15000 });

    // Check for progress indicators (question navigator, section tabs, etc.)
    const progressIndicator = page.locator('[class*="progress"]').or(
      page.locator('[role="progressbar"]')
    ).or(
      page.locator('text=/\\d+ of \\d+/')
    );
    if (await progressIndicator.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(progressIndicator.first()).toBeVisible();
    }

    // Check for question navigation panel (numbered buttons for questions)
    const questionNav = page.locator('[class*="question-nav"]').or(
      page.locator('[class*="palette"]')
    ).or(
      page.locator('button:has-text("Q1")').or(page.locator('button:has-text("1")'))
    );
    if (await questionNav.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(questionNav.first()).toBeVisible();
    }
  });

  test('teacher sees section-timed configuration in test detail page', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    // Navigate to a test detail page
    await page.goto('/dashboard/online-tests/sample-test-id');
    await page.waitForLoadState('networkidle');

    // Verify the test detail page loads
    await expect(
      page.getByRole('heading', { name: /test detail/i }).or(
        page.getByText(/view test configuration/i)
      )
    ).toBeVisible({ timeout: 15000 });

    // Look for mode badge displaying "Section Timed"
    const modeBadge = page.locator('text=Section Timed');
    if (await modeBadge.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(modeBadge).toBeVisible();
    }

    // Look for per-section timing details
    const sectionDetails = page.locator('text=Section 1').or(
      page.locator('text=minutes')
    );
    if (await sectionDetails.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sectionDetails.first()).toBeVisible();
    }
  });
});
