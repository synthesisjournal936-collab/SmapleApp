import { test, expect } from '@playwright/test';

const login = async (page: any) => {
  const email = page.locator('#login-email');
  await email.waitFor({ state: 'visible', timeout: 15000 });
  await email.fill(process.env.APP_USERNAME ?? '');
  await page.locator('#login-password').fill(process.env.APP_PASSWORD ?? '');
  await page.locator('#login-submit-btn').click();
  await expect(page.getByTestId('app-container')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('login-card')).toBeHidden();
};

const companyRows = (page: any) => page.locator('#company-table-body tr[data-testid="company-row"]');
const openSearch = (page: any) => page.locator('#table-search-input');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('index.html', { waitUntil: 'domcontentloaded' });
});

test('POSITIVE: authenticated user views the companies list with existing entries', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  await expect(page.getByTestId('module-dashboard')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Company Directory' })).toBeVisible();
  await expect(page.getByTestId('company-table')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'Total Companies' }).last()).toContainText('3');
  await expect(companyRows(page)).toHaveCount(3);
  const first = companyRows(page).first();
  await expect(first.getByTestId('company-name-cell')).not.toBeEmpty();
  await expect(first.getByTestId('company-email-cell')).toContainText('@');
  await expect(first.getByTestId('company-phone-cell')).not.toBeEmpty();
  await expect(first.getByTestId('company-term-cell')).not.toBeEmpty();
  await expect(page.getByText('Apex AI Technologies')).toBeVisible();
  await expect(page.getByText('billing@quantumsys.com')).toBeVisible();
});

test('NEGATIVE: a search query matching no company is rejected and shows the empty state', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  await expect(companyRows(page)).toHaveCount(3);
  await openSearch(page).fill('zzz-no-such-company-zzz');
  await expect(companyRows(page)).toHaveCount(0);
  const empty = page.getByTestId('table-empty-message');
  await expect(empty).toBeVisible();
  await expect(empty).toContainText('No company records found');
});

test('BOUNDARY: a 300-character search query is handled without breaking the list view', async ({ page }) => {
  test.setTimeout(120000);
  await login(page);
  const longQuery = 'x'.repeat(300);
  await openSearch(page).fill(longQuery);
  await expect(openSearch(page)).toHaveValue(longQuery);
  await expect(companyRows(page)).toHaveCount(0);
  await expect(page.getByTestId('table-empty-message')).toBeVisible();
  await openSearch(page).fill('Apex');
  await expect(companyRows(page)).toHaveCount(1);
  await expect(companyRows(page).first().getByTestId('company-name-cell')).toHaveText('Apex AI Technologies');
});

test('SECURITY: a script payload in the search input stays inert and never executes', async ({ page }) => {
  test.setTimeout(120000);
  let dialogOpened = false;
  page.on('dialog', async (d) => { dialogOpened = true; await d.dismiss(); });
  await login(page);
  const payload = '<script>alert(1)</script>';
  await openSearch(page).fill(payload);
  await expect(companyRows(page)).toHaveCount(0);
  const empty = page.getByTestId('table-empty-message');
  await expect(empty).toBeVisible();
  await expect(empty).toContainText(payload);
  await expect(page.locator('#company-table-body script')).toHaveCount(0);
  expect(dialogOpened).toBe(false);
});

test('SECURITY: the companies list is not reachable while logged out', async ({ page }) => {
  await expect(page.getByTestId('login-card')).toBeVisible();
  await expect(page.getByTestId('app-container')).toBeHidden();
  await expect(page.getByTestId('module-dashboard')).toBeHidden();
  await expect(page.getByTestId('company-table')).toBeHidden();
  await expect(companyRows(page)).toHaveCount(0);
});