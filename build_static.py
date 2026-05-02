#!/usr/bin/env python3
"""
建立靜態版本以供 GitHub Pages 部署
此腳本會將 Flask 專案轉換為純靜態網站
"""

import os
import shutil
import re

# 設定目錄
SOURCE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SOURCE_DIR, 'docs')

def clean_output_dir():
    """清除並重建輸出目錄"""
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)
    print(f"✅ 已清除並重建輸出目錄: {OUTPUT_DIR}")

def copy_static_assets():
    """複製靜態資源"""
    static_src = os.path.join(SOURCE_DIR, 'static')
    
    # 複製各個子目錄
    for item in ['css', 'js', 'images', 'audio', 'videos']:
        src = os.path.join(static_src, item)
        dst = os.path.join(OUTPUT_DIR, item)
        if os.path.exists(src):
            shutil.copytree(src, dst)
            print(f"✅ 已複製: {item}/")
    
    # 複製 favicon
    favicon_src = os.path.join(static_src, 'favicon.ico')
    if os.path.exists(favicon_src):
        shutil.copy2(favicon_src, os.path.join(OUTPUT_DIR, 'favicon.ico'))
        print("✅ 已複製: favicon.ico")

def convert_home_html():
    """轉換首頁模板為靜態 HTML"""
    template_path = os.path.join(SOURCE_DIR, 'templates', 'home.html')
    
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替換 Jinja2 語法
    replacements = [
        (r"\{\{\s*url_for\('static',\s*filename='([^']+)'\)\s*\}\}", r'\1'),
        (r"\{\{\s*url_for\('beginner_game'\)\s*\}\}", 'beginner.html'),
        (r"\{\{\s*url_for\('medium_game'\)\s*\}\}", 'medium.html'),
        (r"\{\{\s*url_for\('advanced_game'\)\s*\}\}", 'advanced.html'),
        (r"\{\{\s*url_for\('home'\)\s*\}\}", 'index.html'),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    output_path = os.path.join(OUTPUT_DIR, 'index.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已轉換: index.html (首頁)")

def convert_game_html(level, display_name):
    """轉換遊戲頁面模板為靜態 HTML"""
    template_path = os.path.join(SOURCE_DIR, 'templates', 'index.html')
    
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替換 Jinja2 語法
    replacements = [
        (r"\{\{\s*url_for\('static',\s*filename='([^']+)'\)\s*\}\}", r'\1'),
        (r"\{\{\s*url_for\('home'\)\s*\}\}", 'index.html'),
        (r"\{\{\s*title\s*\}\}", f'蜂勤耘友配對消消樂 - {display_name}'),
        (r"\{\{\s*level\s*\}\}", level),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    output_path = os.path.join(OUTPUT_DIR, f'{level}.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ 已轉換: {level}.html ({display_name})")

def fix_css_paths():
    """修正 CSS 中的路徑"""
    css_path = os.path.join(OUTPUT_DIR, 'css', 'styles.css')
    
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 將 /static/images/ 改為 ../images/
    content = content.replace("/static/images/", "../images/")
    
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已修正: css/styles.css 路徑")

def fix_js_paths():
    """修正 JavaScript 中的路徑"""
    js_path = os.path.join(OUTPUT_DIR, 'js', 'game.js')
    
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 將 /static/images/ 改為 images/
    content = content.replace("/static/images/", "images/")
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已修正: js/game.js 路徑")

def create_404_page():
    """建立 404 錯誤頁面"""
    content = '''<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>頁面未找到 - 蜂勤耘友配對消消樂</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="shortcut icon" href="favicon.ico">
    <style>
        body {
            background: linear-gradient(135deg, var(--bs-primary), var(--bs-success));
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .error-container {
            text-align: center;
            padding: 2rem;
        }
        .error-code {
            font-size: 6rem;
            font-weight: bold;
            color: rgba(255,255,255,0.9);
        }
        .error-message {
            font-size: 1.5rem;
            color: rgba(255,255,255,0.8);
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">404</div>
        <div class="error-message">喔不！找不到這個頁面 🐝</div>
        <a href="index.html" class="btn btn-primary btn-lg">返回首頁</a>
    </div>
</body>
</html>
'''
    output_path = os.path.join(OUTPUT_DIR, '404.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已建立: 404.html")

def main():
    print("=" * 50)
    print("🐝 開始建立 GitHub Pages 靜態版本")
    print("=" * 50)
    print()
    
    # 步驟 1: 清除輸出目錄
    clean_output_dir()
    print()
    
    # 步驟 2: 複製靜態資源
    copy_static_assets()
    print()
    
    # 步驟 3: 轉換 HTML 模板
    convert_home_html()
    convert_game_html('beginner', '初階')
    convert_game_html('medium', '中階')
    convert_game_html('advanced', '高階')
    print()
    
    # 步驟 4: 修正路徑
    fix_css_paths()
    fix_js_paths()
    print()
    
    # 步驟 5: 建立 404 頁面
    create_404_page()
    print()
    
    print("=" * 50)
    print("✅ 完成！靜態網站已建立於 docs/ 目錄")
    print("=" * 50)
    print()
    print("📌 後續步驟：")
    print("1. 將 docs/ 目錄提交到 GitHub")
    print("2. 前往 Repository Settings → Pages")
    print("3. 選擇 Deploy from branch → main → /docs")
    print("4. 等待部署完成後即可訪問")

if __name__ == '__main__':
    main()
