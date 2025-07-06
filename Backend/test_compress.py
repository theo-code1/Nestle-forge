#!/usr/bin/env python3
"""
Test script for the compression endpoint
"""

import requests
import io
from PIL import Image

def test_compression():
    """Test the compression endpoint"""
    print("🧪 Testing compression endpoint...")
    
    # Create a test image
    test_image = Image.new('RGB', (100, 100), color='red')
    img_buffer = io.BytesIO()
    test_image.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    # Prepare the request
    files = {'image': ('test.png', img_buffer, 'image/png')}
    
    try:
        response = requests.post('http://localhost:5001/compress', files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        
        if response.status_code == 200:
            print("✅ Compression successful!")
            
            # Check if it's a blob or JSON
            content_type = response.headers.get('content-type', '')
            if 'application/json' in content_type:
                result = response.json()
                print(f"Supabase URL: {result.get('public_url')}")
            else:
                print(f"Blob size: {len(response.content)} bytes")
                
        else:
            print(f"❌ Compression failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running on port 5001")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_compression() 