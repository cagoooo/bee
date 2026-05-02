// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('遊戲頁', () => {
  test('初階載入後出現 20 張卡片', async ({ page }) => {
    await page.goto('/beginner.html');
    await expect(page.locator('.card')).toHaveCount(20);
    await expect(page.locator('#score')).toContainText('配對成功: 0');
    await expect(page.locator('#moves')).toContainText('移動次數: 0');
    await expect(page.locator('#timer')).toContainText('時間: 00:00');
  });

  test('切到注音主題渲染為文字卡', async ({ page }) => {
    await page.goto('/beginner.html?theme=zhuyin');
    await expect(page.locator('.card')).toHaveCount(10);
    await expect(page.locator('.theme-badge')).toContainText('注音符號配對');
    const textCards = page.locator('.card .front.card-face--text');
    await expect(textCards).toHaveCount(10);
  });

  test('翻同對的兩張卡會配對成功', async ({ page }) => {
    await page.goto('/beginner.html?theme=zhuyin');
    await page.waitForSelector('.card');
    const cards = page.locator('.card');
    const pairIds = await cards.evaluateAll((els) => els.map(e => e.dataset.pairId));
    const idx0 = pairIds.indexOf('0');
    const idx1 = pairIds.indexOf('0', idx0 + 1);
    expect(idx0).toBeGreaterThanOrEqual(0);
    expect(idx1).toBeGreaterThan(idx0);
    await cards.nth(idx0).click();
    await cards.nth(idx1).click();
    await expect(cards.nth(idx0)).toHaveClass(/matched/, { timeout: 2000 });
    await expect(cards.nth(idx1)).toHaveClass(/matched/);
    await expect(page.locator('#score')).toContainText('配對成功: 1');
  });

  test('翻不同對的兩張會回復未翻開', async ({ page }) => {
    await page.goto('/beginner.html?theme=zhuyin');
    await page.waitForSelector('.card');
    const cards = page.locator('.card');
    const pairIds = await cards.evaluateAll((els) => els.map(e => e.dataset.pairId));
    const idxA = pairIds.indexOf('0');
    const idxB = pairIds.indexOf('1');
    await cards.nth(idxA).click();
    await cards.nth(idxB).click();
    await expect(page.locator('#moves')).toContainText('移動次數: 1');
    await expect(cards.nth(idxA)).not.toHaveClass(/flipped/, { timeout: 3000 });
    await expect(cards.nth(idxB)).not.toHaveClass(/flipped/);
  });

  test('鍵盤可操作：Tab + Enter 翻牌', async ({ page }) => {
    await page.goto('/beginner.html?theme=zhuyin');
    const firstCard = page.locator('.card').first();
    await firstCard.focus();
    await firstCard.press('Enter');
    await expect(firstCard).toHaveClass(/flipped/);
  });
});
