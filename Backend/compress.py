import os
import io
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (useful for React frontend)

# Set allowed image extensions
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
            img = Image.open(file.stream)
            img_format = img.format or "JPEG"

            # Convert to RGB if needed
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            buffer = io.BytesIO()
            img.save(buffer, format=img_format, optimize=True, quality=40)  # You can tweak quality
            buffer.seek(0)

            return send_file(
                buffer,
                mimetype=f'image/{img_format.lower()}',
                download_name=f"compressed_{file.filename}"
            )
        except Exception as e:
            return jsonify({'error': f'Compression failed: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
