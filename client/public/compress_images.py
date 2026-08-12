import os
from PIL import Image

# Path to the public directory
public_dir = os.path.dirname(os.path.abspath(__file__))

# List of images to optimize
images_to_optimize = [
    'basement_grouting',
    'bathroom_sealing',
    'exterior_facade',
    'injection_grouting',
    'owner',
    'terrace_before',
    'terrace_waterproofing',
    'water_tank'
]

print(f"Starting image optimization in {public_dir}...")

for name in images_to_optimize:
    png_path = os.path.join(public_dir, f"{name}.png")
    if not os.path.exists(png_path):
        print(f"File {png_path} does not exist, skipping.")
        continue
        
    print(f"Processing {name}.png...")
    try:
        # Open source PNG image
        with Image.open(png_path) as img:
            # --- 1. Generate Large WebP (Max width 1000px) ---
            large_webp_path = os.path.join(public_dir, f"{name}.webp")
            if img.width > 1000:
                large_height = int((1000 / img.width) * img.height)
                img_large = img.resize((1000, large_height), Image.Resampling.LANCZOS)
            else:
                img_large = img.copy()
            
            # Save as WebP
            img_large.save(large_webp_path, format="WEBP", quality=80)
            print(f"  Saved large: {large_webp_path} (width: {img_large.width}px)")
            
            # --- 2. Generate Small WebP (Max width 400px) ---
            small_webp_path = os.path.join(public_dir, f"{name}-small.webp")
            if img.width > 400:
                small_height = int((400 / img.width) * img.height)
                img_small = img.resize((400, small_height), Image.Resampling.LANCZOS)
            else:
                img_small = img.copy()
                
            # Save as WebP
            img_small.save(small_webp_path, format="WEBP", quality=80)
            print(f"  Saved small: {small_webp_path} (width: {img_small.width}px)")
            
        # --- 3. Clean up original PNG ---
        os.remove(png_path)
        print(f"  Removed original: {png_path}")
        
    except Exception as e:
        print(f"Error processing {name}.png: {e}")

print("Image optimization complete.")
