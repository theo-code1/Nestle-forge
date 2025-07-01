from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "39492060010516ab6208f954a8a09512"

logging.basicConfig(level=logging.INFO)

@app.post("/upscale/")
async def upscale_image(
    request: Request,
    file: UploadFile = File(...),
    scale: int = Form(2)  # Default to 2x if not provided
):
    logger.info(f"Received upload request for file: {file.filename}")
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Scale: {scale}, Content-Type: {file.content_type}")

    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        error_msg = f"Invalid file type: {file.content_type}. Only JPG, PNG, and WebP are supported."
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)

    try:
        # Read file content
        image_bytes = await file.read()
        logger.info(f"Read {len(image_bytes)} bytes from file")

        # Prepare the request to the upscaling API
        url = "https://api.image-upscaling.net/v1/upscale"
        
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Accept": "application/json"
        }

        # Prepare form data
        files = {
            'image': (file.filename, image_bytes, file.content_type)
        }
        
        data = {
            'scale': scale,
            'client_id': API_KEY  # Some APIs use client_id instead of Bearer token
        }

        logger.info(f"Sending request to {url} with scale={scale}")
        
        # Make the request with timeout
        timeout = 60.0  # seconds
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                url,
                headers=headers,
                files=files,
                data=data
            )

        logger.info(f"API response status: {response.status_code}")
        logger.info(f"API response headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            logger.info(f"API response data: {json.dumps(response_data, indent=2)[:500]}...")  # Log first 500 chars
        except Exception as e:
            logger.error(f"Failed to parse API response as JSON: {e}")
            logger.error(f"Raw response: {response.text[:500]}...")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid response from upscaling service: {str(e)}"
            )

        # Check for API errors
        if response.status_code != 200:
            error_msg = response_data.get('error', response_data.get('message', 'Unknown error'))
            logger.error(f"API error: {error_msg}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Upscaling API error: {error_msg}"
            )

        # Extract the result URL
        upscaled_url = response_data.get('url') or response_data.get('result_url')
        if not upscaled_url:
            logger.error(f"No URL in API response. Full response: {response_data}")
            raise HTTPException(
                status_code=500,
                detail="No image URL returned by upscaling service"
            )

        logger.info(f"Upscaling successful. Result URL: {upscaled_url}")
        return {"upscaled_url": upscaled_url}

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error from upscaling API: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with upscaling service: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error during upscaling: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )









# import logging
# from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, status
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
# from fastapi.staticfiles import StaticFiles
# from pathlib import Path
# from typing import Dict, Optional
# import requests
# import os
# import sys
# import uuid
# from pydantic import BaseModel
# import traceback

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.StreamHandler(sys.stdout)
#     ]
# )
# logger = logging.getLogger(__name__)

# app = FastAPI()

# # Allow CORS for development
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configuration
# # Get the directory where this script is located
# BASE_DIR = Path(__file__).parent.absolute()
# UPLOAD_DIR = BASE_DIR / "uploads"
# UPLOAD_DIR.mkdir(exist_ok=True)
# FRONTEND_DIR = BASE_DIR.parent / "dist"  # Assuming your frontend is built to 'dist' directory

# logger.info(f"Base directory: {BASE_DIR}")
# logger.info(f"Upload directory: {UPLOAD_DIR}")
# logger.info(f"Frontend directory: {FRONTEND_DIR}")

# # Mount static files
# if FRONTEND_DIR.exists():
#     app.mount("/static", StaticFiles(directory=FRONTEND_DIR / "static"), name="static")
#     logger.info("Static files mounted")
# else:
#     logger.warning(f"Frontend directory not found at {FRONTEND_DIR}")

# # Get client ID from environment variable
# CLIENT_ID = os.getenv("IMAGE_UPSCALE_CLIENT_ID")
# if not CLIENT_ID:
#     logger.error("IMAGE_UPSCALE_CLIENT_ID environment variable is not set")
#     logger.error("Please set the IMAGE_UPSCALE_CLIENT_ID environment variable")
#     # Don't exit, just log the error so we can see if this is the issue

# # Add a root route to serve the frontend
# @app.get("/", response_class=HTMLResponse)
# async def read_root():
#     index_path = FRONTEND_DIR / "index.html"
#     if index_path.exists():
#         return FileResponse(index_path)
#     return """
#     <html>
#         <head>
#             <title>Nestleforge Backend</title>
#             <style>
#                 body { font-family: Arial, sans-serif; margin: 40px; }
#                 .container { max-width: 800px; margin: 0 auto; }
#                 .info { background: #f0f0f0; padding: 20px; border-radius: 5px; }
#                 .endpoints { margin-top: 20px; }
#                 .endpoint { margin: 10px 0; padding: 10px; background: #f8f8f8; border-left: 4px solid #4CAF50; }
#             </style>
#         </head>
#         <body>
#             <div class="container">
#                 <h1>Nestleforge Backend</h1>
#                 <div class="info">
#                     <p>Backend server is running!</p>
#                     <p>To use the frontend, make sure to build the React app and place it in the 'dist' directory.</p>
#                 </div>
#                 <div class="endpoints">
#                     <h2>API Endpoints:</h2>
#                     <div class="endpoint">
#                         <strong>POST /upload</strong> - Upload and upscale an image<br>
#                         <em>Parameters:</em> file (image), scale (int, default=4)
#                     </div>
#                     <div class="endpoint">
#                         <strong>GET /status/{id}</strong> - Check status of an upscaling job
#                     </div>
#                 </div>
#             </div>
#         </body>
#     </html>
#     """

