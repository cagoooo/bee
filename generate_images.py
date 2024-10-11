from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_image(filename, text, size=(200, 300), bg_color=(100, 100, 100), text_color=(255, 255, 255)):
    img = Image.new('RGB', size, color=bg_color)
    d = ImageDraw.Draw(img)
    font = ImageFont.load_default()
    bbox = d.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size[0]-text_width)/2, (size[1]-text_height)/2)
    d.text(position, text, fill=text_color, font=font)
    img.save(f'static/images/{filename}')

if not os.path.exists('static/images'):
    os.makedirs('static/images')

create_placeholder_image('card-back.jpg', 'Back')
for i in range(1, 6):
    create_placeholder_image(f'card{i}.jpg', f'Card {i}')

print("Placeholder images created successfully.")
