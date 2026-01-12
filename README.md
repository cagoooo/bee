# 🐝 蜂勤耘友配對消消樂

一款精美的記憶配對遊戲，結合豐富的視覺效果與音效互動，提供三種難度等級供玩家挑戰。

![遊戲封面](static/images/video-thumbnail.jpg)

---

## 📋 目錄

- [專案簡介](#-專案簡介)
- [功能特色](#-功能特色)
- [專案結構](#-專案結構)
- [安裝與執行](#-安裝與執行)
- [遊戲玩法](#-遊戲玩法)
- [技術架構](#-技術架構)
- [GitHub Pages 部署指南](#-github-pages-部署指南)
- [授權條款](#-授權條款)

---

## 🎮 專案簡介

「蜂勤耘友配對消消樂」是一款網頁版的記憶配對遊戲，玩家需要翻開卡片找到成對的圖案。遊戲配有精美的卡片圖片、音效回饋、動畫特效，以及響應式設計，支援桌面與行動裝置。

---

## ✨ 功能特色

### 🎯 三種難度等級
| 難度 | 圖片範圍 | 卡片數量 | 配對數 |
|------|----------|----------|--------|
| 🌱 初階 | card1 ~ card10 | 20 張 | 10 組 |
| 🌲 中階 | card11 ~ card20 | 20 張 | 10 組 |
| 🏔 高階 | card21 ~ card30 | 20 張 | 10 組 |

### 🎨 視覺效果
- 漸層背景動畫
- 卡片翻轉 3D 動畫
- 配對成功粒子特效
- 配對失敗震動效果
- 漂浮花朵背景裝飾
- 標題文字彩色動畫

### 🔊 音效系統
- 翻牌音效 (`card-flip.mp3`)
- 配對成功音效 (`card-match.mp3`)
- 配對失敗音效 (`card-mismatch.mp3`)
- 重新開始音效 (`restart.mp3`)
- 背景音樂 (`background-music.mp3`)
- 靜音切換功能

### 📱 響應式設計
- 桌面版：5 欄排列
- 平板版 (≤768px)：4 欄排列
- 手機版 (≤480px)：3 欄排列

### 🎬 首頁影片展示
- 嵌入蜜蜂主題影片 (`bees.mp4`)
- 自訂播放按鈕
- 觸控裝置支援

---

## 📁 專案結構

```
bee/
├── main.py                      # Flask 主程式
├── pyproject.toml               # Python 專案設定 (uv/poetry)
├── requirements.txt             # Python 依賴套件
├── .replit                      # Replit 設定檔
├── replit.nix                   # Nix 環境設定
│
├── templates/                   # HTML 模板
│   ├── home.html               # 首頁（選擇難度）
│   └── index.html              # 遊戲頁面
│
├── static/                      # 靜態資源
│   ├── favicon.ico             # 網站圖示
│   │
│   ├── css/
│   │   └── styles.css          # 遊戲樣式表
│   │
│   ├── js/
│   │   └── game.js             # 遊戲核心邏輯
│   │
│   ├── images/                 # 卡片圖片(33張)
│   │   ├── card-back.jpg       # 卡片背面
│   │   ├── card1.jpg ~ card30.jpg  # 遊戲圖片
│   │   ├── flower.png          # 漂浮花朵
│   │   └── video-thumbnail.jpg # 影片縮圖
│   │
│   ├── audio/                  # 音效資源
│   │   ├── background-music.mp3
│   │   ├── card-flip.mp3
│   │   ├── card-match.mp3
│   │   ├── card-mismatch.mp3
│   │   └── restart.mp3
│   │
│   └── videos/
│       └── bees.mp4            # 首頁影片
│
└── generated-icon.png          # 應用程式圖示
```

---

## 🚀 安裝與執行

### 方法一：使用 Python (Flask 伺服器)

#### 系統需求
- Python 3.11+
- pip 或 uv 套件管理器

#### 安裝步驟

```bash
# 1. 複製專案
git clone <your-repo-url>
cd bee

# 2. 建立虛擬環境（可選）
python -m venv venv
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\activate   # Windows

# 3. 安裝依賴
pip install flask

# 4. 啟動伺服器
python main.py

# 5. 開啟瀏覽器訪問
# http://localhost:5000
```

#### 使用 uv（推薦）

```bash
# 安裝 uv
pip install uv

# 同步依賴並執行
uv sync
uv run python main.py
```

### 方法二：使用 Replit

此專案已設定 Replit 環境，可直接在 Replit 上執行：

1. 將專案匯入 Replit
2. 點擊 "Run" 按鈕
3. 等待伺服器啟動
4. 在預覽視窗中開始遊戲

---

## 🎲 遊戲玩法

### 基本規則
1. **首頁選擇難度**：選擇初階、中階或高階
2. **翻開卡片**：點擊卡片翻開查看圖案
3. **記憶配對**：每次可翻開兩張卡片
4. **配對成功**：兩張相同圖案的卡片將保持翻開
5. **配對失敗**：不相同的卡片會自動翻回
6. **完成遊戲**：成功配對所有卡片即獲勝

### 配對規則說明
遊戲使用「相鄰號碼配對」機制：
- 初階：card1-card2、card3-card4... 為一對
- 中階：card11-card12、card13-card14... 為一對
- 高階：card21-card22、card23-card24... 為一對

### 介面說明
- **配對成功計數**：顯示已成功配對的組數
- **移動次數**：記錄翻牌次數
- **重新開始**：重置遊戲
- **靜音按鈕**：開關音效
- **返回選擇難度**：回到首頁

---

## 🛠 技術架構

### 後端
| 技術 | 說明 |
|------|------|
| Flask | Python 輕量級 Web 框架 |
| Jinja2 | 模板引擎 |

### 前端
| 技術 | 說明 |
|------|------|
| HTML5 | 語意化標籤、音訊/影片元素 |
| CSS3 | Flexbox、Grid、動畫、3D變換 |
| JavaScript | DOM操作、事件處理、音訊控制 |
| Bootstrap | 響應式佈局 (dark theme) |
| Font Awesome | 圖標庫 |

### 外部資源
- Bootstrap Agent Dark Theme (Replit CDN)
- Font Awesome 6.x

---

## 🌐 GitHub Pages 部署指南

> ⚠️ **重要提示**：此專案目前使用 Flask 動態路由，需要進行修改才能部署到靜態網站託管服務（如 GitHub Pages）。

### 改造方案

由於 GitHub Pages 只支援靜態網站，需將專案改造為純前端應用：

#### 步驟 1：建立靜態版本目錄結構

```
docs/                           # GitHub Pages 根目錄
├── index.html                  # 首頁（選擇難度）
├── beginner.html               # 初階遊戲
├── medium.html                 # 中階遊戲
├── advanced.html               # 高階遊戲
├── favicon.ico
├── css/
│   └── styles.css
├── js/
│   └── game.js                 # 修改路徑引用
├── images/
│   └── (所有圖片)
├── audio/
│   └── (所有音效)
└── videos/
    └── bees.mp4
```

#### 步驟 2：修改 HTML 模板

將 Jinja2 模板語法替換為靜態路徑：

**原始（Flask）：**
```html
<link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
<a href="{{ url_for('beginner_game') }}">初階</a>
```

**改為（靜態）：**
```html
<link rel="stylesheet" href="css/styles.css">
<a href="beginner.html">初階</a>
```

#### 步驟 3：修改 JavaScript 路徑

`game.js` 中的圖片路徑需要修改：

**原始：**
```javascript
img.src = `/static/images/${image}`;
```

**改為：**
```javascript
img.src = `images/${image}`;
```

#### 步驟 4：修改 CSS 路徑

`styles.css` 中的圖片路徑：

**原始：**
```css
background-image: url('/static/images/card-back.jpg');
```

**改為：**
```css
background-image: url('images/card-back.jpg');
```

#### 步驟 5：設定 GitHub Pages

1. 將靜態檔案放入 `docs/` 資料夾
2. 前往 GitHub 儲存庫 → Settings → Pages
3. Source 選擇 `Deploy from a branch`
4. Branch 選擇 `main`，資料夾選擇 `/docs`
5. 點擊 Save

#### 步驟 6：處理大型檔案

> ⚠️ **注意**：GitHub 對單一檔案大小有 100MB 限制

| 檔案 | 大小 | 處理方式 |
|------|------|----------|
| bees.mp4 | ~5.8 MB | ✅ 可直接上傳 |
| background-music.mp3 | ~4.3 MB | ✅ 可直接上傳 |
| generated-icon.png | ~1 MB | ✅ 可直接上傳 |
| 卡片圖片 | 各~450KB | ✅ 可直接上傳 |

所有檔案都在限制內，可以直接上傳至 GitHub。

---

### 替代部署方案

如需保持 Flask 動態功能，可使用以下平台：

| 平台 | 費用 | 優點 |
|------|------|------|
| **Replit** | 免費方案可用 | 已有設定檔，一鍵部署 |
| **Render** | 免費方案可用 | 支援 Flask，自動部署 |
| **Vercel** | 免費方案可用 | 需要 serverless 適配 |
| **Railway** | 有限免費額度 | 簡易 Flask 部署 |
| **PythonAnywhere** | 免費方案可用 | 專為 Python 設計 |

---

## 📄 授權條款

此專案為教育用途開發，所有圖片與音效資源請確認適當的使用授權。

---

## 🙏 致謝

感謝「蜂勤耘友」團隊提供專案靈感與素材支援。

---

<div align="center">

**🎮 開始遊戲，挑戰你的記憶力！**

Made with ❤️ using Flask & JavaScript

</div>
