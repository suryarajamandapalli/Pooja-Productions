import urllib.request
import urllib.error
import json

base_url = "https://qhmqysxlugrkfyizhair.supabase.co/rest/v1/"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g"

tables_to_test = ["cms_content", "content", "submissions", "contact_submissions", "pitches", "users", "media"]

for table in tables_to_test:
    url = f"{base_url}{table}?select=*"
    req = urllib.request.Request(url)
    req.add_header("apikey", key)
    req.add_header("Authorization", f"Bearer {key}")
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Table '{table}': EXISTS (Status 200)")
            data = response.read().decode('utf-8')
            print(f"  Sample data: {data[:200]}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"Table '{table}': DOES NOT EXIST (Status 404)")
        else:
            print(f"Table '{table}': ERROR {e.code} | {e.reason}")
    except Exception as e:
        print(f"Table '{table}': Exception: {e}")
