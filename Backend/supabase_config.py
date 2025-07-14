import os
from supabase import create_client, Client
from dotenv import load_dotenv
import io
from datetime import datetime

# Load environment variables
load_dotenv()

class SupabaseStorage:
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_KEY')
        self.service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        self.bucket_name = os.getenv('SUPABASE_BUCKET_NAME', 'converted-images')
        
        if not self.url or not self.key:
            raise ValueError("Supabase URL and key must be set in environment variables")
        
        self.supabase: Client = create_client(self.url, self.key)
        
    def upload_file(self, file_data: bytes, filename: str, content_type: str = None, folder: str = None) -> str:
        """
        Upload a file to Supabase storage
        Returns the public URL of the uploaded file
        """
        try:
            # Support subfolders
            path = f"{folder}/{filename}" if folder else filename
            # Upload file to Supabase storage
            result = self.supabase.storage.from_(self.bucket_name).upload(
                path=path,
                file=file_data,
                file_options={"content-type": content_type} if content_type else None
            )
            # Get the public URL
            public_url = self.supabase.storage.from_(self.bucket_name).get_public_url(path)
            return public_url
        except Exception as e:
            print(f"Error uploading to Supabase: {e}")
            raise e
    
    def delete_file(self, filename: str):
        """
        Delete a file from Supabase storage
        """
        try:
            self.supabase.storage.from_(self.bucket_name).remove([filename])
        except Exception as e:
            print(f"Error deleting from Supabase: {e}")
            raise e
    
    def create_bucket_if_not_exists(self):
        """
        Create the storage bucket if it doesn't exist
        """
        try:
            # List buckets to check if ours exists
            buckets = self.supabase.storage.list_buckets()
            bucket_names = [bucket.name for bucket in buckets]
            
            if self.bucket_name not in bucket_names:
                # Create bucket with public access
                self.supabase.storage.create_bucket(
                    self.bucket_name,
                    {"public": True}
                )
                print(f"Created bucket: {self.bucket_name}")
            else:
                print(f"Bucket {self.bucket_name} already exists")
                
        except Exception as e:
            print(f"Error creating bucket: {e}")
            raise e

# Global instance
supabase_storage = None

def get_supabase_storage():
    global supabase_storage
    if supabase_storage is None:
        supabase_storage = SupabaseStorage()
        # Ensure bucket exists
        supabase_storage.create_bucket_if_not_exists()
    return supabase_storage 