import os
from PIL import Image

def optimize_png(src):
    if not os.path.exists(src):
        return
    orig_size = os.path.getsize(src)
    try:
        img = Image.open(src)
        # Convert to P mode using adaptive palette to preserve alpha transparency
        img_p = img.convert("P", palette=Image.Palette.ADAPTIVE, colors=256)
        img_p.save(src, "PNG", optimize=True, compress_level=9)
        new_size = os.path.getsize(src)
        reduction = (orig_size - new_size) / orig_size * 100
        print(f"Optimized {src}: {orig_size/(1024*1024):.2f}MB -> {new_size/(1024*1024):.2f}MB ({reduction:.1f}% reduction)")
    except Exception as e:
        print(f"Failed to optimize {src}: {e}")

def run_optimization():
    # 1. Main brand logos
    print("Optimizing brand logos...")
    optimize_png("public/logo.png")
    optimize_png("public/logo_symbol.png")
    
    # 2. Rock images
    print("\nOptimizing rock images...")
    optimize_png("public/img/backgrounds/about_rock.png")
    optimize_png("public/img/backgrounds/about_rock_left.png")
    optimize_png("public/img/backgrounds/about_rock_right.png")
    optimize_png("public/img/backgrounds/rock1.png")
    optimize_png("public/img/backgrounds/rock2.png")
    
    # 3. BG Animation Frames
    print("\nOptimizing background canvas frames...")
    frames_dir = "public/BG FRAMES"
    if os.path.exists(frames_dir):
        files = [f for f in os.listdir(frames_dir) if f.lower().endswith(".png")]
        files.sort()
        print(f"Found {len(files)} frames to optimize.")
        for idx, file in enumerate(files):
            file_path = os.path.join(frames_dir, file)
            optimize_png(file_path)
            if (idx + 1) % 20 == 0 or idx == len(files) - 1:
                print(f"Progress: {idx + 1}/{len(files)} frames processed.")
    else:
        print("BG FRAMES directory not found.")

if __name__ == "__main__":
    run_optimization()
