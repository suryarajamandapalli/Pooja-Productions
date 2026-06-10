import json
import sys

# Reconfigure stdout to use UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\surya\.gemini\antigravity\brain\58fc329b-fe14-401d-9f4e-32195b2485bb\.system_generated/logs/transcript.jsonl"
found = []

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            tool_calls = step.get("tool_calls", [])
            for tc in tool_calls:
                args = tc.get("args", {})
                target_file = args.get("TargetFile", "")
                if "Contact.tsx" in target_file or "Contact.tsx" in str(args):
                    found.append((step_idx, tc.get("name"), args))
        except Exception as e:
            pass

print(f"Total matching actions: {len(found)}")
for step_idx, name, args in found:
    print(f"Step {step_idx}: Tool={name}")
    # Print keys in args
    print(f"  Keys: {list(args.keys())}")
    if "Instruction" in args:
        print(f"  Instruction: {args['Instruction']}")
    if "Description" in args:
        print(f"  Description: {args['Description']}")
