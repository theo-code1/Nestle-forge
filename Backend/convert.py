import os
import subprocess
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS to allow requests from your frontend
CORS(app, resources={
    r"/convert": {
        "origins": ["http://localhost:5173"],  # Update with your frontend URL
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

INKSCAPE_BIN = "C:\Program Files\Inkscape\bin\inkscape.com"

# command = [INKSCAPE_BIN, input_path, '--export-filename=' + output_path]


UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'pdf', 'eps', 'ai'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/convert', methods=['POST'])
def convert_image():
    logger.info("Received conversion request")

    if 'file' not in request.files:
        logger.error("No file part in the request")
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    if not file or not allowed_file(file.filename):
        logger.error(f"File type not allowed: {file.filename}")
        return jsonify({'error': 'File type not allowed'}), 400

    target_format = request.form.get('format', '').lower()
    if not target_format:
        logger.error("No target format specified")
        return jsonify({'error': 'Target format is required'}), 400

    try:
        logger.info(f"Converting to format: {target_format}")

        timestamp = int(datetime.now().timestamp())
        input_filename = f"{timestamp}_{secure_filename(file.filename)}"
        input_path = os.path.join(UPLOAD_FOLDER, input_filename)
        file.save(input_path)
        logger.info(f"File saved to: {input_path}")

        if not os.path.exists(input_path):
            raise Exception(f"Failed to save file to {input_path}")

        logger.info(f"File size: {os.path.getsize(input_path)} bytes")

        name, _ = os.path.splitext(input_filename)
        output_filename = f"{name}_converted.{target_format}"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)

        # Only allow vector conversions for SVG, EPS, PDF
        vector_formats = ['svg', 'eps', 'pdf']
        if target_format not in vector_formats:
            logger.error(f"Target format {target_format} is not supported for vector conversion.")
            return jsonify({'error': f'Only SVG, EPS, and PDF conversions are supported by this endpoint.'}), 400

        # Check if Inkscape is available
        version_check = subprocess.run(
            ['inkscape', '--version'],
            capture_output=True,
            text=True
        )
        logger.info(f"Inkscape version check: {version_check.stdout or version_check.stderr}")

        # Build conversion command
        command = [
            'inkscape',
            '--export-filename=' + output_path
        ]

        # Handle different vector formats
        if target_format == 'svg':
            command.extend(['--export-plain-svg', '--export-type=svg'])
        elif target_format == 'eps':
            command.extend(['--export-type=eps'])
        elif target_format == 'pdf':
            command.extend(['--export-type=pdf'])
        else:
            raise ValueError(f'Unsupported target format: {target_format}')

        # Add input file as the last argument
        command.append(input_path)

        logger.info(f"Running command: {' '.join(command)}")

        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True,
                timeout=30,
                shell=True  # Required on Windows for Inkscape
            )
            logger.info(f"Command output: {result.stdout}")
            if result.stderr:
                logger.warning(f"Command stderr: {result.stderr}")
        except subprocess.CalledProcessError as e:
            logger.error(f"Command failed with exit code {e.returncode}")
            logger.error(f"stdout: {e.stdout}")
            logger.error(f"stderr: {e.stderr}")
            raise Exception(f"Conversion failed: {e.stderr or 'Unknown error'}")
        except Exception as e:
            logger.error(f"Unexpected error during conversion: {str(e)}")
            raise Exception(f"Conversion failed: {str(e)}")
        finally:
            # Clean up input file
            try:
                if os.path.exists(input_path):
                    os.remove(input_path)
            except Exception as e:
                logger.warning(f"Could not remove input file {input_path}: {e}")

        if not os.path.exists(output_path):
            raise Exception(f"Output file was not created at {output_path}")

        output_size = os.path.getsize(output_path)
        logger.info(f"Output file created: {output_path} ({output_size} bytes)")

        if output_size == 0:
            raise Exception("Output file is empty")

        response = make_response(send_file(
            output_path,
            as_attachment=True,
            download_name=os.path.basename(output_path)
        ))
        response.call_on_close(lambda: os.remove(output_path) if os.path.exists(output_path) else None)
        return response

    except subprocess.CalledProcessError as e:
        logger.error(f"Conversion failed: {e.stderr}")
        return jsonify({
            'error': 'Conversion failed',
            'details': e.stderr,
            'command': ' '.join(command) if 'command' in locals() else 'Unknown'
        }), 500

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    logger.info("Starting Flask server...")
    logger.info(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    )