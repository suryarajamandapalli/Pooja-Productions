import json
import glob

files = glob.glob("scratch/full_match_*.json")
print(f"Found {len(files)} files.")
for f_path in sorted(files, key=lambda x: int(x.split("_")[-1].split(".")[0])):
    with open(f_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"\n--- FILE: {f_path} ---")
    print("Step Index:", data.get("step_index"))
    print("Source:", data.get("source"))
    print("Type:", data.get("type"))
    content = str(data.get("content", ""))
    print("Content length:", len(content))
    print("First 200 chars of content:")
    print(content[:200].strip())
