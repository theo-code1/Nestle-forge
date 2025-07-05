import os
import subprocess
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tempfile
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# App setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configuration
INKSCAPE_BIN = r"C:\Program Files\Inkscape\bin\inkscape.exe"  # Ensure this path is correct
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'pdf', 'eps', 'ai'}
VECTOR_FORMATS = {'svg', 'eps', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/convert', methods=['OPTIONS'])
def handle_options():
    return '', 204

@app.route('/convert', methods=['POST'])
def convert_image():
    logger.info("Received /convert request")

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    target_format = request.form.get('format', '').lower()
    if not target_format or target_format not in VECTOR_FORMATS:
        return jsonify({'error': 'Invalid or unsupported target format'}), 400

    try:
        timestamp = int(datetime.now().timestamp())
        input_filename = f"{timestamp}_{secure_filename(file.filename)}"
        input_path = os.path.join(UPLOAD_FOLDER, input_filename)
        file.save(input_path)

        name, _ = os.path.splitext(input_filename)
        output_filename = f"{name}_converted.{target_format}"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)

        command = [
            INKSCAPE_BIN,
            '--batch-process',
            '--export-type=' + target_format,
            '--export-filename=' + output_path,
            input_path
        ]

        if input_path.lower().endswith('.png'):
            command.insert(2, '--import-dpi=300')  # Helps suppress dialogs

        logger.info(f"Running command: {' '.join(command)}")

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode != 0:
            logger.error(f"Inkscape error: {result.stderr}")
            raise Exception(result.stderr)

        if not os.path.exists(output_path):
            raise Exception("Output file not created.")

        response = make_response(send_file(
            output_path,
            as_attachment=True,
            download_name=os.path.basename(output_path)
        ))

        # Cleanup after response
        response.call_on_close(lambda: os.remove(output_path) if os.path.exists(output_path) else None)
        os.remove(input_path)

        return response

    except subprocess.CalledProcessError as e:
        logger.error("Inkscape subprocess error", exc_info=True)
        return jsonify({'error': 'Conversion failed', 'details': e.stderr}), 500
    except Exception as e:
        logger.error("Unexpected error during conversion", exc_info=True)
        return jsonify({'error': 'Unexpected error', 'details': str(e)}), 500

@app.route('/vectorize', methods=['POST'])
def vectorize_image():
    logger.info("Received /vectorize request")

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = os.path.join(tmpdir, 'input.png')
            pbm_path = os.path.join(tmpdir, 'input.pbm')
            svg_path = os.path.join(tmpdir, 'output.svg')

            file.save(input_path)

            img = Image.open(input_path).convert('L')
            img = img.point(lambda x: 0 if x < 128 else 255, '1')
            img.save(pbm_path)

            result = subprocess.run(
                ['potrace', pbm_path, '-s', '-o', svg_path],
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                logger.error(f"Potrace error: {result.stderr}")
                return jsonify({'error': 'Potrace failed', 'details': result.stderr}), 500

            return send_file(svg_path, mimetype='image/svg+xml', as_attachment=True, download_name='vectorized.svg')

    except Exception as e:
        logger.error("Unexpected error during vectorization", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    logger.info(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    app.run(host='0.0.0.0', port=5000, debug=True)
