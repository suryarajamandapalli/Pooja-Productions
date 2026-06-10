import os
from PIL import Image

image_path = "public/img/backgrounds/1400x1000_d01.webp"
if os.path.exists(image_path):
    img = Image.open(image_path)
    print("Dimensions:", img.size)
    print("Format:", img.format)
    print("Mode:", img.mode)
    
    # check if the bottom rows of pixels are black
    width, height = img.size
    pixels = img.load()
    
    # Check bottom 50 rows
    black_rows = 0
    for y in range(height - 1, height - 100, -1):
        is_row_black = True
        for x in range(0, width, 10):
            pixel = pixels[x, y]
            # check if RGB is close to black (e.g. all values < 10)
            if isinstance(pixel, tuple):
                if any(c > 15 for c in pixel[:3]):
                    is_row_black = False
                    break
            elif isinstance(pixel, int):
                if pixel > 15:
                    is_row_black = False
                    break
        if is_row_black:
            black_rows += 1
        else:
            break
            
    print("Number of solid black rows at the bottom:", black_rows)
else:
    print("Image not found:", image_path)
