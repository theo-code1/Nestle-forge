# Debugging Guide for Nestleforge Backend

## Issues Fixed

### 1. Missing Environment Variables
- **Problem**: No `.env` file with Supabase credentials
- **Solution**: Run `python setup_env.py` to configure Supabase

### 2. Response Format Mismatch
- **Problem**: Backend returned JSON but frontend expected blob
- **Solution**: Modified `compress.py` to return blob by default, with JSON fallback for Supabase

### 3. Backend Server Not Running
- **Problem**: Flask server needs to be running on port 5001
- **Solution**: Use `python start_backend.py` to start the server

## Setup Instructions

### 1. Configure Supabase (Optional)
If you want to use Supabase for file storage:

```bash
cd Backend
python setup_env.py
```

Follow the prompts to enter your Supabase credentials.

### 2. Start Backend Server
```bash
cd Backend
python start_backend.py
```

Or manually:
```bash
cd Backend
python compress.py
```

### 3. Start Frontend
In a new terminal:
```bash
npm run dev
```

## Testing

### Test Supabase Connection
```bash
cd Backend
python test_supabase.py
```

### Test Compression Without Supabase
The compression will work even without Supabase configured - it will return the compressed image as a blob.

## Common Issues

### 1. "Compression failed" Alert
- Check if backend server is running on port 5001
- Check browser console for detailed error messages
- Ensure the image file is supported (PNG, JPG, JPEG, WEBP)

### 2. CORS Errors
- Backend has CORS enabled, but check if the frontend is making requests to the correct URL
- Default API URL is `http://localhost:5001`

### 3. Supabase Errors
- If Supabase is not configured, the system will fall back to blob response
- Check your Supabase credentials in the `.env` file
- Ensure your Supabase bucket exists and is public

## File Structure
```
Backend/
├── compress.py          # Compression endpoint
├── convert.py           # Conversion endpoint  
├── supabase_config.py   # Supabase configuration
├── test_supabase.py     # Supabase connection test
├── setup_env.py         # Environment setup script
├── start_backend.py     # Backend startup script
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables (create this)
```

## API Endpoints

### POST /compress
- **Input**: FormData with 'image' field
- **Output**: Compressed image blob or JSON with Supabase URL
- **Supported formats**: PNG, JPG, JPEG, WEBP

### POST /convert  
- **Input**: FormData with 'file' and 'format' fields
- **Output**: Converted image blob or JSON with Supabase URL
- **Supported formats**: PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, ICO, AVIF 