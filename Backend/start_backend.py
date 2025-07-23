from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import io
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler

# Import configuration
from config import FRONTEND_URL

def handler(request: BaseHTTPRequestHandler, context):
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": '{"message": "Hello from Python"}'
    }

app = Flask(__name__)
CORS(app)

# --- Compress Route ---
ALLOWED_COMPRESS_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'}
MAX_WIDTH = 1600
MAX_HEIGHT = 1600
JPEG_QUALITY = 25
WEBP_QUALITY = 25

def allowed_compress_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_COMPRESS_EXTENSIONS

@app.route('/compress', methods=['POST'])
def compress_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_compress_file(file.filename):
        return jsonify({'error': 'Unsupported file type'}), 400

    try:
        original_bytes = file.read()
        original_size = len(original_bytes)
        image = Image.open(io.BytesIO(original_bytes))
        original_format = image.format
        image.info.pop("exif", None)
        image.info.pop("icc_profile", None)
        if image.width > MAX_WIDTH or image.height > MAX_HEIGHT:
            image.thumbnail((MAX_WIDTH, MAX_HEIGHT))
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
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
        output_buffer = io.BytesIO()
        image.save(output_buffer, **compress_kwargs)
        output_buffer.seek(0)
        compressed_bytes = output_buffer.getvalue()
        compressed_size = len(compressed_bytes)
        compression_ratio = 100 * (original_size - compressed_size) / original_size
        response = {
            "success": True,
            "original_size_kb": round(original_size / 1024, 2),
            "compressed_size_kb": round(compressed_size / 1024, 2),
            "compression_ratio_percent": round(compression_ratio, 2),
            "format": format.lower(),
            "image_data": compressed_bytes.hex()
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': f'Compression failed: {str(e)}'}), 500

# --- Convert Route ---
ALLOWED_CONVERT_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'}
def allowed_convert_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_CONVERT_EXTENSIONS
def generate_unique_filename(original_filename, target_format):
    timestamp = str(int(datetime.now().timestamp() * 1000000))
    base_name = os.path.splitext(original_filename)[0]
    return f"{timestamp}_{base_name}.{target_format.lower()}"

@app.route('/convert', methods=['POST'])
def convert_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    target_format = request.form.get('format')
    if not file or file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if not target_format:
        return jsonify({'error': 'No target format specified'}), 400
    if not allowed_convert_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    try:
        input_image = Image.open(file.stream)
        if target_format.lower() in ['jpg', 'jpeg']:
            if input_image.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', input_image.size, (255, 255, 255))
                if input_image.mode == 'RGBA':
                    background.paste(input_image, mask=input_image.split()[3])
                else:
                    background.paste(input_image, mask=input_image.split()[1])
                input_image = background
            elif input_image.mode != 'RGB':
                input_image = input_image.convert('RGB')
        output_filename = generate_unique_filename(file.filename, target_format)
        save_format = 'JPEG' if target_format.lower() in ['jpg', 'jpeg'] else target_format.upper()
        img_buffer = io.BytesIO()
        input_image.save(img_buffer, format=save_format)
        img_buffer.seek(0)
        content_type = f'image/{target_format.lower()}'
        return send_file(
            img_buffer,
            as_attachment=True,
            download_name=output_filename,
            mimetype=content_type
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return jsonify({
            'error': 'Error processing image',
            'details': str(e),
            'type': type(e).__name__
        }), 500

@app.route('/api/config', methods=['GET'])
def get_config_endpoint():
    return jsonify({
        'frontendUrl': FRONTEND_URL
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)