with open("scratch/step_1755_replacement.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in file: {len(lines)}")
for idx, line in enumerate(lines):
    print(f"Line {idx+1} length: {len(line)} | First 80 chars: {line[:80].strip()}")
