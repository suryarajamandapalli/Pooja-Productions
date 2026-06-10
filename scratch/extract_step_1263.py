import json

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx in [1260, 1261, 1262, 1263, 1264, 1265]:
                print(f"Step {step_idx}: Source={step.get('source')} Type={step.get('type')}")
                # Check for ReplacementContent or tool_calls
                for tc in step.get("tool_calls", []):
                    args = tc.get("args", {})
                    rep = args.get("ReplacementContent", "")
                    if rep:
                        print(f"  Found ReplacementContent in tool_calls! Length: {len(rep)}")
                        with open(f"scratch/step_{step_idx}_replacement.txt", "w", encoding="utf-8") as out:
                            out.write(rep)
                        print(f"  Wrote scratch/step_{step_idx}_replacement.txt")
                    chunks = args.get("ReplacementChunks", [])
                    if chunks:
                        print(f"  Found {len(chunks)} chunks in tool_calls!")
                        for idx, c in enumerate(chunks):
                            rc = c.get("ReplacementContent", "")
                            with open(f"scratch/step_{step_idx}_chunk_{idx}.txt", "w", encoding="utf-8") as out:
                                out.write(rc)
                            print(f"    Wrote scratch/step_{step_idx}_chunk_{idx}.txt (len {len(rc)})")
        except Exception as e:
            pass
