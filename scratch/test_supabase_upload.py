import urllib.request
import urllib.error
import json

base_url = "https://qhmqysxlugrkfyizhair.supabase.co/storage/v1/object/uploads/test_txt_file.txt"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g"

data = b"Hello from Supabase upload test!"
req = urllib.request.Request(base_url, data=data, method="POST")
req.add_header("apikey", key)
req.add_header("Authorization", f"Bearer {key}")
req.add_header("Content-Type", "text/plain")

try:
    with urllib.request.urlopen(req) as response:
        res_data = response.read().decode('utf-8')
        print("UPLOAD SUCCESS!")
        print(res_data)
except urllib.error.HTTPError as e:
    print(f"Upload failed: HTTP {e.code} | {e.reason}")
    try:
        print("Body:", e.read().decode('utf-8'))
    except Exception:
        pass
except Exception as e:
    print("Exception:", e)
