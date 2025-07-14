from flask import Flask, request, jsonify
from PIL import Image
import io
import os
from flask_cors import CORS
from supabase_config import get_supabase_storage

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'}

# Compression config
MAX_WIDTH = 1600
MAX_HEIGHT = 1600
JPEG_QUALITY = 25
WEBP_QUALITY = 25

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/compress', methods=['POST'])
def compress_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Unsupported file type'}), 400

    try:
        original_bytes = file.read()
        original_size = len(original_bytes)

        # Open image
        image = Image.open(io.BytesIO(original_bytes))
        original_format = image.format

        # Remove metadata
        image.info.pop("exif", None)
        image.info.pop("icc_profile", None)

        # Resize large images
        if image.width > MAX_WIDTH or image.height > MAX_HEIGHT:
            image.thumbnail((MAX_WIDTH, MAX_HEIGHT))

        # Convert to RGB for lossy formats
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        # Choose format and compression
        format = 'JPEG' if original_format.lower() in ['jpg', 'jpeg', 'bmp', 'tiff'] else 'WEBP'
        compress_kwargs = {}

        if format == 'JPEG':
            compress_kwargs = {
                'format': 'JPEG',
                'quality': JPEG_QUALITY,
                'optimize': True,
                'progressive': True
            }
        elif format == 'WEBP':
            compress_kwargs = {
                'format': 'WEBP',
                'quality': WEBP_QUALITY,
                'method': 6
            }

        # Save to buffer
        output_buffer = io.BytesIO()
        image.save(output_buffer, **compress_kwargs)
        output_buffer.seek(0)

        compressed_bytes = output_buffer.getvalue()
        compressed_size = len(compressed_bytes)
        compression_ratio = 100 * (original_size - compressed_size) / original_size
        
        # Upload to Supabase
        supabase_storage = get_supabase_storage()
        output_filename = f"compressed_{file.filename}"
        content_type = f"image/{format.lower()}"
        public_url = supabase_storage.upload_file(
            compressed_bytes,
            output_filename,
            content_type,
            folder='Compressed'
        )
        # Create a response with the compressed image and public URL
        response = {
            "success": True,
            "original_size_kb": round(original_size / 1024, 2),
            "compressed_size_kb": round(compressed_size / 1024, 2),
            "compression_ratio_percent": round(compression_ratio, 2),
            "format": format.lower(),
            "public_url": public_url,
            "filename": output_filename,
            "size": compressed_size
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': f'Compression failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
