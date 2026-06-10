import json

with open("scratch/step_1262_replacement.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's see if this is JSON-encoded or raw text
try:
    decoded = json.loads(f'"{text}"')
    print("Decoded as JSON string successfully!")
    with open("scratch/step_1262_unescaped.txt", "w", encoding="utf-8") as out:
        out.write(decoded)
except Exception:
    try:
        import ast
        decoded = ast.literal_eval(text)
        print("Decoded with ast.literal_eval successfully!")
        with open("scratch/step_1262_unescaped.txt", "w", encoding="utf-8") as out:
            out.write(decoded)
    except Exception as e:
        print("Fallback simple replace. Error:", e)
        decoded = text.replace("\\n", "\n").replace('\\"', '"').replace('\\\\', '\\')
        with open("scratch/step_1262_unescaped.txt", "w", encoding="utf-8") as out:
            out.write(decoded)

print("Wrote scratch/step_1262_unescaped.txt")

# Let's count lines and look for truncation
with open("scratch/step_1262_unescaped.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
print(f"Total lines: {len(lines)}")
for idx, l in enumerate(lines):
    if "<truncated" in l:
        print(f"Truncated in line {idx+1}: {l[:100]}")
    else:
        print(f"Line {idx+1}: {l[:100].strip()}")
