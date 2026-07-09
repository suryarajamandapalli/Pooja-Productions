import urllib.request
import urllib.error
import json

url = "https://qhmqysxlugrkfyizhair.supabase.co/storage/v1/bucket"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g"
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        buckets = json.loads(data)
        print("Supabase Storage Buckets:")
        print(json.dumps(buckets, indent=2))
except urllib.error.HTTPError as e:
    print(f"Error querying Supabase storage: HTTP {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Exception:", e)
