from flask import Flask, request, jsonify, send_file
from PIL import Image
import os
from flask_cors import CORS
from datetime import datetime
import io

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'}

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
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)
        
        # Save the converted image
        input_image.save(output_path, format=target_format.upper())
        
        # Return the converted image
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
