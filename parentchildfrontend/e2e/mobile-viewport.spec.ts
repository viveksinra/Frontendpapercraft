import { test, expect, type Page } from '@playwright/test';

/**
 * Mobile viewport tests:
 *   1. Set viewport to 375x667 (iPhone SE)
 *   2. Login as student
 *   3. Verify bottom navigation is visible
 *   4. Tap each nav item and verify page changes
 */

const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL || 'student@test.com';
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD || 'password123';
const PARENT_EMAIL = process.env.E2E_PARENT_EMAIL || 'parent@test.com';
const PARENT_PASSWORD = process.env.E2E_PARENT_PASSWORD || 'password123';

// iPhone SE viewport dimensions
const MOBILE_VIEWPORT = { width: 375, height: 667 };

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

test.describe('Mobile Viewport - Student Bottom Navigation', () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page);
  });

  test('bottom navigation is visible on mobile', async ({ page }) => {
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // MobileBottomNav renders a <nav> with "fixed inset-x-0 bottom-0" and "md:hidden"
    // At 375px width, it should be visible (below md breakpoint of 768px)
    const bottomNav = page.locator('nav.fixed');
    await expect(bottomNav).toBeVisible({ timeout: 10000 });

    // Verify all mobile nav items are visible
    // StudentLayout defines: Home, Tests, Results, Progress, Profile
    await expect(page.locator('nav.fixed').getByText('Home')).toBeVisible();
    await expect(page.locator('nav.fixed').getByText('Tests')).toBeVisible();
    await expect(page.locator('nav.fixed').getByText('Results')).toBeVisible();
    await expect(page.locator('nav.fixed').getByText('Progress')).toBeVisible();
    await expect(page.locator('nav.fixed').getByText('Profile')).toBeVisible();
  });

  test('tapping Home nav item navigates to dashboard', async ({ page }) => {
    // Start from a different page
    await page.goto('/student/tests');
    await page.waitForLoadState('networkidle');

    // Tap "Home" in the bottom nav
    const homeLink = page.locator('nav.fixed').getByText('Home');
    await expect(homeLink).toBeVisible();
    await homeLink.click();

    await page.waitForURL('**/student/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/\/student\/dashboard/);
  });

  test('tapping Tests nav item navigates to tests page', async ({ page }) => {
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // Tap "Tests" in the bottom nav
    const testsLink = page.locator('nav.fixed').getByText('Tests');
    await expect(testsLink).toBeVisible();
    await testsLink.click();

    await page.waitForURL('**/student/tests', { timeout: 10000 });
    await expect(page).toHaveURL(/\/student\/tests/);

    // Verify the tests page loaded
    await expect(
      page.getByRole('heading', { name: /my tests/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test('tapping Results nav item navigates to results page', async ({ page }) => {
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // Tap "Results" in the bottom nav
    const resultsLink = page.locator('nav.fixed').getByText('Results');
    await expect(resultsLink).toBeVisible();
    await resultsLink.click();

    await page.waitForURL('**/student/results', { timeout: 10000 });
    await expect(page).toHaveURL(/\/student\/results/);
  });

  test('tapping Progress nav item navigates to performance page', async ({ page }) => {
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // Tap "Progress" in the bottom nav
    const progressLink = page.locator('nav.fixed').getByText('Progress');
    await expect(progressLink).toBeVisible();
    await progressLink.click();

    await page.waitForURL('**/student/performance', { timeout: 10000 });
    await expect(page).toHaveURL(/\/student\/performance/);

    // Verify performance page loaded
    await expect(
      page.getByRole('heading', { name: /performance/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test('tapping Profile nav item navigates to profile page', async ({ page }) => {
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // Tap "Profile" in the bottom nav
    const profileLink = page.locator('nav.fixed').getByText('Profile');
    await expect(profileLink).toBeVisible();
    await profileLink.click();

    await page.waitForURL('**/student/profile', { timeout: 10000 });
    await expect(page).toHaveURL(/\/student\/profile/);
  });

  test('active nav item is highlighted', async ({ page }) => {
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // The active nav item should have "text-primary" class
    // Home should be active when on /student/dashboard
    const homeLink = page.locator('nav.fixed a[href="/student/dashboard"]');
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveClass(/text-primary/);

    // Navigate to tests and verify Tests link becomes active
    await page.locator('nav.fixed').getByText('Tests').click();
    await page.waitForURL('**/student/tests', { timeout: 10000 });

    const testsLink = page.locator('nav.fixed a[href="/student/tests"]');
    await expect(testsLink).toHaveClass(/text-primary/);
  });

  test('desktop sidebar is hidden on mobile viewport', async ({ page }) => {
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');

    // The Sidebar component should be hidden at mobile width (md:hidden behavior)
    // The sidebar typically has "hidden md:flex" or similar responsive classes
    const sidebar = page.locator('aside').first();
    if (await sidebar.count() > 0) {
      // Sidebar element might exist but should not be visible at mobile width
      const isVisible = await sidebar.isVisible().catch(() => false);
      if (isVisible) {
        // If it's visible, it might be the mobile sheet-style sidebar
        // The main persistent sidebar should be hidden
        const box = await sidebar.boundingBox();
        if (box) {
          // At 375px, a sidebar would overflow. Check if it's offscreen or zero-width.
          expect(box.width).toBeLessThanOrEqual(0);
        }
      }
    }
  });
});

test.describe('Mobile Viewport - Parent Bottom Navigation', () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await loginAsParent(page);
  });

  test('parent bottom navigation is visible on mobile', async ({ page }) => {
    await page.goto('/parent/dashboard');
    await page.waitForLoadState('networkidle');

    const bottomNav = page.locator('nav.fixed');
    await expect(bottomNav).toBeVisible({ timeout: 10000 });

    // ParentLayout defines mobile nav: Home, Children, Profile
    await expect(page.locator('nav.fixed').getByText('Home')).toBeVisible();
    await expect(page.locator('nav.fixed').getByText('Children')).toBeVisible();
    await expect(page.locator('nav.fixed').getByText('Profile')).toBeVisible();
  });

  test('parent can navigate between pages using bottom nav', async ({ page }) => {
    await page.goto('/parent/dashboard');
    await page.waitForLoadState('networkidle');

    // Tap "Children"
    const childrenLink = page.locator('nav.fixed').getByText('Children');
    await expect(childrenLink).toBeVisible();
    await childrenLink.click();

    await page.waitForURL('**/children', { timeout: 10000 });
    await expect(page).toHaveURL(/\/children/);

    // Tap "Home" to go back
    const homeLink = page.locator('nav.fixed').getByText('Home');
    await homeLink.click();

    await page.waitForURL('**/parent/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/\/parent\/dashboard/);

    // Tap "Profile"
    const profileLink = page.locator('nav.fixed').getByText('Profile');
    await profileLink.click();

    await page.waitForURL('**/profile', { timeout: 10000 });
    await expect(page).toHaveURL(/\/profile/);
  });
});

test.describe('Mobile Viewport - Auth Pages', () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test('student login form renders properly on mobile', async ({ page }) => {
    await page.goto('/auth/student/login');
    await page.waitForLoadState('networkidle');

    // Verify heading is visible
    await expect(
      page.getByRole('heading', { name: /student sign in/i })
    ).toBeVisible({ timeout: 15000 });

    // Verify form inputs are visible and usable
    const emailInput = page.locator('input#email');
    const passwordInput = page.locator('input#password');
    const submitButton = page.getByRole('button', { name: /sign in/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Verify the card fits within the mobile viewport (no horizontal scroll)
    const emailBox = await emailInput.boundingBox();
    expect(emailBox).toBeTruthy();
    if (emailBox) {
      expect(emailBox.x).toBeGreaterThanOrEqual(0);
      expect(emailBox.x + emailBox.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
    }
  });

  test('student signup form renders properly on mobile', async ({ page }) => {
    await page.goto('/auth/student/signup');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /student sign up/i })
    ).toBeVisible({ timeout: 15000 });

    // All form fields should be visible and within viewport
    const orgCodeInput = page.getByPlaceholder('ORG CODE');
    const nameInput = page.locator('input#name');
    const emailInput = page.locator('input#email');
    const passwordInput = page.locator('input#password');

    await expect(orgCodeInput).toBeVisible();
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();

    // Password might need scrolling on small screens - verify it exists
    await passwordInput.scrollIntoViewIfNeeded();
    await expect(passwordInput).toBeVisible();
  });
});
