/**
 * Handles API calls to the backend server
 */

const API_URL = import.meta.env.VITE_API_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const getApiUrl = () => API_URL;
const getFrontendUrl = () => FRONTEND_URL;

export { getFrontendUrl };

/**
 * Convert an image to a different format
 * @param {File} file - The image file to convert
 * @param {string} targetFormat - The target format (e.g., 'png', 'jpg', 'webp')
 * @returns {Promise<Object>} - The converted file info with URL and metadata
 */
export const convertImage = async (file, targetFormat) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', targetFormat.toLowerCase());

  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/convert`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Server error: ${response.status} ${response.statusText}`;
    const text = await response.text();
    errorMessage = text || errorMessage;
    throw new Error(errorMessage);
  }

  // Always treat as blob (file download)
  const blob = await response.blob();
  return {
    success: true,
    url: URL.createObjectURL(blob),
    filename: `${file.name.split('.')[0]}_converted.${targetFormat.toLowerCase()}`,
    size: blob.size,
    blob,
  };
};

/**
 * Compress an image to reduce file size
 * @param {File} file - The image file to compress
 * @returns {Promise<Object>} - The compressed file info with URL and metadata
 */
export const compressImage = async (file, quality = 60) => {
  console.log('Starting compression:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    quality
  });

  const formData = new FormData();
  formData.append('file', file); // Changed from 'image' to 'file' to match backend

  try {
    console.log('Sending compression request to backend...');
    
    const apiUrl = getApiUrl();
    console.log('Request details:', {
      url: `${apiUrl}/compress`,
      method: 'POST',
      file: {
        name: file.name,
        type: file.type,
        size: file.size
      },
      quality
    });
    
    const response = await fetch(`${apiUrl}/compress`, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()])
    });

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
          const text = await response.text();
          console.error('Error response text:', text);
          errorMessage = text || errorMessage;

      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    console.log('Compression successful, parsing response...');
    
    // Parse the JSON response
    const result = await response.json();
    console.log('Compression response:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Compression failed');
    }
    
    // Convert hex string back to bytes
    const byteCharacters = result.image_data.match(/[\da-f]{2}/g).map(h => parseInt(h, 16));
    const byteArray = new Uint8Array(byteCharacters);
    const blob = new Blob([byteArray], { type: `image/${result.format}` });
    const url = URL.createObjectURL(blob);
    
    // Return the response data with the compressed image URL
    return {
      ...result,
      file: file,
      url: url,
      blob: blob,
      filename: `compressed_${file.name.replace(/\.[^/.]+$/, '')}.${result.format}`
    };
  } catch (error) {
    console.error('Error compressing image:', error);
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


/**
 * Remove background from an image
 * @param {File} file - The image file to process
 * @returns {Promise<Object>} - The processed file info with URL and metadata
 */
export const removeBackground = async (file) => {
  const formData = new FormData();
  formData.append('image_file', file); // <-- Correct field name

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'KjL9s7sR3xmU21NMfSbC5QcB'
        // Do NOT set Content-Type, let the browser set it for FormData!
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.errors?.[0]?.title || errorData.error || errorData.details || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
      } catch (e) {
        console.error(e)
        // ignore
      }
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return {
      success: true,
      url,
      filename: `${file.name.split('.')[0]}_bgremoved.png`,
      size: blob.size,
      blob,
    };
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};