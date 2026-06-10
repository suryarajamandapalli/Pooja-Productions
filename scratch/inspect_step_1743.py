import json

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get("step_index") in [1743, 1744]:
                print(f"Step {step.get('step_index')}:")
                print(json.dumps(step, indent=2))
        except Exception:
            pass
