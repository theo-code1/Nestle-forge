from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import os
import mimetypes
import requests
from pathlib import Path

app = FastAPI()

# Configuration
API_KEY = "sk-joeaxYxqH9vIpzBvL6Y71hTR2biPS7aHgCXeoNIpCZ0zbXjx"  # Replace with your actual API key
API_URL = "https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale"
SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

# Create uploads directory if it doesn't exist
UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

@app.post("/upscale")
async def upscale_image(image: UploadFile = File(...)):
    # Get file extension
    ext = os.path.splitext(image.filename)[1].lower()
    if ext not in SUPPORTED_FORMATS:
        return {"error": f"Unsupported format: {ext}"}
    
    # Get mime type
    mime_type = mimetypes.guess_type(image.filename)[0] or "application/octet-stream"
    
    # Read file contents
    contents = await image.read()
    
    # Prepare files and headers
    files = {"image": (image.filename, contents, mime_type)}
    headers = {"Authorization": f"Bearer {API_KEY}"}
    data = {"scale": 2}

    # Make API request
    response = requests.post(API_URL, headers=headers, files=files, data=data)

    if response.status_code == 200:
        # Save the upscaled image
        output_path = UPLOADS_DIR / f"upscaled_{image.filename}"
        with open(output_path, "wb") as f:
            f.write(response.content)
        
        return FileResponse(
            output_path,
            media_type=mime_type,
            filename=f"upscaled_{image.filename}"
        )
    else:
        return {"error": "Upscaling failed", "details": response.text}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Image Upscaler API"}
