from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import base64
import mimetypes
import logging
import uuid
from pathlib import Path
import requests
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware - allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    logger.info(f"Headers: {request.headers}")
    
    response = await call_next(request)
    
    logger.info(f"Response status: {response.status_code}")
    return response

# Configuration
API_KEY = "sk-joeaxYxqH9vIpzBvL6Y71hTR2biPS7aHgCXeoNIpCZ0zbXjx"  # Replace with your actual API key
API_URL = "https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale"
SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

# Create uploads directory if it doesn't exist
UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

@app.post("/upscale")
async def upscale_image(request: Request, image: UploadFile = File(...)):
    logger.info(f"Received file: {image.filename}")
    logger.info(f"Content type: {image.content_type}")
    
    if not image.filename:
        logger.error("No filename provided")
        return {"error": "No file provided or invalid file"}
    
    # Get mime type
    mime_type = mimetypes.guess_type(image.filename)[0] or "application/octet-stream"
    
    # Prepare the request to Stability AI
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "image/*"
    }
    
    # Create uploads directory if it doesn't exist
    UPLOADS_DIR.mkdir(exist_ok=True)
    
    # Create a temporary file with a unique name
    file_ext = os.path.splitext(image.filename)[1] or '.png'
    temp_file = UPLOADS_DIR / f"temp_{uuid.uuid4()}{file_ext}"
    
    logger.info(f"Using temporary file: {temp_file}")
    try:
        # Read and save the uploaded file
        file_content = await image.read()
        if not file_content:
            raise ValueError("Received empty file")
        
        with open(temp_file, "wb") as f:
            f.write(file_content)
            
        logger.info(f"Saved {len(file_content)} bytes to {temp_file}")
        
        # Make API request
        with open(temp_file, "rb") as f:
            # Create proper file tuple: (filename, file-like, content_type)
            files = {
                'image': (image.filename, f, image.content_type)
            }
            data = {
                'width': 2048,
                'height': 2048,
                'scale': 2
            }
            
            logger.info(f"Sending request to {API_URL}")
            logger.info(f"Headers: {headers}")
            logger.info(f"Files: {list(files.keys())}")
            logger.info(f"Data: {data}")
            
            try:
                response = requests.post(
                    API_URL,
                    headers=headers,
                    files=files,
                    data=data,
                    timeout=30
                )
                
                logger.info(f"API Response Status: {response.status_code}")
                logger.info(f"API Response Headers: {response.headers}")
                
                # Log response content (first 500 chars)
                response_text = response.text[:500] if response.text else ""
                logger.info(f"API Response (first 500 chars): {response_text}")
                
                if response.status_code == 200:
                    # If successful, return the image data
                    upscaled_image = response.content
                    if not upscaled_image:
                        return {"error": "Received empty image data from API"}
                    
                    return {
                        "original": base64.b64encode(file_content).decode('utf-8'),
                        "upscaled": base64.b64encode(upscaled_image).decode('utf-8'),
                        "filename": image.filename
                    }
                else:
                    # Try to get error details
                    try:
                        error_data = response.json()
                        logger.error(f"API Error Response: {error_data}")
                        return {"error": error_data.get('message', f'API error: {response.status_code}')}
                    except:
                        return {"error": f"API request failed with status {response.status_code}", "details": response_text}
                        
            except requests.exceptions.RequestException as e:
                logger.error(f"Request error: {str(e)}")
                if hasattr(e, 'response') and e.response is not None:
                    logger.error(f"Response status: {e.response.status_code}")
                    logger.error(f"Response headers: {dict(e.response.headers)}")
                    try:
                        logger.error(f"Response content: {e.response.text}")
                    except:
                        logger.error("Could not read response content")
                return {"error": f"API request failed: {str(e)}"}
                
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return {"error": f"Error processing image: {str(e)}"}
        
    finally:
        # Clean up temp file
        try:
            if 'temp_file' in locals() and temp_file.exists():
                temp_file.unlink()
        except Exception as e:
            logger.error(f"Error cleaning up temp file: {str(e)}")

@app.get("/")
async def read_root():
    return {"status": "running", "time": str(datetime.now())}

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on http://0.0.0.0:8000")
    print("API Documentation: http://0.0.0.0:8000/docs")
    # Use the module:app format for better compatibility
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
