import React, { useState, useRef } from 'react'
import XDelete from './Icons/XDelete'

const BgRemoverSection = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file))
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
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <section className='flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden max-h-[90dvh]'>
      <div className="headers flex flex-col gap-4">
        <h1 className='text-4xl text-black text-center font-medium'>Remove Background from you images</h1>
        <h3 className='text-[16px] text-center'>Instantly erase backgrounds to create clean, transparent images—perfect for design,<br />profiles, or web use.</h3>
      </div>
      <div
        className={`drag-drop-container relative z-10 flex flex-col items-center justify-center gap-4 w-1/2 pt-16 pb-12 px-16 mt-12 rounded-xl border-2 border-dashed mx-auto hover:border-indigo-600 cursor-pointer`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
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
          <div className="flex flex-col items-center justify-center w-full h-full">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="max-w-xs max-h-64 object-contain rounded shadow"
            />
            <button
              className="absolute top-2 right-4 text-3xl bg-transparent text-red-500 cursor-pointer hover:bg-red-500 hover:text-white rounded-full"
              onClick={e => { e.stopPropagation(); setImagePreview(null) }}
            >
              <XDelete />
            </button>
          </div>
        ) : (
          <>
            {/* You can add your <Upload /> icon here if you have it */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop your images here</h3>
              <p className="text-gray-600 text-sm mb-4">or click to browse files</p>
              <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, ICO, AVIF</p>
            </div>
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </span>
          </>
        )}
      </div>
    </section>
  )
}

export default BgRemoverSection