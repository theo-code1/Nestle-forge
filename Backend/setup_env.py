#!/usr/bin/env python3
"""
Setup script for Supabase configuration
Run this script to create a .env file with your Supabase credentials
"""

import os

def create_env_file():
    """Create a .env file with Supabase configuration"""
    
    # Check if .env already exists
    if os.path.exists('.env'):
        print("⚠️  .env file already exists!")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("Setup cancelled.")
            return
    
    print("🔧 Setting up Supabase configuration...")
    print("\nYou'll need your Supabase project credentials.")
    print("Get them from: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api")
    print()
    
    # Get Supabase credentials
    supabase_url = input("Enter your Supabase URL: ").strip()
    supabase_key = input("Enter your Supabase anon key: ").strip()
    service_role_key = input("Enter your Supabase service role key (optional): ").strip()
    bucket_name = input("Enter bucket name (default: converted-images): ").strip() or "converted-images"
    
    # Create .env content
    env_content = f"""# Supabase Configuration
SUPABASE_URL={supabase_url}
SUPABASE_KEY={supabase_key}
SUPABASE_SERVICE_ROLE_KEY={service_role_key}
SUPABASE_BUCKET_NAME={bucket_name}
"""
    
    # Write .env file
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("\n✅ .env file created successfully!")
        print("📝 You can now run the backend server.")
        print("\nTo start the backend server, run:")
        print("  python compress.py")
        print("  python convert.py")
        
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")

def test_connection():
    """Test the Supabase connection"""
    print("\n🧪 Testing Supabase connection...")
    
    try:
        from test_supabase import test_supabase_connection
        success = test_supabase_connection()
        
        if success:
            print("✅ Supabase connection successful!")
        else:
            print("❌ Supabase connection failed. Check your credentials.")
            
    except Exception as e:
        print(f"❌ Error testing connection: {e}")

if __name__ == "__main__":
    print("🚀 Nestleforge Backend Setup")
    print("=" * 40)
    
    create_env_file()
    
    # Ask if user wants to test connection
    if os.path.exists('.env'):
        test = input("\nDo you want to test the Supabase connection? (Y/n): ")
        if test.lower() != 'n':
            test_connection()
    
    print("\n🎉 Setup complete!") 