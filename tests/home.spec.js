// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('首頁', () => {
  test('載入並顯示三個難度按鈕', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/蜂勤耘友配對消消樂/);
    await expect(page.locator('a.difficulty-btn').filter({ hasText: '初階' })).toBeVisible();
    await expect(page.locator('a.difficulty-btn').filter({ hasText: '中階' })).toBeVisible();
    await expect(page.locator('a.difficulty-btn').filter({ hasText: '高階' })).toBeVisible();
  });

  test('主題選單包含所有 6 個主題', async ({ page }) => {
    await page.goto('/');
    const options = page.locator('#theme-select option');
    await expect(options).toHaveCount(6);
    const values = await options.evaluateAll((els) => els.map(e => e.getAttribute('value')));
    expect(values).toEqual(expect.arrayContaining(['bees', 'zhuyin', 'vocab-en', 'numbers-en', 'fruits-en', 'tang-poetry']));
  });

  test('切換主題會改寫難度按鈕的 href', async ({ page }) => {
    await page.goto('/');
    await page.locator('#theme-select').selectOption('zhuyin');
    const href = await page.locator('a.difficulty-btn').first().getAttribute('href');
    expect(href).toContain('theme=zhuyin');
  });

  test('阿凱老師頁尾署名存在且連到學校頁', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('.site-credit__author');
    await expect(link).toContainText('阿凱老師');
    await expect(link).toHaveAttribute('href', /smes\.tyc\.edu\.tw/);
  });
});
