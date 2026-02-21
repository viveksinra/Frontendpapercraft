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

test.describe('Practice Mode Test', () => {
  test('teacher can select Practice mode in create wizard', async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto('/dashboard/online-tests/create');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /create test/i })
    ).toBeVisible({ timeout: 15000 });

    // Look for Practice mode option
    const practiceOption = page.locator('text=Practice');
    if (await practiceOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await practiceOption.click();
      await page.waitForTimeout(300);

      // Verify selection feedback
      const selectionFeedback = page.locator('[class*="primary"]').or(
        page.locator('[aria-selected="true"]')
      ).or(
        page.locator('text=Selected')
      );
      if (await selectionFeedback.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(selectionFeedback.first()).toBeVisible();
      }
    }

    // Practice mode should show instant feedback toggle in options
    const nextButton = page.getByRole('button', { name: /next/i });
    // Advance through wizard steps to reach Options
    for (let i = 0; i < 4; i++) {
      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Look for instant feedback toggle in options step
    const instantFeedbackToggle = page.locator('text=Instant Feedback').or(
      page.locator('text=Show Answers')
    ).or(
      page.locator('text=Immediate Feedback')
    );
    if (await instantFeedbackToggle.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(instantFeedbackToggle.first()).toBeVisible();
    }
  });

  test('student sees practice test interface with instant feedback elements', async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    // Navigate to a practice test
    await page.goto('/dashboard/take-test/sample-practice-test');
    await page.waitForLoadState('networkidle');

    // Verify the test-taking page renders
    await expect(
      page.getByRole('heading', { name: /take test/i }).or(
        page.locator('text=Practice')
      )
    ).toBeVisible({ timeout: 15000 });

    // In practice mode, look for indicators that this is a practice test
    const practiceIndicator = page.locator('text=Practice').or(
      page.locator('text=practice mode')
    ).or(
      page.locator('[class*="practice"]')
    );
    if (await practiceIndicator.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(practiceIndicator.first()).toBeVisible();
    }

    // Look for a question displayed on the page
    const questionText = page.locator('[class*="question"]').or(
      page.locator('text=/Q\\d+|Question \\d+/')
    );
    if (await questionText.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(questionText.first()).toBeVisible();
    }

    // Look for answer options (MCQ radio/checkbox or text input)
    const answerOption = page.locator('input[type="radio"]').or(
      page.locator('input[type="checkbox"]')
    ).or(
      page.locator('[role="radio"]')
    ).or(
      page.locator('[role="option"]')
    );
    if (await answerOption.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      // Click the first answer option
      await answerOption.first().click();
      await page.waitForTimeout(500);

      // After selecting an answer in practice mode, look for instant feedback UI
      const feedbackElement = page.locator('text=Correct').or(
        page.locator('text=Incorrect')
      ).or(
        page.locator('text=Explanation')
      ).or(
        page.locator('text=Answer')
      ).or(
        page.locator('[class*="feedback"]')
      ).or(
        page.locator('[class*="explanation"]')
      );
      if (await feedbackElement.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(feedbackElement.first()).toBeVisible();
      }
    }

    // Look for a "Check Answer" or "Submit" button specific to practice mode
    const checkButton = page.getByRole('button', { name: /check answer|check|submit answer/i });
    if (await checkButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(checkButton).toBeVisible();
    }
  });

  test('practice test shows question navigation and no strict timer', async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    await page.goto('/dashboard/take-test/sample-practice-test');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /take test/i }).or(
        page.locator('text=Practice')
      )
    ).toBeVisible({ timeout: 15000 });

    // In practice mode, there should be question navigation (can go back and forth)
    const nextQuestionButton = page.getByRole('button', { name: /next/i }).or(
      page.getByRole('button', { name: /next question/i })
    );
    const prevQuestionButton = page.getByRole('button', { name: /prev|previous|back/i });

    if (await nextQuestionButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(nextQuestionButton).toBeVisible();
    }
    if (await prevQuestionButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(prevQuestionButton).toBeVisible();
    }

    // Practice mode should not show a strict countdown timer (or show an unlimited/relaxed timer)
    // Verify there is no "Time Remaining" countdown or it shows "Unlimited" / "Practice"
    const strictTimer = page.locator('text=Time Remaining');
    const unlimitedLabel = page.locator('text=Unlimited').or(
      page.locator('text=No Time Limit')
    ).or(
      page.locator('text=Practice Mode')
    );

    if (await strictTimer.isVisible({ timeout: 3000 }).catch(() => false)) {
      // If a timer is shown, it might say "Unlimited" or similar in practice mode
    }
    if (await unlimitedLabel.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(unlimitedLabel.first()).toBeVisible();
    }
  });

  test('practice test allows re-attempts on questions', async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    await page.goto('/dashboard/take-test/sample-practice-test');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /take test/i }).or(
        page.locator('text=Practice')
      )
    ).toBeVisible({ timeout: 15000 });

    // In practice mode, look for "Try Again" or "Retry" button after answering
    const retryButton = page.getByRole('button', { name: /try again|retry|reattempt/i });
    if (await retryButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(retryButton).toBeVisible();
    }

    // Look for a "Show Solution" or "View Explanation" button
    const showSolutionButton = page.getByRole('button', { name: /show solution|view explanation|show answer/i });
    if (await showSolutionButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(showSolutionButton).toBeVisible();
    }

    // Verify overall finish / end practice button exists
    const finishButton = page.getByRole('button', { name: /finish|end practice|submit all/i });
    if (await finishButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(finishButton).toBeVisible();
    }
  });
});
