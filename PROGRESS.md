# 🐝 蜂勤耘友配對消消樂 — 進度表 & 未來優化路線圖

> 最後更新：2026-05-02（v1.1 — P0 + 部分 P1 完成）
> 線上版：<https://cagoooo.github.io/bee/>
> Repo：<https://github.com/cagoooo/bee>

---

## ✅ v1.1 完成（2026-05-02 上午）

P0 全部 + P1 鍵盤 a11y + 完成彈窗 + 計時器 + 個人最佳紀錄。

## ✅ v1.4 完成（2026-05-02 深夜）

| # | 項目 | 狀態 |
|---|---|---|
| C | 1200×630 OG 分享圖（漸層底 + 漂浮花朵 + 雙卡示意 + 標題） | ✅ |
| C | scripts/generate_og.py 用 Pillow 自動產生（含 PNG + WebP 雙版本） | ✅ |
| C | 4 個 docs HTML 的 og:image 換到新圖 + 加 og:image:width/height/alt | ✅ |
| F | 砍掉 Flask 版（main.py、templates/、static/、build_static.py、pyproject.toml、uv.lock） | ✅ |
| F | 砍掉 Replit 殘留（.replit、replit.nix） | ✅ |
| F | 砍掉舊資產（generate_thumbnail.py、generated-icon.png、memory-game.html） | ✅ |
| F | README.md 重寫反映新架構（純靜態 + ES Modules + 主題包系統） | ✅ |
| D | Playwright E2E 測試（13 個 test）— 首頁 / 遊戲頁 / PWA / themes.json schema | ✅ |
| D | scripts/validate-themes.js — Node.js 純 JSON schema 驗證（CI 第一關） | ✅ |
| D | .github/workflows/ci.yml — push/PR 自動跑驗證 + Playwright | ✅ |
| D | .gitignore 加入 node_modules / playwright artifacts | ✅ |

## ✅ v1.3 完成（2026-05-02 晚上）

| # | 項目 | 狀態 |
|---|---|---|
| 中期-19 | 注音符號配對主題（聲符 1 / 聲符 2 / 韻符 共 15 對） | ✅ |
| 中期-19 | 唐詩名句配對主題（五言短句 / 五言名句 / 七言對偶） | ✅ |
| 中期-19 | 英文單字配對主題（動物 / 校園 / 天氣） | ✅ |
| 中期-19 | 數字英文配對主題（1～10、整十） | ✅ |
| 健康度-23 | Bootstrap CDN 從 cdn.replit.com 換到 jsDelivr 官方 (5.3.3) | ✅ |
| 健康度-23 | Font Awesome 從 6.0.0-beta3 升級到 6.5.2 stable | ✅ |
| 健康度-23 | 靜音 icon 從 `bi-volume-up-fill` 改用 FA 等價物（少載一個 CDN） | ✅ |
| 架構-13 | game.js 拆成 6 個 ES Module（theme/audio/storage/ui/board/game） | ✅ |
| 架構-13 | 各模組職責清晰：theme(主題+URL)、board(棋盤+配對)、ui(特效+計時+彈窗)、audio(音效)、storage(紀錄)、game(入口) | ✅ |
| 架構-13 | 模組間透過 callback 解耦（board 完成 → game.onComplete → ui.showWinModal） | ✅ |
| 架構-13 | SW v4 預快取 6 個 JS 模組 | ✅ |

## ✅ v1.2 完成（2026-05-02 下午）

| # | 項目 | 狀態 |
|---|---|---|
| P1-4 | 33 張 jpg + flower.png 全轉 WebP（quality=80），總 14MB → 7.2MB（省 50%） | ✅ |
| P1-4 | game.js 用 canvas.toDataURL 偵測 WebP，不支援自動 fallback 到 jpg | ✅ |
| P1-4 | CSS 用 `image-set()` 給 card-back / flower 兩種格式 | ✅ |
| P1-5 | 三遊戲頁加 `<link rel="preload" fetchpriority="high">` 卡背 | ✅ |
| P1-5 | 三遊戲頁加 `<link rel="prefetch">` 該關 10 張卡 | ✅ |
| P1-5 | 首頁加 `<link rel="prefetch">` 三遊戲頁 + 卡背 | ✅ |
| 中期-8 | 首頁顯示三難度個人最佳紀錄（🏆 最佳 X 步 / XX:XX） | ✅ |
| 中期-8 | 「重置所有紀錄」按鈕 + 確認對話框 | ✅ |
| 中期-9 | 主題包系統：抽出 `themes.json`，改用 `pairId` 配對 | ✅ |
| 中期-9 | 支援圖片卡 + 文字卡（教學版核心，可做中英、注音、唐詩等） | ✅ |
| 中期-9 | URL 參數 `?theme=xxx&level=xxx` 切換主題 / 難度 | ✅ |
| 中期-9 | 內建第二主題「水果英文配對」示範文字卡能跑 | ✅ |
| 中期-9 | 首頁主題下拉選單 + 自動把 `?theme=` 串到難度連結 | ✅ |
| 中期-9 | 主題徽章（非預設主題顯示在標題下方） | ✅ |
| 中期-9 | 個人最佳紀錄改成 `bee-best-{theme}-{level}` 格式（每主題每難度獨立） | ✅ |

