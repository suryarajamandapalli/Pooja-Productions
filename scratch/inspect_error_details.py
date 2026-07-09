import urllib.request
import urllib.error

url = "https://qhmqysxlugrkfyizhair.supabase.co/rest/v1/"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXF5c3hsdWdya2Z5aXpoYWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjIyNzIsImV4cCI6MjA5NjU5ODI3Mn0.nH5ZGv4nk79AcdnETibUa5EcIemI5hqtMYQypNiIc8g"
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print("Success!")
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} | {e.reason}")
    print("Body:")
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Exception:", e)
