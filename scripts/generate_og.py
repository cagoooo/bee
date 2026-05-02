"""產生 1200×630 OG 分享圖。執行：python scripts/generate_og.py"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PNG = os.path.join(ROOT, 'docs', 'images', 'og-image.png')
OUT_WEBP = os.path.join(ROOT, 'docs', 'images', 'og-image.webp')

W, H = 1200, 630
BG_TOP = (13, 110, 253)      # bs-primary
BG_BOTTOM = (32, 201, 151)   # bs-success-ish
ACCENT = (255, 215, 0)       # gold

FONT_BOLD = 'C:/Windows/Fonts/msjhbd.ttc'
FONT_REG = 'C:/Windows/Fonts/msjh.ttc'

def gradient(w, h, top, bottom):
    img = Image.new('RGB', (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / (h - 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        for x in range(w):
            px[x, y] = (r, g, b)
    return img

def main():
    img = gradient(W, H, BG_TOP, BG_BOTTOM)

    # 漂浮花朵裝飾（半透明）
    flower_path = os.path.join(ROOT, 'docs', 'images', 'flower.png')
    if os.path.exists(flower_path):
        flower = Image.open(flower_path).convert('RGBA')
        for pos, size, alpha in [
            ((40, 60), 120, 90),
            ((1020, 480), 130, 100),
            ((100, 460), 90, 70),
            ((980, 80), 100, 80),
        ]:
            f = flower.resize((size, size), Image.LANCZOS)
            r, g, b, a = f.split()
            a = a.point(lambda p: int(p * alpha / 255))
            f = Image.merge('RGBA', (r, g, b, a))
            img.paste(f, pos, f)

    # 中央卡片縮圖（用 card1 + card2 配對示意）
    for i, (card, pos) in enumerate([('card1.webp', (440, 200)), ('card2.webp', (640, 200))]):
        cp = os.path.join(ROOT, 'docs', 'images', card)
        if os.path.exists(cp):
            c = Image.open(cp).convert('RGB').resize((140, 200), Image.LANCZOS)
            # rounded corner mask
            mask = Image.new('L', (140, 200), 0)
            d = ImageDraw.Draw(mask)
            d.rounded_rectangle((0, 0, 140, 200), radius=14, fill=255)
            shadow = Image.new('RGBA', (160, 220), (0, 0, 0, 0))
            sd = ImageDraw.Draw(shadow)
            sd.rounded_rectangle((10, 10, 150, 210), radius=14, fill=(0, 0, 0, 90))
            shadow = shadow.filter(ImageFilter.GaussianBlur(8))
            img.paste(shadow, (pos[0] - 10, pos[1] - 5), shadow)
            img.paste(c, pos, mask)

    draw = ImageDraw.Draw(img)

    title_font = ImageFont.truetype(FONT_BOLD, 76)
    sub_font = ImageFont.truetype(FONT_BOLD, 38)
    foot_font = ImageFont.truetype(FONT_REG, 28)

    title = '蜂勤耘友配對消消樂'
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    tx = (W - tw) // 2
    draw.text((tx + 3, 60 + 3), title, font=title_font, fill=(0, 0, 0, 100))
    draw.text((tx, 60), title, font=title_font, fill=(255, 255, 255))

    sub = '記憶配對遊戲 · 三種難度 · 6 種教學主題'
    bbox = draw.textbbox((0, 0), sub, font=sub_font)
    sw = bbox[2] - bbox[0]
    draw.text(((W - sw) // 2, 150), sub, font=sub_font, fill=ACCENT)

    foot = 'cagoooo.github.io/bee   ·   Made by 阿凱老師'
    bbox = draw.textbbox((0, 0), foot, font=foot_font)
    fw = bbox[2] - bbox[0]
    draw.text(((W - fw) // 2, 560), foot, font=foot_font, fill=(255, 255, 255, 220))

    img.save(OUT_PNG, 'PNG', optimize=True)
    img.save(OUT_WEBP, 'WEBP', quality=88, method=6)
    print(f'PNG  : {os.path.getsize(OUT_PNG)//1024} KB  -> {OUT_PNG}')
    print(f'WEBP : {os.path.getsize(OUT_WEBP)//1024} KB  -> {OUT_WEBP}')

if __name__ == '__main__':
    main()
