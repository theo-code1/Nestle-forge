from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import base64
import requests
import logging
from typing import Optional

app = FastAPI()
logging.basicConfig(level=logging.INFO)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

API_KEY = "sk-joeaxYxqH9vIpzBvL6Y71hTR2biPS7aHgCXeoNIpCZ0zbXjx"
API_URL = "https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale"

@app.get("/")
async def root():
    return {"status": "Server is running"}

@app.post("/upscale")
async def upscale_image(
    image: UploadFile = File(...),
    mode: str = Form("2x")  # Default to 2x if not provided
):
    # Validate mode
    scale_map = {"2x": 2, "4x": 4, "8x": 8}
    if mode not in scale_map:
        raise HTTPException(status_code=400, detail="Invalid mode. Must be one of: 2x, 4x, 8x")
    
    scale = scale_map[mode]
    
    try:
        # Read the uploaded file
        file_bytes = await image.read()
        
        # Validate file size (e.g., 10MB max)
        max_size = 10 * 1024 * 1024  # 10MB
        if len(file_bytes) > max_size:
            raise HTTPException(status_code=400, detail=f"File too large. Max size is {max_size} bytes")
        
        # Prepare the request to Stability AI
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Accept": "image/*",
        }
        
        files = {
            "image": (image.filename, file_bytes, image.content_type),
        }
        
        data = {
            "width": 2048,
            "height": 2048,
            "scale": scale
        }
        
        # Make the request to Stability AI
        response = requests.post(
            API_URL,
            headers=headers,
            files=files,
            data=data,
            timeout=60  # 60 seconds timeout
        )
        
        # Check for errors
        response.raise_for_status()
        
        # Return the upscaled image
        upscaled_bytes = response.content
        upscaled_b64 = base64.b64encode(upscaled_bytes).decode("utf-8")
        return {"upscaled": upscaled_b64}
        
    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process image: {str(e)}"
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the image"
        )










# from fastapi import FastAPI, File, Form, UploadFile, Request
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# import os
# import base64
# import mimetypes
# import logging
# import uuid
# from pathlib import Path
# import requests
# from datetime import datetime

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# API_KEY = "sk-joeaxYxqH9vIpzBvL6Y71hTR2biPS7aHgCXeoNIpCZ0zbXjx"
# API_URL = "https://api.stability.ai/v2beta/images/upscale"
# SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}
# SUPPORTED_MODES = {"2x", "4x", "8x"}

# UPLOADS_DIR = Path("uploads")
# UPLOADS_DIR.mkdir(exist_ok=True)

# @app.post("/upscale")
# async def upscale_image(request: Request, image: UploadFile = File(...), mode: str = Form(...)):
#     logger.info(f"Received upscale request with mode: {mode}")
#     scale = {
#         "2x": 2,
#         "4x": 4,
#         "8x": 8
#     }.get(mode, 2)

#     ...
#     # Inside your data payload:
#     data = {
#         'width': 2048,
#         'height': 2048,
#         'scale': scale
#     }

# @app.get("/")
# async def health_check():
#     return {"status": "running", "timestamp": str(datetime.now())}
