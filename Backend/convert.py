from flask import Flask, request, jsonify, send_file
from PIL import Image
import os
from flask_cors import CORS
from datetime import datetime
import io
import requests

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(original_filename, target_format):
    timestamp = str(int(datetime.now().timestamp() * 1000000))
    base_name = os.path.splitext(original_filename)[0]
    return f"{timestamp}_{base_name}.{target_format.lower()}"

@app.route('/test')
def test():
    return "This is the right Flask file!"

@app.route('/convert', methods=['POST'])
def convert_image():
    print("\n=== New Conversion Request ===")
    print(f"Request headers: {request.headers}")
    print(f"Request form data: {request.form}")
    
    if 'file' not in request.files:
        print("Error: No file in request")
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    target_format = request.form.get('format')
    
    print(f"Processing file: {file.filename}")
    print(f"Target format: {target_format}")
    
    if not file or file.filename == '':
        print("Error: No file selected")
        return jsonify({'error': 'No file selected'}), 400
    
    if not target_format:
        print("Error: No target format specified")
        return jsonify({'error': 'No target format specified'}), 400
    
    if not allowed_file(file.filename):
        print(f"Error: File type not allowed: {file.filename}")
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        print("Opening image...")
        input_image = Image.open(file.stream)
        print(f"Image opened successfully. Format: {input_image.format}, Size: {input_image.size}, Mode: {input_image.mode}")
        
        # If image is in RGBA mode and target format is JPEG, convert to RGB
        if target_format.lower() in ['jpg', 'jpeg']:
            if input_image.mode in ('RGBA', 'LA'):
                # Create a white background
                background = Image.new('RGB', input_image.size, (255, 255, 255))
                if input_image.mode == 'RGBA':
                    background.paste(input_image, mask=input_image.split()[3])  # 3 is alpha
                else:  # 'LA'
                    background.paste(input_image, mask=input_image.split()[1])  # 1 is alpha
                input_image = background
            elif input_image.mode != 'RGB':
                input_image = input_image.convert('RGB')
        
        # Create output filename
        output_filename = generate_unique_filename(file.filename, target_format)
        
        # Save the converted image to a bytes buffer
        save_format = 'JPEG' if target_format.lower() in ['jpg', 'jpeg'] else target_format.upper()
        img_buffer = io.BytesIO()
        input_image.save(img_buffer, format=save_format)
        img_buffer.seek(0)
        
        # Return the converted image as a file download
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
        print(f"Error processing image: {error_details}")
        return jsonify({
            'error': 'Error processing image',
            'details': str(e),
            'type': type(e).__name__
        }), 500

# (Removed Supabase download endpoint as requested)

@app.route('/formats', methods=['GET'])
def get_supported_formats():
    return jsonify(list(ALLOWED_EXTENSIONS))

if __name__ == '__main__':
    app.run(debug=True, port=5001)
