import os
from PIL import Image

def split_rocks():
    img_path = "public/img/backgrounds/about_rock.png"
    if not os.path.exists(img_path):
        print("Image not found at:", img_path)
        return
    
    img = Image.open(img_path)
    print("Original size:", img.size)
    print("Mode:", img.mode)
    
    # Ensure image is in RGBA mode
    if img.mode != "RGBA":
        img = img.convert("RGBA")
        
    width, height = img.size
    pixels = img.load()
    
    # Find active columns (columns that have at least one pixel with alpha > 0)
    active_cols = []
    for x in range(width):
        has_alpha = False
        for y in range(height):
            alpha = pixels[x, y][3]
            if alpha > 0:
                has_alpha = True
                break
        if has_alpha:
            active_cols.append(x)
            
    if not active_cols:
        print("No active pixels found!")
        return
        
    # Find gaps in active columns to identify separation
    gaps = []
    for i in range(len(active_cols) - 1):
        gap_size = active_cols[i+1] - active_cols[i]
        if gap_size > 1:
            gaps.append((active_cols[i], active_cols[i+1]))
            
    print("Found gaps between active columns:", gaps)
    
    # We expect at least one main gap in the middle. Let's find the widest gap.
    if gaps:
        widest_gap = max(gaps, key=lambda g: g[1] - g[0])
        split_col = (widest_gap[0] + widest_gap[1]) // 2
        print(f"Splitting image at column {split_col} (widest gap: {widest_gap})")
    else:
        # Default fallback: split in the middle
        split_col = width // 2
        print(f"No gap found. Splitting in the middle at column {split_col}")
        
    # Crop left rock
    left_box = img.crop((0, 0, split_col, height))
    # Crop right rock
    right_box = img.crop((split_col, 0, width, height))
    
    # Helper to crop transparent padding
    def trim_transparency(im):
        bbox = im.getbbox()
        if bbox:
            return im.crop(bbox)
        return im
        
    left_rock = trim_transparency(left_box)
    right_rock = trim_transparency(right_box)
    
    left_rock_path = "public/img/backgrounds/about_rock_left.png"
    right_rock_path = "public/img/backgrounds/about_rock_right.png"
    
    left_rock.save(left_rock_path, "PNG")
    right_rock.save(right_rock_path, "PNG")
    
    print(f"Saved left rock ({left_rock.size}) to {left_rock_path}")
    print(f"Saved right rock ({right_rock.size}) to {right_rock_path}")

if __name__ == "__main__":
    split_rocks()
