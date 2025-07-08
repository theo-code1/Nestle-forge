import React, { useRef, useState } from 'react'
import Upload from './Icons/Upload'
import XDelete from './Icons/XDelete'
import ColorThief from 'color-thief-browser'
import PalettesSelected from './PalettesSelected'

const PaletteExSection = () => {

  const [imagePreview, setImagePreview] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)
  const [palette, setPalette] = useState([])
  const imageRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file))
      setSelectedImage(file)
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
    }
  }
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setSelectedImage(null);
  }
  const handleClick = () => {
    fileInputRef.current.click()
  }

  const extractColors = async () => {
    if (imageRef.current && imageRef.current.complete) {
      try {
        const colors = await ColorThief.getPalette(imageRef.current, 6)
        setPalette(colors)
      } catch (error) {
        console.error('Color extraction failed:', error)
      }
    }
  }

  return (
    <section className='flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden min-h-screen'>
        <div className="headers flex flex-col gap-4">
            <h1 className='text-4xl text-center text-black font-medium prose'>Extract palettes from your images.</h1>
            <p className='text-center '>Turn your images into stunning color schemes. Perfect for design, branding,<br />and creative inspiration.</p>
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

              <img
                ref={imageRef}
                src={imagePreview}
                alt="Uploaded Preview"
                className={`min-w-fit max-h-[45dvh] object-contain shadow select-none rounded-lg `}
                onLoad={extractColors}
              />


            <button
              className="absolute top-0 right-4 text-3xl bg-transparent text-red-500 cursor-pointer  hover:text-red-700 hover:bg-white/50 rounded-full transition-all duration-100"
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
        
      {/* {palette.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {palette.map((color, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded shadow"
              style={{ backgroundColor: `rgb(${color.join(',')})` }}
              title={`rgb(${color.join(',')})`}
            />
          ))}
        </div>
      )} */}

      {/* {imagePreview &&( */}
        <div className="picked-colors flex items-center gap-16 mt-12">
          <PalettesSelected />
          <button type="button" className='text-lg px-8 py-3 rounded-lg bg-indigo-600 text-white'>Export</button>
        </div>
      {/*  )} */}
    </section>
  )
}

export default PaletteExSection