# class ImageStatus(BaseModel):
#     state: str
#     upscaled_image_url: Optional[str] = None
#     error: Optional[str] = None

# # In-memory storage for job status (replace with a database in production)
# jobs: Dict[str, ImageStatus] = {}

# # Global exception handler
# @app.exception_handler(Exception)
# async def global_exception_handler(request: Request, exc: Exception):
#     logger.error(f"Unhandled exception: {str(exc)}")
#     logger.error(traceback.format_exc())
#     return JSONResponse(
#         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         content={"detail": f"Internal Server Error: {str(exc)}"},
#     )

# @app.post("/upload")
# async def upload_image(request: Request, file: UploadFile = File(...), scale: str = Form("4")):
#     logger.info(f"Received upload request for file: {file.filename}")
#     logger.info(f"Request headers: {request.headers}")
#     # Validate file type
#     allowed_types = ["image/jpeg", "image/png", "image/webp"]
#     if not file.content_type or file.content_type not in allowed_types:
#         error_msg = f"Invalid file type: {file.content_type}. Only JPG, PNG, and WebP are supported."
#         logger.error(error_msg)
#         raise HTTPException(status_code=400, detail=error_msg)
    
#     # Validate file size (10MB max)
#     max_size = 10 * 1024 * 1024  # 10MB
#     file.file.seek(0, 2)  # Go to end of file
#     file_size = file.file.tell()
#     file.file.seek(0)  # Reset file pointer
    
#     if file_size > max_size:
#         raise HTTPException(status_code=400, detail="File size too large. Maximum size is 10MB.")
    
#     try:
#         # Save file locally
#         file_id = str(uuid.uuid4())
#         filename = f"{file_id}_{file.filename}"
#         file_path = os.path.join(UPLOAD_DIR, filename)
        
#         with open(file_path, "wb") as buffer:
#             buffer.write(await file.read())

#         # Initialize job status
#         jobs[file_id] = ImageStatus(state="processing")
#         logger.info(f"Created job {file_id} for file {file.filename}")

#         print(f"Calling upscaling API with file: {file_path}")
#         # Call Image-Upscaling.net API
#         try:
#             with open(file_path, "rb") as img_file:
#                 print(f"Sending request to upscaling API...")
#                 response = requests.post(
#                     "https://api.image-upscaling.net/v1/upscale",
#                     files={"image": (filename, img_file, file.content_type)},
#                     data={"scale": scale, "client_id": CLIENT_ID},
#                     timeout=60,
#                 )
#                 print(f"API Response Status: {response.status_code}")
#                 print(f"API Response: {response.text[:500]}")  # Print first 500 chars of response
#         except Exception as e:
#             print(f"Error calling upscaling API: {str(e)}")
#             raise

#         if response.status_code != 200:
#             jobs[file_id] = ImageStatus(
#                 state="failed",
#                 error=f"Upscaling API error: {response.text}"
#             )
#             raise HTTPException(status_code=400, detail=jobs[file_id].error)

#         result = response.json()
#         if "error" in result:
#             jobs[file_id] = ImageStatus(
#                 state="failed",
#                 error=result.get("error", "Unknown error from upscaling service")
#             )
#             raise HTTPException(status_code=400, detail=jobs[file_id].error)

#         # Update job status
#         jobs[file_id] = ImageStatus(
#             state="completed",
#             upscaled_image_url=result.get("url")  # Adjust this based on the actual API response
#         )

#         return {"id": file_id}

#     except requests.exceptions.RequestException as e:
#         jobs[file_id] = ImageStatus(
#             state="failed",
#             error=f"Failed to connect to upscaling service: {str(e)}"
#         )
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         if file_id in jobs:
#             jobs[file_id] = ImageStatus(
#                 state="failed",
#                 error=str(e)
#             )
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/status/{file_id}")
# async def get_status(file_id: str):
#     if file_id not in jobs:
#         raise HTTPException(status_code=404, detail="Job not found")
    
#     status = jobs[file_id]
#     return {
#         "state": status.state,
#         "upscaled_image_url": status.upscaled_image_url,
#         "error": status.error
#     }
