from flask import Flask, request, jsonify, send_file
from PIL import Image
import os
from flask_cors import CORS
from datetime import datetime
import io
from supabase_config import get_supabase_storage

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        # Read the input image
        input_image = Image.open(file.stream)
        
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
        
        # Upload to Supabase storage
        try:
            supabase_storage = get_supabase_storage()
            content_type = f'image/{target_format.lower()}'
            public_url = supabase_storage.upload_file(
                img_buffer.getvalue(),
                output_filename,
                content_type
            )
            
            # Return the public URL instead of the file
            return jsonify({
                'success': True,
                'url': public_url,
                'filename': output_filename,
                'size': len(img_buffer.getvalue())
            })
            
        except Exception as e:
            print(f"Supabase upload error: {e}")
            # Fallback to local storage if Supabase fails
            output_path = os.path.join(UPLOAD_FOLDER, output_filename)
            input_image.save(output_path, format=save_format)
            
            return send_file(output_path, 
                            mimetype=f'image/{target_format.lower()}',
                            as_attachment=True,
                            download_name=output_filename)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/formats', methods=['GET'])
def get_supported_formats():
    return jsonify(list(ALLOWED_EXTENSIONS))

if __name__ == '__main__':
    app.run(debug=True, port=5001)
