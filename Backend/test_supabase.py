import os
from dotenv import load_dotenv
from supabase import create_client
from supabase_config import get_supabase_storage  # ✅ This is correct
from PIL import Image
import io

# Load environment variables
load_dotenv()

def test_supabase_connection():
    print("Testing Supabase connection...")
    
    # Get credentials
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    bucket_name = os.getenv('SUPABASE_BUCKET_NAME', 'converted-images')
    
    print(f"URL: {url}")
    print(f"Key: {key[:20]}..." if key else "Key: None")
    print(f"Bucket: {bucket_name}")
    
    if not url or not key:
        print("❌ Missing Supabase credentials in .env file")
        return False
    
    try:
        # Create Supabase client
        supabase = create_client(url, key)
        print("✅ Supabase client created successfully")
        
        # Test bucket creation
        try:
            buckets = supabase.storage.list_buckets()
            bucket_names = [bucket.name for bucket in buckets]
            print(f"Available buckets: {bucket_names}")
            
            if bucket_name not in bucket_names:
                print(f"Creating bucket: {bucket_name}")
                supabase.storage.create_bucket(
                    name=bucket_name,
                    options={"public": True}
                )
                print(f"✅ Bucket '{bucket_name}' created")
            else:
                print(f"✅ Bucket '{bucket_name}' already exists")
                
        except Exception as e:
            print(f"❌ Error with bucket: {e}")
            return False
        
        # Create a test image
        print("Creating test image...")
        test_image = Image.new('RGB', (100, 100), color='red')
        img_buffer = io.BytesIO()
        test_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        # Upload test file
        test_filename = "test_image.png"
        print(f"Uploading {test_filename}...")
        
        result = supabase.storage.from_(bucket_name).upload(
            path=test_filename,
            file=img_buffer.getvalue(),
            file_options={"content-type": "image/png"}
        )
        
        print("✅ Test file uploaded successfully!")
        
        # Get public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(test_filename)
        print(f"Public URL: {public_url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_supabase_connection() 