import json
import sys

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get("step_index") == 1755:
                for tc in step.get("tool_calls", []):
                    args = tc.get("args", {})
                    rep = args.get("ReplacementContent", "")
                    
                    # Unescape the string properly (since json.loads of json.loads is what we need or we can just use json.loads on a wrapped string)
                    # Let's wrap it in double quotes and load it as JSON to get the unescaped string
                    try:
                        unescaped = json.loads(f'"{rep}"')
                    except Exception:
                        # Fallback simple replacement if json.loads fails
                        unescaped = rep.replace("\\n", "\n").replace('\\"', '"').replace('\\\\', '\\')
                    
                    with open("scratch/step_1755_replacement.txt", "w", encoding="utf-8") as out:
                        out.write(unescaped)
                    print("Wrote scratch/step_1755_replacement.txt successfully with formatting!")
                    break
        except Exception as e:
            print("Error:", e)