---

## 📊 目前進度總覽

### ✅ 已完成（v1.0 — GitHub Pages 上線版）

| 區塊 | 項目 | 狀態 |
|---|---|---|
| 🧩 玩法 | 初階 / 中階 / 高階三種難度 | ✅ |
| 🧩 玩法 | 5×4 = 20 張卡片配對（相鄰號碼成對） | ✅ |
| 🧩 玩法 | 翻牌數 / 配對數計分 | ✅ |
| 🎨 視覺 | 漸層背景 + 漂浮花朵 + 標題彩色動畫 | ✅ |
| 🎨 視覺 | 卡片 3D 翻轉 + 配對成功粒子特效 + 失敗震動 | ✅ |
| 🔊 音效 | 翻牌 / 成功 / 失敗 / 重啟 + 背景音樂 | ✅ |
| 🔊 音效 | 靜音切換按鈕 | ✅ |
| 🎬 首頁 | 蜜蜂主題影片 + 自訂播放鈕 + 行動裝置觸控相容 | ✅ |
| 📱 RWD | 桌機 5 欄 / 平板 4 欄 / 手機 3 欄 | ✅ |
| 🌐 部署 | Flask 動態版（main.py） | ✅ |
| 🌐 部署 | 靜態版（docs/） + GitHub Pages 已上線 + HTTPS 強制 | ✅ |
| 📄 文件 | README.md（含部署指南、技術架構、玩法說明） | ✅ |

---

## 🎯 立即建議優化（短期 / 1～3 天可完成）

> 這一節都是「投資報酬率最高、改動最小、風險最低」的優化。建議照順序做。

### 🔴 P0 — 必補

#### 1. 加上作者頁尾（阿凱老師署名）
**現狀**：`docs/index.html`、`beginner.html`、`medium.html`、`advanced.html` 全部沒有 `<footer>`。
**為什麼重要**：
- 這是阿凱老師的作品，學生 / 家長 / 同仁透過分享連結看到時，要能直接連到老師的學校頁面。
- 目前的「Made with ❤️ using Flask & JavaScript」只在 README 出現，網站本身完全沒掛名。

**建議內容**：
```html
<footer style="text-align:center; padding:20px; opacity:0.7; font-size:0.9em;">
  Made with ❤️ by
  <a href="[阿凱老師的學校教師頁 URL]" target="_blank" rel="noopener">阿凱老師</a>
  · © 2026
</footer>
```
四個靜態頁 + 兩個 Flask 模板（`templates/home.html`、`templates/index.html`）都要加。

---

#### 2. SEO / 社群分享預覽（Open Graph）
**現狀**：分享到 LINE / Facebook / Messenger 時沒有預覽圖、沒標題、沒描述。
**改動**：在 4 個 HTML 的 `<head>` 加：
```html
<meta property="og:title" content="蜂勤耘友配對消消樂">
<meta property="og:description" content="一款結合視覺、音效與動畫的記憶配對遊戲，三種難度等級任你挑戰！">
<meta property="og:image" content="https://cagoooo.github.io/bee/images/video-thumbnail.jpg">
<meta property="og:url" content="https://cagoooo.github.io/bee/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="蜂勤耘友配對消消樂 — 三種難度的記憶配對遊戲">
```
> ⚠️ og:image 要 1200×630。目前 `video-thumbnail.jpg` 比例可能不對 → 建議用 `generate_thumbnail.py` 補一張 OG 專用圖。詳見 skill `og-social-preview-zh`。

---

