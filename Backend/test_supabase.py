from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print("URL:", url)
print("KEY:", key[:6] + "..." if key else None)

try:
    supabase = create_client(url, key)
    # Try listing buckets as a test
    buckets = supabase.storage.list_buckets()
    print("Buckets:", buckets)
except Exception as e:
    print("Error:", e)