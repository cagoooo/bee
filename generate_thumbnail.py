from PIL import Image, ImageDraw, ImageFont
import os

def generate_thumbnail(output_path, width=800, height=450):
    # Create a new image with a gradient background
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)

    # Create a gradient background
    for y in range(height):
        r = int(255 * (1 - y / height))
        g = int(200 * (1 - y / height))
        b = int(100 * (1 - y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Add text
    font_size = width // 20
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except IOError:
        font = ImageFont.load_default()

    text = "蜂勤耘友配對消消樂"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    position = ((width - text_width) // 2, (height - text_height) // 2)
    draw.text(position, text, fill=(255, 255, 255), font=font)

    # Save the image
    image.save(output_path)
    print(f"Thumbnail generated and saved as {output_path}")

if __name__ == "__main__":
    output_directory = "static/images"
    os.makedirs(output_directory, exist_ok=True)
    output_path = os.path.join(output_directory, "video-thumbnail.jpg")
    generate_thumbnail(output_path)
