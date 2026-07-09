import urllib.request
import urllib.error
import json

bucket = "ignite-df8ae.firebasestorage.app"
file_path = "uploads/test_txt_file.txt"
encoded_path = "uploads%2Ftest_txt_file.txt"
url = f"https://firebasestorage.googleapis.com/v0/b/{bucket}/o?name={encoded_path}"

data = b"Hello from Pooja Productions CMS Audit!"
req = urllib.request.Request(url, data=data, method="POST")
req.add_header("Content-Type", "text/plain")

try:
    with urllib.request.urlopen(req) as response:
        res_data = response.read().decode('utf-8')
        meta = json.loads(res_data)
        print("UPLOAD SUCCESS!")
        print("Response metadata:")
        print(json.dumps(meta, indent=2))
        
        token = meta.get("downloadTokens", "")
        public_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encoded_path}?alt=media&token={token}"
        print("Public URL:", public_url)
except urllib.error.HTTPError as e:
    print(f"Upload failed: HTTP {e.code} | {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Exception during upload:", e)
