import { test, expect } from '@playwright/test';

test.describe('CWF Consulting Corporation E2E Public Pages Tests', () => {
  test('should successfully load the Home gateway, verify title and segment cards', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Verify page title matches corporate parent branding
    await expect(page).toHaveTitle(/CWF Consulting Corporation/i);

    // 3. Verify main header navigation is present
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 4. Verify link nodes
    await expect(page.locator('text=About').first()).toBeVisible();
    await expect(page.locator('text=Services').first()).toBeVisible();
    await expect(page.locator('text=Contact').first()).toBeVisible();

    // 5. Verify three segment bento panels are present
    const civilLink = page.locator('a[href="/civil"]').first();
    const webLink = page.locator('a[href="/web"]').first();
    const financeLink = page.locator('a[href="/finance"]').first();
    await expect(civilLink).toBeVisible();
    await expect(webLink).toBeVisible();
    await expect(financeLink).toBeVisible();
  });

  test('should navigate to the Civil segment landing page and load content', async ({ page }) => {
    await page.goto('/civil');
    await expect(page.locator('h1')).toContainText(/PROTECT • REPAIR • TRANSFORM/i);
    await expect(page.locator('text=Civil Consulting').first()).toBeVisible();
  });

  test('should navigate to the Web segment landing page and load content', async ({ page }) => {
    await page.goto('/web');
    await expect(page.locator('h1')).toContainText(/CONNECT • DIGITALIZE • GROW/i);
    await expect(page.locator('text=Digital Solutions').first()).toBeVisible();
  });

  test('should navigate to the Finance segment landing page and load content', async ({ page }) => {
    await page.goto('/finance');
    await expect(page.locator('h1')).toContainText(/PLAN • PROTECT • PROSPER/i);
    await expect(page.locator('text=Financial & Wealth Solutions').first()).toBeVisible();
  });

  test('should redirect old routes correctly', async ({ page }) => {
    // Navigate to old services route
    await page.goto('/services');
    await expect(page).toHaveURL(/\/civil\/services/);

    // Navigate to old projects route
    await page.goto('/projects');
    await expect(page).toHaveURL(/\/civil\/projects/);

    // Navigate to old blog route
    await page.goto('/blog');
    await expect(page).toHaveURL(/\/civil\/blog/);
  });
});
