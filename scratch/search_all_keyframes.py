import json
import re

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
keyframes = []

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            content = str(step)
            # Find all occurrences of keyframes or rotate animations in the line
            matches = re.findall(r"@keyframes\s+\w+\s*\{[^\}]+\}", content)
            if matches:
                keyframes.extend([(step.get("step_index"), m) for m in matches])
            # Also check for keyframes inside ReplacementContent or CodeContent
            for tc in step.get("tool_calls", []):
                args = tc.get("args", {})
                for key in ["ReplacementContent", "CodeContent"]:
                    val = args.get(key, "")
                    if val:
                        matches_val = re.findall(r"@keyframes\s+(\w+)\s*\{([^}]+)\}", val)
                        for m_name, m_body in matches_val:
                            keyframes.append((step.get("step_index"), f"@keyframes {m_name} {{ {m_body.strip()} }}"))
        except Exception:
            pass

print(f"Total keyframes found: {len(keyframes)}")
# Print unique ones or print all with step index
seen = set()
for step_idx, kf in keyframes:
    kf_clean = kf.replace("\\n", " ").replace("  ", " ")
    if kf_clean not in seen:
        seen.add(kf_clean)
        print(f"Step {step_idx}: {kf_clean}")
