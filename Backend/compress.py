from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
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
            img = Image.open(file.stream)
            img_format = img.format or "JPEG"

            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            buffer = io.BytesIO()
            img.save(buffer, format=img_format, optimize=True, quality=40)
            buffer.seek(0)

            supabase_storage = get_supabase_storage()
            supabase_path = f"compressed/{file.filename}"
            content_type = file.content_type or "image/jpeg"
            public_url = supabase_storage.upload_file(buffer.getvalue(), supabase_path, content_type)

            return jsonify({
                "success": True,
                "public_url": public_url,
                "filename": file.filename
            })

        except Exception as e:
            print("Exception during compression/upload:", str(e))
            return jsonify({'error': f'Compression failed: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)