import { test, expect } from '@playwright/test';

test.describe('CWF Corporation E2E Public Pages Tests', () => {
  test('should successfully load the Home page, verify title and headers', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Verify page title
    await expect(page).toHaveTitle(/CWF Corporation | Waterproofing Consultation & Inspection Pune/i);

    // 3. Verify main header navigation is present
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 4. Verify link nodes
    await expect(page.locator('text=Home').first()).toBeVisible();
    await expect(page.locator('text=About').first()).toBeVisible();
    await expect(page.locator('text=Services').first()).toBeVisible();
    await expect(page.locator('text=Projects').first()).toBeVisible();
    await expect(page.locator('text=Blog').first()).toBeVisible();
    await expect(page.locator('text=Contact').first()).toBeVisible();
  });

  test('should navigate to the About page and load content', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText(/About CWF Corporation/i);
    await expect(page.locator('text=Our Engineering Consultants')).toBeVisible();
  });

  test('should load the Services page and check category rendering', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('h1')).toContainText(/Waterproofing Services/i);
    // Services are seeded in the database, expect some card to be rendered
    const serviceCard = page.locator('.bento-cell').first();
    await expect(serviceCard).toBeVisible();
  });

  test('should navigate to the Contact page and find the inquiry form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText(/Contact CWF Corporation/i);
    
    // Check form presence
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText(/Submit Audit Request/i);
  });
});
