// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('PWA / 靜態資源', () => {
  test('manifest.webmanifest 是合法 JSON 且必填欄位齊全', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest');
    expect(res.status()).toBe(200);
    const m = await res.json();
    expect(m.name).toBeTruthy();
    expect(m.start_url).toBeTruthy();
    expect(m.display).toBe('standalone');
    expect(Array.isArray(m.icons)).toBe(true);
    expect(m.icons.length).toBeGreaterThan(0);
  });

  test('themes.json 結構合法且每個 level 有 5 對', async ({ request }) => {
    const res = await request.get('/themes.json');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.defaultTheme).toBeTruthy();
    expect(data.themes[data.defaultTheme]).toBeTruthy();
    for (const [key, theme] of Object.entries(data.themes)) {
      expect(theme.name, `theme ${key} missing name`).toBeTruthy();
      expect(theme.levels, `theme ${key} missing levels`).toBeTruthy();
      for (const [lvKey, level] of Object.entries(theme.levels)) {
        expect(Array.isArray(level.pairs), `${key}.${lvKey}.pairs not array`).toBe(true);
        expect(level.pairs.length, `${key}.${lvKey} should have 5 pairs`).toBe(5);
        for (const pair of level.pairs) {
          expect(pair.length).toBe(2);
          expect(pair[0].image || pair[0].text).toBeTruthy();
          expect(pair[1].image || pair[1].text).toBeTruthy();
        }
      }
    }
  });

  test('Service Worker 檔案可下載', async ({ request }) => {
    const res = await request.get('/sw.js');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('CACHE_VERSION');
    expect(text).toContain('addEventListener');
  });

  test('OG 圖存在且尺寸正確', async ({ request }) => {
    const res = await request.get('/images/og-image.png');
    expect(res.status()).toBe(200);
    expect(parseInt(res.headers()['content-length'] || '0')).toBeGreaterThan(50000);
  });
});
