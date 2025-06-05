

const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('imageUpload');
const imageContainer = document.querySelector('.image-container');
const displayImage = document.getElementById('displayImage');
const processedImageContainer = document.getElementById('processedImageContainer');
const processedImage = document.getElementById('processedImage');

// Function to display the uploaded image
function showImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        displayImage.src = e.target.result;
        imageContainer.style.display = 'block'; // Ensure the image container is visible
        displayImage.style.display = 'block';  // Ensure the image is visible
    };
    reader.readAsDataURL(file);
}

// Handle drag-and-drop
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = '#f0f0f0';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = '#ffffff';
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = '#ffffff';
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        showImage(file);
        handleImageUpload(file); // Optional: upload the image to the backend
    } else {
        alert('Please drop a valid image file.');
    }
});

// Handle file input click (opens file dialog)
dropArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        showImage(file);
        handleImageUpload(file); // Optional: upload the image to the backend
    }
});

// Function to handle image upload and fetch processed image
async function handleImageUpload(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        const data = await response.json();

        // The server is expected to return the processed image file path in the response
        const processedImageUrl = `http://localhost:5000/${data.filePath}`;

        // Display the processed image
        processedImage.src = processedImageUrl;
        processedImage.style.display = 'block';
        processedImageContainer.style.display = 'block';  // Show the processed image container

    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload and process the image.');
        // Ensure the image remains visible after the error alert
        displayImage.style.display = 'block'; // Make sure the uploaded image stays visible
        imageContainer.style.display = 'block'; // Ensure the image container stays visible
    }
}

