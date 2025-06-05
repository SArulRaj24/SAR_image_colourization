from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image, ImageFilter
import os

# Create Flask app
app = Flask(__name__)  # Fixed typo
CORS(app)  # Allow cross-origin requests

# Set up directories
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# ls=[]

im="file"
@app.route('/upload', methods=['POST'])
def upload_image():
    # i=0
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    # Save the uploaded image
    # a=im+str(i)+".png"
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    # i+=1
    file.save(filepath)

    # Process the image (e.g., apply a blur filter)
    try:
        with Image.open(filepath) as img:
            processed_image = img.filter(ImageFilter.BLUR)
            processed_path = os.path.join(PROCESSED_FOLDER, file.filename)
            processed_image.save(processed_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Return the file path to the processed image
    return jsonify({'filePath': f'/processed/{file.filename}'})

@app.route('/processed/<filename>')
def serve_image(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
