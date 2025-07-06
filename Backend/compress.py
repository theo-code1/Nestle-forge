from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import io
import os
from supabase_config import get_supabase_storage

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/compress', methods=['POST'])
def compress_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in request'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    if file and allowed_file(file.filename):
        try:
            # Get original file size
            file_stream = file.stream
            original_size = len(file_stream.read())
            file_stream.seek(0)  # Reset stream position
            
            # Open and process image
            img = Image.open(file_stream)
            img_format = img.format or "JPEG"

            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize if image is too large (max 2000px on the longest side)
            max_size = (2000, 2000)
            img.thumbnail(max_size, Image.LANCZOS)
            
            # Save with optimization and quality settings
            buffer = io.BytesIO()
            quality = 60  # Slightly higher quality than before
            img.save(buffer, format=img_format, 
                    optimize=True, 
                    quality=quality,
                    progressive=True)  # Progressive loading for JPEGs
            
            compressed_size = buffer.getbuffer().nbytes
            compression_ratio = ((original_size - compressed_size) / original_size) * 100
            
            buffer.seek(0)

            # Prepare response data
            response_data = {
                "success": True,
                "filename": file.filename,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "compression_ratio": round(compression_ratio, 2),
                "width": img.width,
                "height": img.height
            }

            # Check if Supabase is configured
            supabase_url = os.getenv('SUPABASE_URL')
            supabase_key = os.getenv('SUPABASE_KEY')
            
            if supabase_url and supabase_key:
                try:
                    # Upload to Supabase
                    supabase_storage = get_supabase_storage()
                    supabase_path = f"compressed/{file.filename}"
                    content_type = file.content_type or "image/jpeg"
                    public_url = supabase_storage.upload_file(
                        buffer.getvalue(), 
                        supabase_path, 
                        content_type
                    )
                    response_data["public_url"] = public_url
                    return jsonify(response_data)
                    
                except Exception as e:
                    print(f"Supabase upload failed: {e}")
                    # Continue to return the file directly if Supabase fails
                    pass

            # Return the compressed image as blob if Supabase not configured or failed
            response = send_file(
                buffer,
                mimetype=file.content_type or "image/jpeg",
                as_attachment=True,
                download_name=f"compressed_{file.filename}"
            )
            
            # Add compression info to headers
            response.headers['X-Original-Size'] = str(original_size)
            response.headers['X-Compressed-Size'] = str(compressed_size)
            response.headers['X-Compression-Ratio'] = str(round(compression_ratio, 2))
            
            return response

        except Exception as e:
            print("Exception during compression:", str(e))
            return jsonify({'error': f'Compression failed: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)