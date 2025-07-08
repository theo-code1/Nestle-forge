import React, { useState, useRef } from 'react'
import XDelete from './Icons/XDelete'
import Upload from './Icons/Upload'
import { removeBackground } from '../utils/api';
import ReFooter from './ReFooter'

const BgRemoverSection = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null) // File object
  const [processedImage, setProcessedImage] = useState(null) // URL for processed image
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const [animationBefore, setAnimationBefore] = useState(false)
  const [showErr, setShowErr] = useState('')

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file))
      setSelectedImage(file)
      setProcessedImage(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file))
      setSelectedImage(file)
      setProcessedImage(null)
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleRemoveBg = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const result = await removeBackground(selectedImage);
      setProcessedImage(result.url);
      setAnimationBefore(true)
    } catch (err) {
      setShowErr('Image resolution is not good')
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setSelectedImage(null);
    setProcessedImage(null);
  }

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'bg-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className='flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden min-h-screen'>
      <div className="headers flex flex-col gap-4">
        <h1 className='text-4xl text-black text-center font-medium'>Remove Background from you images</h1>
        <p className='text-[16px] text-center'>Instantly erase backgrounds to create clean, transparent images—perfect for design,<br />profiles, or web use.</p>
      </div>
      <div
        className={`drag-drop-container relative z-10 flex flex-col items-center justify-center gap-4 w-1/2 ${imagePreview ? 'border-2 border-transparent  border-solid' : 'border-2 pt-16 pb-12 px-16 hover:border-indigo-600  border-dashed'} mt-16 rounded-xl mx-auto cursor-pointer`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={!imagePreview ? handleClick : undefined}
      >
        <input
          type="file"
          id="file"
          className="hidden"
          accept="image/*"
          multiple={false}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {imagePreview ? (
          <div className="before-after relative flex flex-col items-center justify-center w-full h-full">
            <div className={`${animationBefore && processedImage ? 'img-layer overflow-hidden' : ''} relative w-full max-h-[50dvh] flex items-center justify-center`}
              // onAnimationEnd={() => setAnimationBefore(false)}
            >
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                className={`min-w-fit max-h-[50dvh] object-cover shadow select-none rounded-lg`}
                />
                </div>
                
              {processedImage && (
                <img
                src={processedImage}
                alt="Result Preview"
                className="absolute left-1/2 top-0 -translate-x-1/2 min-w-fit min-h-full object-cover shadow select-none rounded-lg"
                />
              )}
            <button
              className="absolute top-0 right-0 text-3xl bg-transparent text-red-500 cursor-pointer  hover:text-red-700 hover:bg-white/50 rounded-full transition-all duration-100"
              onClick={handleRemoveImage}
            >
              <XDelete />
            </button>
          </div>
        ) : (
          <>
            <div className="text-center flex flex-col items-center gap-4">
              <Upload />
              <h3 className="text-xl font-semibold text-gray-800 ">Drop your images here</h3>
              <p className="text-gray-600 text-sm -mb-2">or click to browse files</p>
              <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, ICO, AVIF</p>
            </div>
            <span className="bg-indigo-600 text-white px-4 py-2 mt-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </span>
          </>
        )}
      </div>

        {showErr !== "" && imagePreview && (
          <span className='text-red-500 text-sm mt-4'>{showErr}</span>
        )}

        {!processedImage && imagePreview && (
          <button
            type="button"
            className={` ${showErr !== '' ? 'mt-3' : 'mt-6'} px-6 py-3 text-lg bg-indigo-600 text-white rounded-lg disabled:bg-indigo-400 disabled:cursor-not-allowed`}
            onClick={handleRemoveBg}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Remove Background'}
          </button>
        )}
      {processedImage && (
        <button
          type="button"
          className="px-6 py-3 mt-4 text-lg bg-indigo-600 text-white rounded-lg"
          onClick={handleDownload}
        >
          Download
        </button>
      )}
    </section>
  )
}

export default BgRemoverSection