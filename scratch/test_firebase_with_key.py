import urllib.request
import urllib.error
import json

buckets = ["ignite-df8ae.firebasestorage.app", "ignite-df8ae.appspot.com"]
key = "AIzaSyCDrdWi6ZiyKzOKf2tULXOnjqkdzYcDDFA"

for bucket in buckets:
    encoded_path = "uploads%2Ftest_txt_file.txt"
    # Added apiKey in key param!
    url = f"https://firebasestorage.googleapis.com/v0/b/{bucket}/o?name={encoded_path}&key={key}"
    data = b"Hello from Pooja Productions Firebase REST Upload with API Key!"
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "text/plain")
    
    print(f"Testing bucket: {bucket}")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            meta = json.loads(res_data)
            print(f"  SUCCESS for {bucket}!")
            print("  Response metadata:")
            print(json.dumps(meta, indent=2))
            
            token = meta.get("downloadTokens", "")
            public_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encoded_path}?alt=media&token={token}"
            print("  Public URL:", public_url)
            break
    except urllib.error.HTTPError as e:
        print(f"  Failed for {bucket}: HTTP {e.code}")
        print("  Body:", e.read().decode('utf-8').strip())
    except Exception as e:
        print(f"  Exception for {bucket}: {e}")
