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
    
    # Check if the post request has the file part
    if 'file' not in request.files:
        logger.error("No file part in the request")
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    # If user does not select file
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400
        
    if not file or not allowed_file(file.filename):
        logger.error(f"File type not allowed: {file.filename}")
        return jsonify({'error': 'File type not allowed'}), 400

    # Get requested output format
    target_format = request.form.get('format', '').lower()
    if not target_format:
        logger.error("No target format specified")
        return jsonify({'error': 'Target format is required'}), 400

    try:
        logger.info(f"Converting to format: {target_format}")
        
        # Generate unique filenames to prevent conflicts
        timestamp = int(datetime.now().timestamp())
        input_filename = f"{timestamp}_{secure_filename(file.filename)}"
        input_path = os.path.join(UPLOAD_FOLDER, input_filename)
        
        # Save the uploaded file
        file.save(input_path)
        logger.info(f"File saved to: {input_path}")
        
        # Verify file was saved
        if not os.path.exists(input_path):
            raise Exception(f"Failed to save file to {input_path}")
            
        logger.info(f"File size: {os.path.getsize(input_path)} bytes")
        
        # Set output file name and path
        name, _ = os.path.splitext(input_filename)
        output_filename = f"{name}_converted.{target_format}"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)
        
        # Build Inkscape command based on the format
        command = ['inkscape', '--version']
        logger.info(f"Checking Inkscape version: {' '.join(command)}")
        
        # Check if Inkscape is available
        try:
            version_result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                shell=True
            )
            logger.info(f"Inkscape version check: {version_result.stdout or version_result.stderr}")
        except Exception as e:
            logger.error(f"Inkscape check failed: {str(e)}")
            raise Exception("Inkscape is not installed or not in PATH")
        
        # Build the actual conversion command
        if target_format in ['svg', 'pdf', 'eps', 'ps']:
            command = [
                'inkscape',
                input_path,
                f'--export-filename={output_path}',
                '--export-plain-svg' if target_format == 'svg' else ''
            ]
        else:  # Raster formats
            command = [
                'inkscape',
                input_path,
                f'--export-filename={output_path}',
                f'--export-type={target_format}'
            ]
            
            # Add DPI for better quality in raster formats
            if target_format in ['png', 'jpg', 'jpeg', 'bmp', 'gif']:
                command.extend(['--export-dpi=300'])
        
        logger.info(f"Executing command: {' '.join(command)}")
        
        # Clean up the command by removing empty strings
        command = [str(c) for c in command if c]
        logger.info(f"Running command: {' '.join(command)}")
        
        # Run the conversion
        try:
            result = subprocess.run(
                command, 
                capture_output=True, 
                text=True, 
                check=True,
                shell=True,
                timeout=30  # 30 seconds timeout
            )
            logger.info(f"Command output: {result.stdout}")
            if result.stderr:
                logger.warning(f"Command stderr: {result.stderr}")
        except subprocess.TimeoutExpired:
            logger.error("Command timed out")
            raise Exception("Conversion timed out")
        except subprocess.CalledProcessError as e:
            logger.error(f"Command failed with code {e.returncode}")
            logger.error(f"stdout: {e.stdout}")
            logger.error(f"stderr: {e.stderr}")
            raise
        
        logger.info(f"Conversion successful. Output: {result.stdout}")
        
        # Clean up the input file after successful conversion
        try:
            os.remove(input_path)
        except Exception as e:
            logger.warning(f"Could not remove input file: {e}")
        
        # Verify the output file was created
        if not os.path.exists(output_path):
            raise Exception(f"Output file was not created at {output_path}")
            
        output_size = os.path.getsize(output_path)
        logger.info(f"Output file created: {output_path} ({output_size} bytes)")
        
        if output_size == 0:
            raise Exception("Output file is empty")
            
        try:
            # Return the converted file
            response = make_response(send_file(
                output_path,
                as_attachment=True,
                download_name=os.path.basename(output_path)
            ))
            
            # Clean up the output file after sending
            response.call_on_close(lambda: os.remove(output_path) if os.path.exists(output_path) else None)
            
            return response
            
        except Exception as e:
            logger.error(f"Error sending file: {str(e)}")
            if os.path.exists(output_path):
                os.remove(output_path)
            raise
        
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
    # Ensure the upload directory exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    # Log server start
    logger.info("Starting Flask server...")
    logger.info(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    
    # Run the app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    )