#### 3. PWA 化（讓遊戲可「加到主畫面」離線玩）
**現狀**：純靜態網站，每次都要連網。
**改動**：
- 加 `manifest.json`（icons、theme color、start_url）
- 加 Service Worker 快取所有圖片 / 音效 / HTML
- 第一次載入後就可以離線玩

**好處**：
- 學生在學校 Wi-Fi 不穩時也能玩
- 加到 iPad 主畫面後外觀像 App
- 預載音效避免「第一次點下去才下載很卡」

> ⚠️ 注意 SW 更新策略，避免「使用者看舊版」雷區。詳見 skill `pwa-cache-bust`。

---

### 🟡 P1 — 強烈建議

#### 4. 卡片圖片壓縮 / WebP 轉換
**現狀**：33 張 `.jpg`，每張約 450 KB → 總共約 15 MB，第一次載入慢。
**改動**：
- 用 `sharp` 或 `squoosh-cli` 轉 WebP，畫質視覺幾乎無損但檔案剩 1/3
- 保留 `.jpg` 作為 fallback：
```html
<picture>
  <source srcset="images/card1.webp" type="image/webp">
  <img src="images/card1.jpg" alt="">
</picture>
```
- 或在 `game.js` 偵測支援後切換

**預期效果**：總靜態資源從 ~20 MB → ~7 MB，手機載入時間減半。

---

#### 5. 卡片預載（preload）避免翻牌時白屏
**現狀**：點下去才開始載卡片正面，慢的網路會閃白。
**改動**：在遊戲開始前 `new Image().src = '...'` 把這一關用到的 10 張先預熱。

---

#### 6. 鍵盤無障礙 / 鍵盤操作支援
**現狀**：完全只能滑鼠 / 觸控。
**改動**：
- 卡片改用 `<button>` 而不是 `<div>`
- `Tab` 切換、`Enter` / `Space` 翻牌
- 加 `aria-label="第 3 張卡片，未翻開"`
- 加 `:focus` 視覺樣式

**為什麼重要**：學校有特殊生時、評鑑要 WCAG AA 時必備。

---

#### 7. 完成遊戲時的彈窗 / 慶祝動畫
**現狀**：配對全部完成後沒有明確「結束」感。
**改動**：
- 全部配對完播放完成音效 + 全螢幕灑彩帶（`canvas-confetti` 一行 CDN 即可）
- 顯示「完成！用了 X 步、花了 X 秒」彈窗
- 「再玩一次」 / 「換難度」 / 「分享成績」三個按鈕

---

## 🟢 中期功能延伸（1～2 週工作量）

### 8. 計時器 + 最佳成績排行（localStorage）
- 每關記錄「最少步數」、「最快時間」存 localStorage
- 首頁顯示三個難度的個人最佳紀錄
- 不需後端，完全瀏覽器端

### 9. 主題包系統（資產可替換）
**現狀**：圖片寫死 `card1.jpg ~ card30.jpg`、配對寫死「相鄰號碼」。
**改動**：抽出一個 `themes.json`：
```json
{
  "bees": { "name": "蜂勤耘友", "cards": ["card1.jpg", "card2.jpg", ...], "pairs": [[0,1],[2,3]...] },
  "fruits": { "name": "水果樂園", "cards": [...], "pairs": [...] },
  "animals": { ... }
}
```
**好處**：
- 換主題不用改 HTML / JS
- 可以做「節慶限定主題」（端午、中秋、聖誕）
- 老師能自製班級主題（學生大頭貼當卡片！）

### 10. 自定義配對規則
目前是「card1↔card2」這種兩張不同圖的特殊配對。可考慮加：
- **經典模式**：找兩張完全相同的圖（最直覺、最常見）
- **概念配對模式**：「中文 ↔ 英文」、「題目 ↔ 答案」、「數字 ↔ 數量圖」（這個對教學超有用）
- **三連 / 四連模式**：同概念的 3～4 張全找到才算過

### 11. 多人模式（同一台裝置輪流）
- 兩位玩家輪流翻牌，配對成功者繼續，失敗換手
- 顯示雙方分數、最後比誰多
- 不需網路、不需後端，只需狀態機

### 12. 遊戲音效 / 背景音樂選擇
- 提供 2~3 套 BGM 讓使用者切換
- 音量條（不只開關）
- 偏好存 localStorage

---

## 🔵 長期架構升級（2 週～1 個月）

