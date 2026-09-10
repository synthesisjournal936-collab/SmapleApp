import { test, expect } from '@playwright/test';

const APP_URL = 'index.html';
const EMAIL_ERROR = 'Please enter a valid email address.';
const PASSWORD_ERROR = 'Please enter your password (minimum 3 characters).';
const fakeEmail = () => `test.${Date.now()}@example.com`;

async function login(page: any, email: string, password: string) {
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit-btn').click();
}

test.beforeEach(async ({ page }) => {
  test.setTimeout(60000);
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('login-card')).toBeVisible();
});

test('POSITIVE: Logging in with valid credentials reveals the authenticated app shell', async ({ page }) => {
  const username = (process.env.APP_USERNAME ?? '').trim();
  await login(page, username, process.env.APP_PASSWORD ?? '');
  await expect(page.getByTestId('app-container')).toBeVisible();
  await expect(page.getByTestId('login-card')).toBeHidden();
  await expect(page.locator('#header-user-email')).toHaveText(username);
  await expect(page.getByTestId('login-error')).toBeHidden();
  await expect(page.getByTestId('toast-notification')).toContainText('Signed in successfully');
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

test('NEGATIVE: Login is rejected when the password is shorter than the minimum length', async ({ page }) => {
  const email = fakeEmail();
  test.info().annotations.push({ type: 'test-data', description: `email: ${email}` });
  await login(page, email, 'ab');
  await expect(page.getByTestId('login-error')).toBeVisible();
  await expect(page.getByTestId('login-error')).toHaveText(PASSWORD_ERROR);
  await expect(page.getByTestId('app-container')).toBeHidden();
  await expect(page.getByTestId('login-card')).toBeVisible();
});

test('VALIDATION: Each required login field reports its own real message when left empty', async ({ page }) => {
  const validEmail = fakeEmail();
  test.info().annotations.push({ type: 'test-data', description: `email: ${validEmail}` });
  await expect(page.getByTestId('login-submit-btn')).toBeEnabled();
  const cases = [
    { field: 'Mail ID', email: '', password: 'validPass1', message: EMAIL_ERROR },
    { field: 'Password', email: validEmail, password: '', message: PASSWORD_ERROR },
  ];
  for (const c of cases) {
    await page.getByTestId('login-email').fill(c.email);
    await page.getByTestId('login-password').fill(c.password);
    await page.getByTestId('login-submit-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toHaveText(c.message);
    await expect(page.getByTestId('app-container')).toBeHidden();
    await expect(page.getByTestId('login-card')).toBeVisible();
    await expect(page.getByTestId('login-submit-btn')).toBeEnabled();
  }
});

test('BOUNDARY: Minimum-length password plus an extremely long Mail ID are both accepted', async ({ page }) => {
  const longEmail = `${'a'.repeat(180)}@example.com`;
  test.info().annotations.push({ type: 'test-data', description: `email: ${longEmail}` });
  await login(page, longEmail, 'abc');
  await expect(page.getByTestId('app-container')).toBeVisible();
  await expect(page.getByTestId('login-card')).toBeHidden();
  await expect(page.locator('#header-user-email')).toHaveText(longEmail);
  await expect(page.getByTestId('login-error')).toBeHidden();
  expect((await page.locator('#header-user-email').innerText()).length).toBe(longEmail.length);
});

test('SECURITY: Script payload stays inert and the app shell is gated while logged out', async ({ page }) => {
  let dialogFired = false;
  page.on('dialog', async (d) => { dialogFired = true; await d.dismiss(); });
  await expect(page.getByTestId('app-container')).toBeHidden();
  await expect(page.getByTestId('login-card')).toBeVisible();
  const payload = '<script>alert(1)</script>';
  await login(page, payload, 'FakePass123!');
  await expect(page.getByTestId('app-container')).toBeVisible();
  await page.waitForTimeout(300);
  expect(dialogFired).toBe(false);
  await expect(page.locator('#header-user-email')).toHaveText(payload);
  await expect(page.locator('script', { hasText: 'alert(1)' })).toHaveCount(0);
  expect(await page.locator('#header-user-email').innerHTML()).not.toContain('<script');
});