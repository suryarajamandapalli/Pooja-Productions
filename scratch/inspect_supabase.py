import urllib.request
import json

url = "https://qhmqysxlugrkfyizhair.supabase.co/rest/v1/"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g"
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        swagger = json.loads(data)
        paths = swagger.get("paths", {})
        print("Available API paths (tables):")
        for path in paths.keys():
            print(path)
except Exception as e:
    print("Error querying Supabase:", e)