### 13. 改用模組化架構（ES Modules）
**現狀**：`game.js` 應該是一個大檔。
**改動**：拆成
- `core/board.js`（卡片佈局、配對判定）
- `core/sound.js`（音效管理）
- `core/storage.js`（localStorage 包一層）
- `ui/animations.js`（粒子、震動、過場）
- `ui/modals.js`（完成彈窗、暫停選單）
- `themes/registry.js`

**好處**：以後加功能不會牽一髮動全身，也方便寫單元測試。

### 14. 加上自動測試
- **Playwright E2E**：「點難度 → 點卡片 → 看到翻轉動畫」這種流程測試
- **Vitest 單元測試**：洗牌演算法、配對判定邏輯
- 建 GitHub Actions：每次 push 跑測試，過了才能部署

### 15. CI/CD（GitHub Actions 自動部署）
**現狀**：手動把檔案複製到 `docs/`。
**改動**：
```yaml
# .github/workflows/deploy.yml
- 改 main 分支 →
  - 跑 lint + 測試
  - 自動執行 build_static.py
  - 推到 gh-pages 分支
```
> 詳見 skill `github-pages-auto-deploy`。

### 16. 加入分析（看遊戲被怎麼玩）
**現狀**：完全不知道誰在玩、玩多久、最常選哪個難度。
**選項**：
- **GoatCounter**（隱私友善、免費、無 cookie、不需告知）— 推薦學校場景
- **Plausible**（簡潔、付費）
- **Google Analytics 4**（強大但隱私顧慮）

至少能看：DAU、難度選擇分布、平均完成時間 → 之後改版才有依據。

### 17. 雲端排行榜（跨裝置 / 跨班）
**現狀**：紀錄只存本機。
**升級**：用 **Supabase 免費層**（不需後端寫程式）
- 一張 `leaderboard` 表：`{ nickname, difficulty, moves, time, created_at }`
- 學生輸入暱稱送出成績
- 首頁顯示「本週最少步數 Top 10」
- **務必加 RLS** + reCAPTCHA 防灌水
> 注意 Supabase 免費版 7 天沒活動會暫停 → 詳見 skill `supabase-free-tier-keepalive`。

---

## 🎓 教學情境延伸（阿凱老師專屬）

### 18. 「老師後台」批次出題
做一個 `/admin.html` 工具：
- 老師上傳 N 對圖片（拖曳即可）
- 自動生成主題包 JSON
- 一鍵產生「給某班的限定關卡」連結（URL 帶參數即可，不需後端）
- 用 in-class 課程（如「英文單字配對」、「成語對對碰」）

### 19. 學習主題包：英文單字 / 唐詩 / 注音符號
**這是把遊戲變教材的關鍵**。例如：
- 英文單字版：左卡片是中文「蘋果」，右卡片是「Apple」
- 注音版：「ㄅㄚ」配「八」
- 唐詩版：「床前明月光」配「疑是地上霜」

**做法**：把 #10 的「概念配對模式」做出來後，這些都是換 themes.json 而已。

### 20. 整合 Google 帳號 / 班級系統
- 學生用學校 Google 帳號登入，自動記錄個人歷程
- 老師看得到全班進度
> 詳見 skill `supabase-google-oauth-integration`。

### 21. 列印成績單 / 班級排行榜 PDF
- 期末讓學生匯出個人遊戲歷程成 PDF
- 老師匯出班級成績總表
> 詳見 skill `pdf-export-print-best-practice`（用 `window.print()` + `@media print`，**不要**用 html2pdf）。

### 22. LINE Bot 通知
- 學生過關 → 自動推 LINE 給家長 / 老師
- 老師收到「全班今日完成度」每日彙整
> 詳見 skill `line-messaging-firebase`。

---

## 🧹 程式碼健康度（重構建議）

### 23. 移除 Replit 痕跡
- `index.html` 還在用 `cdn.replit.com/agent/bootstrap-agent-dark-theme.min.css` — Replit 哪天關了 CDN 就壞掉
- 改成 jsDelivr 或 cdnjs 的官方 Bootstrap CDN

### 24. Flask 版要不要留？
**目前狀態**：Flask 版（main.py）和靜態版（docs/）程式碼**重複**。改一處要兩邊同步，遲早不一致。

**選項 A（推薦）**：完全廢掉 Flask 版
- 反正部署在 GitHub Pages
- `main.py`、`templates/`、`pyproject.toml`、`replit.nix`、`build_static.py` 全砍
- repo 變超清爽

