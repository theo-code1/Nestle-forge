/**
 * Handles API calls to the backend server
 */

const API_BASE_URL = 'http://localhost:5000';

/**
 * Convert an image to a different format
 * @param {File} file - The image file to convert
 * @param {string} targetFormat - The target format (e.g., 'png', 'jpg', 'pdf')
 * @returns {Promise<Blob>} - The converted file as a Blob
 */
export const convertImage = async (file, targetFormat) => {
  console.log('Starting conversion:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    targetFormat
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', targetFormat);

  try {
    console.log('Sending request to backend...');
    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let the browser set it with the correct boundary
    });

    console.log('Response status:', response.status, response.statusText);
    
    // Log response headers for debugging
    console.log('Response headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    // Check for error responses
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('Error response JSON:', errorData);
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch {
        // If we can't parse as JSON, try to get the raw text
        const text = await response.text().catch(() => 'No error details available');
        console.error('Error response text:', text);
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    console.log('Conversion successful, getting blob...');
    // Return the file as a Blob
    return await response.blob();
  } catch (error) {
    console.error('Error converting image:', error);
    throw error;
  }
};

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The desired filename
 */
export const downloadBlob = (blob, filename) => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // Trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};
