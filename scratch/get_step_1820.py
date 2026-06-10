import json

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get("step_index") == 1820:
                print("Found step 1820!")
                # Check what is inside this step
                # A view_file tool call might have tool output/response in content or in another field
                with open("scratch/step_1820_details.txt", "w", encoding="utf-8") as out:
                    out.write(json.dumps(step, indent=2))
                print("Wrote scratch/step_1820_details.txt")
                break
        except Exception as e:
            print("Error:", e)
