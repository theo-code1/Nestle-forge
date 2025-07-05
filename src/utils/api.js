/**
 * Handles API calls to the backend server
 */

const API_URL = 'http://localhost:5001';

const getApiUrl = () => {
  return API_URL;
};

/**
 * Convert an image to a different format
 * @param {File} file - The image file to convert
 * @param {string} targetFormat - The target format (e.g., 'png', 'jpg', 'webp')
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
  formData.append('format', targetFormat.toLowerCase()); // Ensure format is lowercase

  try {
    console.log('Sending request to backend...');
    
    // Log FormData contents (for debugging)
    for (let pair of formData.entries()) {
      console.log('FormData:', pair[0], pair[1]);
    }
    
    const apiUrl = getApiUrl();
    console.log('Request details:', {
      url: `${apiUrl}/convert`,
      method: 'POST',
      file: {
        name: file.name,
        type: file.type,
        size: file.size
      },
      targetFormat: targetFormat.toLowerCase(),
      headers: {
        'Accept': 'application/octet-stream',
      }
    });
    
    const response = await fetch(`${apiUrl}/convert`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let the browser set it with the correct boundary
    });
    
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()])
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
        // Try to get error details from response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error response JSON:', errorData);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } else {
          const text = await response.text();
          console.error('Error response text:', text);
          errorMessage = text || errorMessage;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
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
