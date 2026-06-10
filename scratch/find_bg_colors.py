import re

with open("src/main.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's search for rules matching contact, inner, page-content, or body
# and print their background/background-color declarations
patterns = [
    r"\.contact\s*\{[^}]*background[^}]*\}",
    r"\.inner\s*\{[^}]*background[^}]*\}",
    r"\.page-content\s*\{[^}]*background[^}]*\}",
    r"body\s*\{[^}]*background[^}]*\}",
    r"\.footer\s*\{[^}]*background[^}]*\}"
]

for p in patterns:
    matches = re.finditer(p, css, re.IGNORECASE)
    for m in matches:
        print(f"Match: {m.group(0)}")
