# Image Upscaler Backend

This is the backend service for the Image Upscaler application, built with FastAPI.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your API key:
   - Replace `your_dreamstudio_api_key_here` in `main.py` with your actual Stability AI API key

3. Run the server:
```bash
uvicorn main:app --reload
```

## API Endpoints

- `POST /upscale`: Upload an image to upscale it
  - Accepts: image file upload
  - Returns: upscaled image or error message

- `GET /`: Root endpoint with welcome message
