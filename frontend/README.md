# Nestleforge - AI Image Upscaler

Nestleforge is a web application that uses AI to upscale images with high quality. It supports upscaling images by 2x, 4x, or 8x using the Stability AI API.

## Features

- Drag and drop image upload
- Multiple upscale modes (2x, 4x, 8x)
- Side-by-side comparison of original and upscaled images
- Responsive design that works on desktop and mobile

## Prerequisites

- Node.js (v16 or later)
- Python (v3.8 or later)
- pip (Python package manager)
- A Stability AI API key (get one at [Stability AI](https://stability.ai/))

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up your environment variables. Create a `.env` file in the project root with:
   ```
   DREAMSTUDIO_API_KEY=your_api_key_here
   BACKEND_PORT=8000
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the backend server:
   ```bash
   python main.py
   ```
   The server will start on `http://localhost:8000`

### Frontend Setup

1. In a new terminal, navigate to the project root:
   ```bash
   cd /path/to/nestleforge
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Usage

1. Open the application in your browser at `http://localhost:5173`
2. Click "Upload Image" or drag and drop an image file
3. Select an upscale mode (2x, 4x, or 8x)
4. Click "Upscale Image"
5. View the upscaled image and use the comparison slider to compare with the original

## Troubleshooting

- **API Key Issues**: Ensure your Stability AI API key is correctly set in the `.env` file
- **CORS Errors**: Make sure both frontend and backend servers are running and the URLs in the CORS configuration match
- **Large Files**: The maximum file size is 10MB. For larger files, consider compressing them first

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
