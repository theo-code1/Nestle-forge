import React, { useState, useRef } from 'react';

const UpscalerSection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [showComparison, setShowComparison] = useState(false);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle the upscale button click
  const handleUpscale = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    const formData = new FormData();
    // Make sure to use the file object directly, not the preview URL
    formData.append('image', selectedImage);
    
    try {
      setIsLoading(true);
      console.log('Sending image for upscaling...', selectedImage);
      
      // Log the FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch('http://localhost:8000/upscale', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the boundary
      });

      // First check if the response is OK
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (error) {
          console.error('Error parsing error response:', error);
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different error cases
      if (data.error) {
        console.error('Error from server:', data.error, data.details || '');
        throw new Error(data.error);
      }
      
      if (!data || !data.upscaled) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response from the server. Please try again.');
      }

      // If we get here, we have a valid response with an upscaled image
      setUpscaledImage(`data:image/png;base64,${data.upscaled}`);
      setShowComparison(true);
      console.log('Image upscaled and displayed successfully');
    } catch (error) {
      console.error('Error upscaling image:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Failed to upscale image';
      alert(`Error: ${errorMessage}. Please try again with a different image.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='pt-16 px-4 max-w-4xl mx-auto '>
      <h1 className='text-4xl font-bold text-center'>Start Upscaling your images</h1>
      <p className='text-lg text-center mt-4 text-gray-600'>
        Upload your image and let our AI-powered upscaler enhance it to stunning quality.<br />Get stunning, high-resolution results in seconds.
      </p>
      
      <div 
        className="mt-16 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 transition-colors"
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="space-y-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-lg shadow-md" 
            />
            <p className="text-gray-600 mt-4">{selectedImage.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
                setPreview(null);
              }}
              className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div>
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-600">
              <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 10MB</p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {selectedImage && !showComparison && (
        <div className="mt-4 text-center">
          <button
            onClick={handleUpscale}
            disabled={isLoading}
            className={`px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Upscaling...' : 'Upscale Image'}
          </button>
          <p className="text-sm text-gray-500 mt-2">Click to enhance your image quality</p>
        </div>
      )}

      {showComparison && upscaledImage && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-center mb-4">Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Original</p>
              <img 
                src={preview} 
                alt="Original" 
                className="max-w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Upscaled</p>
              <img 
                src={upscaledImage} 
                alt="Upscaled" 
                className="max-w-full h-auto rounded-lg border border-gray-200"
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = upscaledImage;
                  link.download = `upscaled_${selectedImage.name}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Upscaled Image
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setShowComparison(false);
                setUpscaledImage(null);
              }}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to upload
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpscalerSection;