import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

@app.route('/remove-background', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']

    try:
        input_bytes = image_file.read()
        output_bytes = remove(input_bytes)

        output_image = Image.open(io.BytesIO(output_bytes)).convert("RGBA")
        output_io = io.BytesIO()
        output_image.save(output_io, format='PNG')
        output_io.seek(0)

        return send_file(output_io, mimetype='image/png')
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)