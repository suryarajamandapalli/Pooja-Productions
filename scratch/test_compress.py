import os
from PIL import Image

def test_compress():
    src = "public/logo.png"
    if not os.path.exists(src):
        print("Logo not found.")
        return
        
    img = Image.open(src)
    print("Original format:", img.format, "Mode:", img.mode, "Size:", img.size)
    
    # 1. Standard PNG optimize
    dest_opt = "scratch/logo_opt.png"
    img.save(dest_opt, "PNG", optimize=True, compress_level=9)
    print(f"Standard Optimize Size: {os.path.getsize(dest_opt) / (1024*1024):.2f} MB")
    
    # 2. Adaptive Quantize to P mode (8-bit PNG with transparency)
    dest_p = "scratch/logo_p.png"
    # Convert to P mode preserving alpha transparency via adaptive quantization
    img_p = img.convert("P", palette=Image.Palette.ADAPTIVE, colors=256)
    img_p.save(dest_p, "PNG", optimize=True, compress_level=9)
    print(f"8-bit Indexed PNG Size: {os.path.getsize(dest_p) / (1024*1024):.2f} MB")
    
    # 3. WebP Lossy (Q85)
    dest_webp = "scratch/logo_q85.webp"
    img.save(dest_webp, "WEBP", quality=85)
    print(f"WebP Q85 Size: {os.path.getsize(dest_webp) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    test_compress()
