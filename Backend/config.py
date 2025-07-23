from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Export FRONTEND_URL with a default value if not set
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
