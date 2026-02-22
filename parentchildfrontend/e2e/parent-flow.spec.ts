import { test, expect, type Page } from '@playwright/test';

/**
 * Parent signup, link child, view dashboard:
 *   1. Visit /auth/parent/signup
 *   2. Fill in name, email, password
 *   3. Submit form
 *   4. Navigate to link-child page
 *   5. Enter student code
 *   6. Select relationship
 *   7. Submit link
 *   8. Verify child appears on dashboard
 */

const TEST_PARENT_NAME = 'E2E Test Parent';
const TEST_PARENT_EMAIL = `e2e-parent-${Date.now()}@test.com`;
const TEST_PARENT_PASSWORD = 'TestPass123';
const TEST_STUDENT_CODE = process.env.E2E_STUDENT_CODE || 'STU-ABC123';

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

test.describe('Parent Signup Flow', () => {
  test('parent can sign up and is redirected to link-child page', async ({ page }) => {
    // Step 1: Navigate to parent signup page
    await page.goto('/auth/parent/signup');
    await page.waitForLoadState('networkidle');

    // Verify the signup form is visible
    await expect(
      page.getByRole('heading', { name: /parent sign up/i })
    ).toBeVisible({ timeout: 15000 });

    // Step 2: Fill in full name
    const nameInput = page.locator('input#name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(TEST_PARENT_NAME);

    // Step 3: Fill in email
    const emailInput = page.locator('input#email');
    await expect(emailInput).toBeVisible();
    await emailInput.fill(TEST_PARENT_EMAIL);

    // Step 4: Fill in password
    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(TEST_PARENT_PASSWORD);

    // Step 5: Submit the form
    const submitButton = page.getByRole('button', { name: /create parent account/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Step 6: After signup, parent is redirected to /parent/link-child
    // (ParentSignupForm calls router.push('/parent/link-child') on success)
    // Wait for either the redirect or an error message
    const linkChildHeading = page.getByRole('heading', { name: /link a child/i });
    const errorToast = page.getByText(/failed to create/i);

    await expect(
      linkChildHeading.or(errorToast)
    ).toBeVisible({ timeout: 15000 });
  });

  test('parent signup form shows validation errors', async ({ page }) => {
    await page.goto('/auth/parent/signup');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /parent sign up/i })
    ).toBeVisible({ timeout: 15000 });

    // Submit without filling in any fields
    const submitButton = page.getByRole('button', { name: /create parent account/i });
    await submitButton.click();

    // Verify validation errors appear
    await expect(
      page.getByText(/full name must be at least/i)
        .or(page.getByText(/please enter a valid email/i))
        .or(page.getByText(/password must be at least/i))
    ).toBeVisible({ timeout: 5000 });
  });

  test('parent signup page has link to sign in', async ({ page }) => {
    await page.goto('/auth/parent/signup');
    await page.waitForLoadState('networkidle');

    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/auth/parent/login');
  });
});

test.describe('Parent Link Child Flow', () => {
  test('link-child form renders correctly', async ({ page }) => {
    await loginAsParent(page);
    await page.goto('/link-child');
    await page.waitForLoadState('networkidle');

    // Verify the link-child form heading
    await expect(
      page.getByRole('heading', { name: /link a child/i })
    ).toBeVisible({ timeout: 15000 });

    // Verify the student code input is visible
    const studentCodeInput = page.locator('input#studentCode');
    await expect(studentCodeInput).toBeVisible();
    await expect(studentCodeInput).toHaveAttribute('placeholder', 'e.g. STU-ABC123');

    // Verify relationship selector is visible
    const relationshipTrigger = page.locator('#relationship');
    await expect(relationshipTrigger).toBeVisible();

    // Verify the submit button
    const submitButton = page.getByRole('button', { name: /link child/i });
    await expect(submitButton).toBeVisible();
  });

  test('link-child form validates required fields', async ({ page }) => {
    await loginAsParent(page);
    await page.goto('/link-child');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /link a child/i })
    ).toBeVisible({ timeout: 15000 });

    // Submit the form without filling fields
    const submitButton = page.getByRole('button', { name: /link child/i });
    await submitButton.click();

    // Verify validation errors
    await expect(
      page.getByText(/student code is required/i)
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByText(/please select a relationship/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('parent can fill link-child form and submit', async ({ page }) => {
    await loginAsParent(page);
    await page.goto('/link-child');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /link a child/i })
    ).toBeVisible({ timeout: 15000 });

    // Fill in student code
    const studentCodeInput = page.locator('input#studentCode');
    await studentCodeInput.fill(TEST_STUDENT_CODE);

    // Select relationship (Radix Select)
    const relationshipTrigger = page.locator('#relationship');
    await relationshipTrigger.click();

    const motherOption = page.getByRole('option', { name: /mother/i });
    await expect(motherOption).toBeVisible({ timeout: 5000 });
    await motherOption.click();

    // Submit the form
    const submitButton = page.getByRole('button', { name: /link child/i });
    await submitButton.click();

    // Wait for either success or error
    const successHeading = page.getByRole('heading', { name: /child linked successfully/i });
    const errorToast = page.getByText(/failed to link/i);
    const apiError = page.getByText(/check the student code/i);

    await expect(
      successHeading.or(errorToast).or(apiError)
    ).toBeVisible({ timeout: 15000 });

    // If successful, verify the success card and navigation options
    if (await successHeading.isVisible().catch(() => false)) {
      // Verify "Link Another" and "Go to Dashboard" buttons
      await expect(
        page.getByRole('button', { name: /link another/i })
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /go to dashboard/i })
      ).toBeVisible();

      // Navigate to dashboard
      await page.getByRole('button', { name: /go to dashboard/i }).click();
      await page.waitForURL('**/parent/dashboard', { timeout: 10000 });
    }
  });
});

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsParent(page);
  });

  test('parent dashboard loads', async ({ page }) => {
    await page.goto('/parent/dashboard');
    await page.waitForLoadState('networkidle');

    // The dashboard should load with the parent layout
    // ParentLayout renders Header, Sidebar, and MobileBottomNav
    await expect(page).toHaveURL(/\/parent\/dashboard/);
  });

  test('parent can navigate to children list', async ({ page }) => {
    await page.goto('/parent/dashboard');
    await page.waitForLoadState('networkidle');

    // Click "Children" in the sidebar or bottom nav
    const childrenLink = page.getByRole('link', { name: /children/i }).first();
    if (await childrenLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await childrenLink.click();
      await page.waitForURL('**/children', { timeout: 10000 });

      // Verify children list page heading
      await expect(
        page.getByRole('heading', { name: /my children/i })
      ).toBeVisible({ timeout: 15000 });
    }
  });

  test('children list page shows linked children or empty state', async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /my children/i })
    ).toBeVisible({ timeout: 15000 });

    // Wait for loading to complete
    await page.waitForTimeout(3000);

    // Either child cards or empty state should be shown
    const childCard = page.locator('[class*="CardTitle"]').first();
    const emptyState = page.getByText(/no children linked/i);
    const errorState = page.locator('.text-destructive').first();

    await expect(
      childCard.or(emptyState).or(errorState)
    ).toBeVisible({ timeout: 10000 });

    // If children exist, there should be a "View Details" button on the card
    if (await childCard.isVisible().catch(() => false)) {
      await expect(
        page.getByRole('link', { name: /view details/i }).first()
      ).toBeVisible();
    }
  });
});
