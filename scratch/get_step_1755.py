import json
import sys

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get("step_index") == 1755:
                print("Found step 1755!")
                for tc in step.get("tool_calls", []):
                    args = tc.get("args", {})
                    # Write target content and replacement content to a text file
                    with open("scratch/step_1755_details.txt", "w", encoding="utf-8") as out:
                        out.write("=== TARGET CONTENT ===\n")
                        out.write(args.get("TargetContent", ""))
                        out.write("\n\n=== REPLACEMENT CONTENT ===\n")
                        out.write(args.get("ReplacementContent", ""))
                    print("Wrote scratch/step_1755_details.txt")
                    break
        except Exception as e:
            print("Error:", e)