**選項 B**：保留 Flask 版作為「本機開發伺服器」
- 但邏輯共用 — 把 templates/ 改成符號連結 → docs/
- 或者用 `python -m http.server -d docs 8000` 取代 Flask（更簡單，零依賴）

### 25. 加 `.editorconfig` + Prettier + ESLint
- 保證以後不管你用 VS Code、Cursor、別人接手，格式都一致
- 5 分鐘設定，受用 5 年

### 26. 圖片資源用 Git LFS 或外部 CDN
- 33 張 jpg + 影片 + 音樂 = repo 變很大，clone 時間長
- 把媒體資源放 Cloudflare R2 / GitHub Releases / jsDelivr，repo 只放程式碼

---

## 📋 推薦執行順序（建議照這個跑）

```
Day 1（今天，1～2 小時就好）
  1. ✅ 加作者頁尾（akai-author-footer skill）
  2. ✅ 加 og:image / SEO meta
  3. ✅ 補 favicon 多尺寸 + apple-touch-icon

Week 1（這週末）
  4. ✅ PWA 化（manifest + Service Worker）
  5. ✅ 完成遊戲彈窗 + canvas-confetti 慶祝
  6. ✅ 鍵盤操作 + aria 標籤
  7. ✅ 計時器 + 最佳成績（localStorage）

Week 2~3（下個專案空檔）
  8. ✅ WebP 圖片優化 + 預載
  9. ✅ 模組化重構（ES Modules）
 10. ✅ 主題包系統（抽 themes.json）
 11. ✅ 移除 Replit 痕跡 + 決定 Flask 版去留

Month 2（學期空檔）
 12. ✅ 概念配對模式（教學版核心）
 13. ✅ 老師後台批次出題工具
 14. ✅ 雲端排行榜（Supabase）
 15. ✅ 學生 Google 登入

Month 3+（看需求）
 16. ✅ E2E + 單元測試 + GitHub Actions CI
 17. ✅ 分析（GoatCounter）
 18. ✅ 班級成績單 PDF 匯出
 19. ✅ LINE 通知整合
```

---

## 🚦 風險與注意事項

| 風險 | 影響 | 對策 |
|---|---|---|
| Replit CDN 哪天下線 | 網站樣式全爆 | #23 換到 jsDelivr |
| 行動網路使用者載 20MB 資源 | 首次體驗極差 | #4 WebP + #3 PWA 預載 |
| GitHub Pages 流量爆量 | 100 GB/月限制 | 媒體資源外移到 CDN（#26）|
| 沒有測試 → 改一處壞另一處 | 維護成本指數成長 | #14 + #15 |
| Supabase 7 天暫停 | 雲端排行榜不能用 | `supabase-free-tier-keepalive` skill |
| 加了 SW 後改版使用者看舊版 | 新功能用戶看不到 | `pwa-cache-bust` skill |

---

## 📚 相關 skill 速查（直接喊就會跑）

| 需求 | Skill |
|---|---|
| 加作者頁尾 | `akai-author-footer` |
| OG 預覽圖 / 中文不要變方框 | `og-social-preview-zh` |
| PWA 改版使用者看舊版 | `pwa-cache-bust` |
| GitHub Pages 自動部署 | `github-pages-auto-deploy` |
| Supabase + Google OAuth | `supabase-google-oauth-integration` |
| Supabase 免費層保活 | `supabase-free-tier-keepalive` |
| LINE 通知整合 | `line-messaging-firebase` |
| PDF 匯出 | `pdf-export-print-best-practice` |
| Firebase 多應用安全部署 | `firebase-multi-app-safety` |

---

## 🎯 總結 — 給阿凱老師的三個建議

1. **本週先做 P0 三件事**（頁尾、OG、PWA），CP 值最高，學生分享出去就有面子。
2. **下個學期前完成「主題包系統」#9 + 「概念配對模式」#10**，這兩個一做完，這款遊戲就從「配對小品」升級成「可重用的教學工具骨架」，以後英文課、注音課、自然課全部都能套。
3. **不急著上後端**，先把前端體驗 + localStorage 版做好。等真的有班級需求要跨裝置看成績再上 Supabase（#17 + #20），不要為了功能而功能。

---

> 這份文件會持續更新。每次改完一項就把上面打勾改成 ✅，看著進度條長大很爽 :)
