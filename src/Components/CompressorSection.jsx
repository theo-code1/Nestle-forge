import React, { useState } from 'react'
import Upload from './Icons/Upload'
import CompressFile from './CompressFile'
import { compressImage } from '../utils/api'

const CompressorSection = () => {
  const [allUploadedImages, setAllUploadedImages] = useState([])
  const [loadingImages, setLoadingImages] = useState({})
  const [compressedImages, setCompressedImages] = useState({})

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith("image/"))
    
    if (imageFiles.length === 0) {
      return
    }
    
    imageFiles.forEach(file => {
      const fileFormat = file.type.split("/")[1].toUpperCase()
      const imageUrl = URL.createObjectURL(file)
      const imageDetails = {
        name: file.name,
        format: fileFormat,
        size: (file.size / 1024).toFixed(2) + " KB",
      }
      setAllUploadedImages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        details: imageDetails,
        file: file,
        convertToFormat: ""
      }])
    })
  }

  const handleFileUpload = (e) => {
    console.log('File upload triggered')
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    console.log('Image files:', imageFiles.length)
    if (imageFiles.length === 0) {
      return;
    }
    imageFiles.forEach(file => {
      const fileFormat = file.type.split("/")[1].toUpperCase();
      const imageUrl = URL.createObjectURL(file);
      const imageDetails = {
        name: file.name,
        format: fileFormat,
        size: (file.size / 1024).toFixed(2) + " KB",
      };
      console.log('Adding image:', imageDetails)
      setAllUploadedImages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        details: imageDetails,
        file: file,
        convertToFormat: ""
      }]);
    });
  }

  const handleCompressing = async (imageId) => {
    const image = allUploadedImages.find(img => img.id === imageId);
    if (!image) return;

    try {
      // Set loading state
      setLoadingImages(prev => ({ ...prev, [imageId]: true }));

      console.log('Starting compression for image:', imageId);
      
      // Call the compression API
      const result = await compressImage(image.file);
      
      console.log('Compression result:', result);
      
      // Store the compressed image with the URL from the response
      setCompressedImages(prev => ({
        ...prev,
        [imageId]: {
          url: result.url,
          blob: result.blob,
          filename: result.filename,
          size: result.compressed_size_kb * 1024, // Convert KB to bytes
          originalSize: result.original_size_kb * 1024, // Convert KB to bytes
          compressionRatio: result.compression_ratio_percent
        }
      }));

      // Update the image details with compression information
      setAllUploadedImages(prev => prev.map(img => 
        img.id === imageId 
          ? {
              ...img,
              details: {
                ...img.details,
                originalSize: result.originalSize,
                compressedSize: result.compressedSize,
                compressionRatio: result.compressionRatio
              }
            }
          : img
      ));

    } catch (error) {
      console.error('Compression failed:', error);
      alert('Compression failed: ' + error.message);
    } finally {
      // Clear loading state
      setLoadingImages(prev => ({ ...prev, [imageId]: false }));
    }
  }


  return (
   <section className='flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden max-h-[90dvh]'>
    <div className="headers flex flex-col gap-4">
        <h1 className='text-4xl font-medium text-center'>   compress your images for Free</h1>
        <h3 className='text-[16px] text-center '>Reduce file size while maintaining quality, Optimize your images for faster loading and<br/>better performance.</h3>
    </div>
    
    <div 
      className={`drag-drop-container z-10 flex flex-col items-center justify-center gap-4 w-1/2 pt-16 pb-12 px-16 mt-12 rounded-xl border-2 border-dashed mx-auto ${
        Object.values(loadingImages).some(loading => loading)
          ? "cursor-not-allowed opacity-70"
          : "cursor-pointer opacity-100"
      }
      ${Object.values(loadingImages).some(loading => loading) ? 'hover:border-black' : 'hover:border-indigo-600'}`}
      onClick={
        !Object.values(loadingImages).some(loading => loading) ? () => document.getElementById("file").click() : null
      }
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload />

      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop your images here</h3>
        <p className="text-gray-600 text-sm mb-4">or click to browse files</p>
        <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, ICO, AVIF</p>
      </div>

      <div className={`select-file flex gap-4 items-center mt-4 `}>
        <input
          type="file"
          id="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
        />
        <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
          Upload Image
        </span>
      </div>
    </div>

    {/* Display uploaded images */}
    <div className="uploaded-images flex flex-col gap-4 w-full max-w-4xl">
      {allUploadedImages.map((image) => {
        const compressedImage = compressedImages[image.id];
        const isCompressed = !!compressedImage;
        
        return (
          <CompressFile 
            key={image.id}
            ImageName={image.details.name}
            ImageSize={image.details.size}
            selectedImgDetails={image.details}
            isLoading={loadingImages[image.id] || false}
            isCompressed={isCompressed}
            originalImg={image.url}
            compressedImg={compressedImage?.url || null}
            handleDelete={() => {
              setAllUploadedImages(prev => prev.filter(img => img.id !== image.id))
              setCompressedImages(prev => {
                const newState = { ...prev }
                delete newState[image.id]
                return newState
              })
            }}
            handleCompressing={() => handleCompressing(image.id)}
          />
        )
      })}
    </div>
   </section>
  )
}

export default CompressorSection