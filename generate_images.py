from PIL import Image, ImageDraw, ImageFont
import os
import math

def create_placeholder_image(filename, text, size=(200, 300), bg_color=(100, 100, 100), text_color=(255, 255, 255)):
    img = Image.new('RGB', size, color=bg_color)
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("NotoSansCJK-Regular.ttc", 40)
    except IOError:
        font = ImageFont.load_default()
    bbox = d.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size[0]-text_width)/2, (size[1]-text_height)/2)
    d.text(position, text, fill=text_color, font=font)
    img.save(f'static/images/{filename}')

def create_flower_image(filename, size=(20, 20), color=(255, 192, 203)):
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    center = size[0] // 2
    petal_size = size[0] // 4
    for i in range(5):
        angle = math.radians(i * 72)
        x = center + int(petal_size * 1.5 * (i % 2 + 1) * math.cos(angle))
        y = center + int(petal_size * 1.5 * (i % 2 + 1) * math.sin(angle))
        d.ellipse([x - petal_size, y - petal_size, x + petal_size, y + petal_size], fill=color)
    d.ellipse([center - petal_size // 2, center - petal_size // 2,
               center + petal_size // 2, center + petal_size // 2], fill=(255, 255, 0))
    img.save(f'static/images/{filename}', 'PNG')
    
    # Create flipped version
    flipped_flower = img.transpose(Image.FLIP_LEFT_RIGHT)
    flipped_flower.save(f'static/images/{filename.replace(".png", "-flipped.png")}', 'PNG')

if not os.path.exists('static/images'):
    os.makedirs('static/images')

create_placeholder_image('card-back.jpg', '背面')
for i in range(1, 11):
    create_placeholder_image(f'card{i}.jpg', f'卡片 {i}')

create_flower_image('flower.png')

print("Placeholder images and flower images created successfully.")
