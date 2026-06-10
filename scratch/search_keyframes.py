import json

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
found = []
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            content = str(step)
            if "keyframes" in content.lower() or "rotate(360deg)" in content.lower() or "floatDiamond" in content:
                found.append((step.get("step_index"), step.get("type"), content[:300]))
        except Exception:
            pass

print(f"Found {len(found)} matches:")
for idx, step_type, snippet in found:
    print(f"Step {idx} ({step_type}): {snippet}")
