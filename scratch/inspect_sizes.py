import os

def check_image_sizes():
    public_dir = "public"
    large_images = []
    
    for root, dirs, files in os.walk(public_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                file_path = os.path.join(root, file)
                size_bytes = os.path.getsize(file_path)
                size_mb = size_bytes / (1024 * 1024)
                large_images.append((file_path, size_mb, size_bytes))
                
    large_images.sort(key=lambda x: x[2], reverse=True)
    
    print("Top 25 largest images in public/ folder:")
    for path, mb, bytes_size in large_images[:25]:
        print(f"- {path} : {mb:.2f} MB ({bytes_size} bytes)")

if __name__ == "__main__":
    check_image_sizes()
