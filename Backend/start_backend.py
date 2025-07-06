#!/usr/bin/env python3
"""
Backend startup script for Nestleforge
This script checks for environment variables and starts the backend server
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check if environment variables are set"""
    load_dotenv()
    
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("⚠️  Supabase credentials not found!")
        print("Please run the setup script first:")
        print("  python setup_env.py")
        print()
        print("Or create a .env file manually with:")
        print("  SUPABASE_URL=your_supabase_url")
        print("  SUPABASE_KEY=your_supabase_key")
        print("  SUPABASE_BUCKET_NAME=converted-images")
        return False
    
    print("✅ Environment variables found")
    return True

def start_server():
    """Start the Flask server"""
    try:
        from compress import app
        print("🚀 Starting backend server on http://localhost:5001")
        print("📝 Press Ctrl+C to stop the server")
        app.run(debug=True, port=5001, host='0.0.0.0')
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    print("🔧 Nestleforge Backend")
    print("=" * 30)
    
    if check_environment():
        start_server()
    else:
        sys.exit(1) 