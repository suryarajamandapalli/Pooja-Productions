import json

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx in [1820, 1821, 1822]:
                print(f"\n--- STEP {step_idx} ---")
                print("Keys:", list(step.keys()))
                print("Source:", step.get("source"))
                print("Type:", step.get("type"))
                
                content = step.get("content", "")
                if content:
                    print(f"Content length: {len(content)}")
                    if "Structured Footer" in content or "footer" in content:
                        print("Found 'Structured Footer' or 'footer' in content!")
                        # Write the full content to a file
                        with open(f"scratch/step_{step_idx}_content.txt", "w", encoding="utf-8") as out:
                            out.write(content)
                        print(f"Wrote scratch/step_{step_idx}_content.txt")
                        
                # Check for tool_results/results in the step if any
                for key in ["results", "tool_results", "response"]:
                    if key in step:
                        val = str(step[key])
                        print(f"{key} length: {len(val)}")
                        if "Structured Footer" in val:
                            print(f"Found 'Structured Footer' in {key}!")
                            with open(f"scratch/step_{step_idx}_{key}.txt", "w", encoding="utf-8") as out:
                                out.write(val)
                            print(f"Wrote scratch/step_{step_idx}_{key}.txt")
        except Exception as e:
            print("Error parsing line:", e)
