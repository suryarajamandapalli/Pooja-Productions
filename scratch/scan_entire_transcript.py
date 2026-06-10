import json

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
count = 0
with open(log_path, "r", encoding="utf-8") as f:
    for line_idx, line in enumerate(f):
        if "Structured Footer" in line:
            count += 1
            print(f"Match {count}: Line {line_idx+1} in JSONL, length {len(line)}")
            # Let's inspect if the string literal '<truncated' is present in this line
            if "<truncated" in line:
                print("  Contains '<truncated' marker!")
                # Find the index of '<truncated'
                idx = line.find("<truncated")
                print(f"  Truncation marker found at character index {idx}: {line[idx:idx+40]}")
            else:
                print("  Does NOT contain '<truncated' marker! Full content available!")
                # Print the line or extract the JSON content
                try:
                    step = json.loads(line)
                    print("  Successfully parsed as JSON!")
                    # Save it
                    with open(f"scratch/full_match_{count}.json", "w", encoding="utf-8") as out:
                        json.dump(step, out, indent=2)
                    print(f"  Saved to scratch/full_match_{count}.json")
                except Exception as e:
                    print("  JSON parse error:", e)
