import React, { useRef, useState } from 'react'
import Upload from './Icons/Upload'
import XDelete from './Icons/XDelete'
import PalettesSelected from './PalettesSelected'
// import SelectPoint from './Icons/SelectPoint' // Removed marker import



const PaletteExSection = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const [palette, setPalette] = useState([])
  const imageRef = useRef(null)
  const canvasRef = useRef(null)

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
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setPalette([]);
  }
  const handleClick = () => {
    fileInputRef.current.click()
  }

  // Draw image to canvas when loaded
  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  // Handle click on image to pick color
  const handleImageClick = (e) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const rect = img.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    console.log('Picked color:', color);
    setPalette((prev) => {
      const newPalette = prev.length < 6? [...prev, color] : prev;
      console.log('Updated palette:', newPalette);
      return newPalette;
    });
  };

  



  return (
    <section className='bg-white dark:bg-black/90 flex flex-col items-center gap-2 py-24 px-2 md:py-14 overflow-y-auto overflow-x-hidden h-screen'>
        <div className="headers flex flex-col gap-4">
            <h1 className='text-3xl md:text-4xl text-center text-black dark:text-white/90 font-medium'>Image to Palette</h1>
            <p className='text-sm md:text-[16px] text-black dark:text-white/90 text-center px-2'>Extract beautiful color schemes in seconds. Just upload an image and <br className='hidden md:flex'/>get inspired.</p>
        </div>
        <div
        className={`drag-drop-container relative z-10 flex flex-col items-center justify-center gap-4 w-9/10 md:w-3/4 lg:w-1/2 ${imagePreview ? 'border-2 border-transparent  border-solid' : 'border-2 py-10 md:py-10 px-4 md:px-16 hover:border-[#3582FD]  border-dashed'} mt-16 rounded-xl mx-auto cursor-pointer`}
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
                className={`w-[90dvw] lg:min-w-fit max-h-[45dvh] object-contain shadow select-none rounded-lg `}
                onLoad={handleImageLoad}
                onClick={handleImageClick}
                style={{ cursor: 'crosshair' }}
              />
              {/* Hidden canvas for color picking */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            
          </div>
        ) : (
          <>
            <div className="text-center flex flex-col items-center gap-4 mb-2">
              <Upload size={`6rem`} className="p-4 bg-[#67A1FE]/60 rounded-full"/>
              <div className="drag-info">
                <h3 className="text-xl font-medium text-gray-800 text-center">Drop your images here</h3>
                <p className="text-gray-600 text-sm text-center">or click to browse files</p>
              </div>
              <p className="text-xs text-gray-500 text-center">Supports: PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, ICO, AVIF</p>
            </div>
            <span className="bg-[#3582FD] text-white px-4 py-2 mt-2 rounded-xl hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </span>
          </>
        )}
      </div>
      {imagePreview &&(
        <div className="picked-colors w-screen md:w-fit flex flex-col px-2 gap-8 mt-12 ">
          <div className="flex items-start flex-nowrap max-w-screen md:w-full overflow-y-hidden overflow-x-auto">
            <PalettesSelected paletteColors={palette} />
          </div>
            <button
              className="text-lg bg-white hover:bg-gray-50 text-red-500 border border-red-500 px-6 py-3 mt-1 cursor-pointer rounded-lg transition-all duration-100"
              onClick={handleRemoveImage}
            > Remove
            </button>
          {palette.length > 0 && (
            <p className="text-sm text-gray-600 px-2 mt-4">
              Click on the image to pick colors. Click on any color to copy its hex value.
            </p>
          )}
        </div>
      )}
      
    </section>
  )
}

export default PaletteExSection