import subprocess

# Get list of all commits
commits = subprocess.check_output(["git", "rev-list", "--all"]).decode("utf-8").splitlines()
print(f"Total commits in repo: {len(commits)}")

found = False
for commit in commits:
    try:
        # Get diff of the commit for src/components/Contact.tsx
        diff = subprocess.check_output(["git", "show", commit, "--", "src/components/Contact.tsx"]).decode("utf-8")
        if "Structured Footer" in diff or "3-Column" in diff or "Quick Links" in diff:
            print(f"FOUND IN COMMIT: {commit}")
            # Print subject of commit
            subject = subprocess.check_output(["git", "log", "-1", "--format=%s", commit]).decode("utf-8").strip()
            print(f"  Subject: {subject}")
            found = True
    except Exception as e:
        pass

if not found:
    print("Not found in any commit.")
