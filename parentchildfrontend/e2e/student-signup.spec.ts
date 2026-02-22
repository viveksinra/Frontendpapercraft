import { test, expect } from '@playwright/test';

/**
 * Student signup flow:
 *   1. Visit /auth/student/signup
 *   2. Fill in org code, name, email, password, year group
 *   3. Submit form
 *   4. Verify student code is displayed
 *   5. Click "Go to Dashboard"
 *   6. Verify dashboard loads
 */

const TEST_ORG_CODE = process.env.E2E_ORG_CODE || 'TESTORG';
const TEST_STUDENT_NAME = 'E2E Test Student';
const TEST_STUDENT_EMAIL = `e2e-student-${Date.now()}@test.com`;
const TEST_STUDENT_PASSWORD = 'TestPass123';

test.describe('Student Signup Flow', () => {
  test('student can sign up with org code and see student code display', async ({ page }) => {
    // Step 1: Navigate to student signup page
    await page.goto('/auth/student/signup');
    await page.waitForLoadState('networkidle');

    // Verify the signup form is visible
    await expect(
      page.getByRole('heading', { name: /student sign up/i })
    ).toBeVisible({ timeout: 15000 });

    // Step 2: Fill in organization code
    // The OrgCodeInput uses a plain input with placeholder "ORG CODE"
    const orgCodeInput = page.getByPlaceholder('ORG CODE');
    await expect(orgCodeInput).toBeVisible();
    await orgCodeInput.fill(TEST_ORG_CODE);

    // Step 3: Fill in full name
    const nameInput = page.locator('input#name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(TEST_STUDENT_NAME);

    // Step 4: Fill in email
    const emailInput = page.locator('input#email');
    await expect(emailInput).toBeVisible();
    await emailInput.fill(TEST_STUDENT_EMAIL);

    // Step 5: Fill in password
    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(TEST_STUDENT_PASSWORD);

    // Step 6: Select year group using the Radix Select component
    const yearGroupTrigger = page.getByRole('combobox');
    await expect(yearGroupTrigger).toBeVisible();
    await yearGroupTrigger.click();

    // Wait for dropdown content to appear and select "Year 5"
    const yearOption = page.getByRole('option', { name: /year 5/i });
    await expect(yearOption).toBeVisible({ timeout: 5000 });
    await yearOption.click();

    // Step 7: Submit the form
    const submitButton = page.getByRole('button', { name: /create student account/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Step 8: Verify student code display screen appears
    await expect(
      page.getByRole('heading', { name: /registration complete/i })
    ).toBeVisible({ timeout: 15000 });

    // Verify the student code text is shown
    await expect(
      page.getByText(/your student code/i)
    ).toBeVisible();

    // Verify the code value is displayed (a mono-spaced code string)
    const codeDisplay = page.locator('.font-mono.text-3xl');
    await expect(codeDisplay).toBeVisible();
    const codeText = await codeDisplay.textContent();
    expect(codeText).toBeTruthy();
    expect(codeText!.trim().length).toBeGreaterThan(0);

    // Verify copy button is present
    await expect(
      page.getByRole('button', { name: /copy code/i })
    ).toBeVisible();

    // Step 9: Click "Go to Dashboard"
    const dashboardLink = page.getByRole('link', { name: /go to dashboard/i });
    await expect(dashboardLink).toBeVisible();
    await dashboardLink.click();

    // Step 10: Verify dashboard loads
    await page.waitForURL('**/student/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/dashboard/);
  });

  test('signup form shows validation errors for empty fields', async ({ page }) => {
    await page.goto('/auth/student/signup');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /student sign up/i })
    ).toBeVisible({ timeout: 15000 });

    // Click submit without filling any fields
    const submitButton = page.getByRole('button', { name: /create student account/i });
    await submitButton.click();

    // Verify validation error messages appear
    // The form uses zod validation so errors should display below fields
    await expect(
      page.getByText(/organization code must be at least/i)
        .or(page.getByText(/full name must be at least/i))
        .or(page.getByText(/please enter a valid email/i))
    ).toBeVisible({ timeout: 5000 });
  });

  test('signup page has link to sign in and parent signup', async ({ page }) => {
    await page.goto('/auth/student/signup');
    await page.waitForLoadState('networkidle');

    // Verify "Already have an account?" link
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/auth/student/login');

    // Verify "Register as Parent" link
    const parentLink = page.getByRole('link', { name: /register as parent/i });
    await expect(parentLink).toBeVisible();
    await expect(parentLink).toHaveAttribute('href', '/auth/parent/signup');
  });
});
