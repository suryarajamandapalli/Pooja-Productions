import json

with open("scratch/old_footer.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Let's see if this is JSON-encoded or raw text
try:
    decoded = json.loads(f'"{content}"')
    print("Decoded as JSON string successfully!")
    with open("scratch/old_footer_formatted.txt", "w", encoding="utf-8") as out:
        out.write(decoded)
except Exception:
    # If not valid JSON, let's try evaluating as python string literal or manual unescaping
    try:
        # Evaluate as a raw python string literal
        import ast
        decoded = ast.literal_eval(content)
        print("Decoded with ast.literal_eval successfully!")
        with open("scratch/old_footer_formatted.txt", "w", encoding="utf-8") as out:
            out.write(decoded)
    except Exception as e:
        print("Fallback simple replace. Error:", e)
        decoded = content.replace("\\n", "\n").replace('\\"', '"').replace('\\\\', '\\')
        with open("scratch/old_footer_formatted.txt", "w", encoding="utf-8") as out:
            out.write(decoded)

print("Wrote scratch/old_footer_formatted.txt")
