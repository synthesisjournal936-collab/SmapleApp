import { test, expect, type Page } from '@playwright/test';
const REQUIRED = ['company-name', 'company-email', 'company-phone', 'company-address1', 'company-country', 'company-pincode'];
const REQUIRED_MSG = 'Please fill in all required fields marked with *';
async function login(page: Page) {
await page.goto('index.html', { waitUntil: 'domcontentloaded' });
const email = page.locator('#login-email');
await email.waitFor({ state: 'visible', timeout: 15000 });
await email.fill(process.env.APP_USERNAME ?? '');
await page.locator('#login-password').fill(process.env.APP_PASSWORD ?? '');
await page.locator('#login-submit-btn').click();
await page.locator('#btn-add-company').waitFor({ state: 'visible', timeout: 15000 });
}
async function openForm(page: Page) {
await page.locator('#nav-dashboard').click();
await page.locator('#btn-add-company').click();
await page.locator('#company-name').waitFor({ state: 'visible', timeout: 15000 });
}
async function fillValid(page: Page, name: string) {
await page.locator('#company-name').fill(name);
await page.locator('#company-email').fill(`test.${Date.now()}@example.com`);
await page.locator('#company-phone').fill('+1 (555) 019-2834');
await page.locator('#company-address1').fill('123 Test Street');
await page.locator('#company-country').fill('United States');
await page.locator('#company-pincode').fill('94105');
}
async function submitForm(page: Page) { await page.locator('#btn-save-company').click(); }
test.beforeEach(async ({ page }) => { test.setTimeout(120000); await login(page); });
test('POSITIVE: a new company is created successfully with valid details', async ({ page }) => {
const name = `Acme Corp ${Date.now()}`;
test.info().annotations.push({ type: 'test-data', description: `company name: ${name}` });
await openForm(page);
await fillValid(page, name);
await submitForm(page);
await expect(page.locator('#toast-message')).toContainText(`Created company "${name}" successfully`);
await expect(page.locator('#module-company-form')).toBeHidden();
await expect(page.locator('#company-table-body tr[data-testid="company-row"]').first().locator('[data-testid="company-name-cell"]')).toHaveText(name);
});
test('NEGATIVE: submitting the company form with required fields empty is rejected', async ({ page }) => {
await openForm(page);
await submitForm(page);
const errorBanner = page.locator('#module-company-form').getByText(REQUIRED_MSG).first();
await expect(errorBanner).toBeVisible();
await expect(errorBanner).toHaveText(REQUIRED_MSG);
await expect(page.locator('#module-company-form')).toBeVisible();
});
test('VALIDATION: every required field is enforced with the required-fields message', async ({ page }) => {
await openForm(page);
for (const id of REQUIRED) {
await fillValid(page, `Field ${id} ${Date.now()}`);
await page.locator(`#${id}`).fill('');
await submitForm(page);
const errorBanner = page.locator('#module-company-form').getByText(REQUIRED_MSG).first();
await expect(errorBanner).toBeVisible();
await expect(errorBanner).toHaveText(REQUIRED_MSG);
await expect(page.locator('#module-company-form')).toBeVisible();
await page.locator('#btn-close-form').click();
await expect(page.locator('#module-company-form')).toBeHidden();
await openForm(page);
}
});
test('BOUNDARY: an extremely long company name is accepted and stored', async ({ page }) => {
const name = 'A'.repeat(400) + Date.now();
await openForm(page);
await fillValid(page, name);
await submitForm(page);
await expect(page.locator('#toast-message')).toContainText('Created company');
await expect(page.locator('#module-company-form')).toBeHidden();
await expect(page.locator('#company-table-body tr[data-testid="company-row"]').first().locator('[data-testid="company-name-cell"]')).toHaveText(name);
});
test('SECURITY: a script payload in the company name is stored and rendered as inert text', async ({ page }) => {
const dialogs: string[] = [];
page.on('dialog', async (d) => { dialogs.push(d.message()); await d.dismiss(); });
const payload = '<script>alert(1)</script>';
await openForm(page);
await fillValid(page, payload);
await submitForm(page);
await expect(page.locator('#module-company-form')).toBeHidden();
await expect(page.locator('#company-table-body tr[data-testid="company-row"]').first().locator('[data-testid="company-name-cell"]')).toHaveText(payload);
expect(await page.locator('#company-table-body script').count()).toBe(0);
expect(dialogs.length).toBe(0);
});
test('BOUNDARY: the Create Company button state reflects the real form behaviour', async ({ page }) => {
await openForm(page);
const btn = page.locator('#btn-save-company');
await expect(page.locator('#form-module-title')).toHaveText('Create New Company');
await expect(btn).toBeVisible();
await expect(btn).toBeEnabled();
await expect(btn).toContainText('Create Company');
await fillValid(page, `Button Check ${Date.now()}`);
await expect(btn).toBeEnabled();
await expect(btn).toContainText('Create Company');
});