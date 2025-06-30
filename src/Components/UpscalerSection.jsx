import React, { useState, useRef } from 'react';

const UpscalerSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

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
    if (!selectedImage) return;

    // Here you would typically send the image to your backend
    // For now, we'll just log it
    console.log('Upscaling image:', selectedImage.name);
    
    // Example of how you might send it to your FastAPI backend:
    /*
    const formData = new FormData();
    formData.append('image', selectedImage);
    
    try {
      const response = await fetch('http://localhost:8000/upscale', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Upscale result:', result);
      // Handle the upscaled image
    } catch (error) {
      console.error('Error upscaling image:', error);
    }
    */
  };

  return (
    <section className='pt-16 px-4 max-w-4xl mx-auto '>
      <h1 className='text-4xl font-bold text-center'>Start Upscaling your images</h1>
      <p className='text-lg text-center mt-4 text-gray-600'>
        Upload your image and let our AI-powered upscaler enhance it to stunning quality.<br />Get stunning, high-resolution results in seconds.
      </p>
      
      <div 
        className="mt-16 border-2 border-dashed border-gray-300 rounded-2xl p-24 text-center cursor-pointer hover:border-indigo-400 transition-colors"
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

      {selectedImage && (
        <div className="mt-8 text-center">
          <button
            onClick={handleUpscale}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upscale Image
          </button>
          <p className="text-sm text-gray-500 mt-2">Click to enhance your image quality</p>
        </div>
      )}
    </section>
  );
};

export default UpscalerSection;