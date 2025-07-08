import React, { useRef, useState } from 'react'
import Upload from './Icons/Upload'
import XDelete from './Icons/XDelete'
import PalettesSelected from './PalettesSelected'
// import SelectPoint from './Icons/SelectPoint' // Removed marker import

// --- Palette conversion utilities ---
function rgbStringToArray(rgb) {
  // Expects 'rgb(r, g, b)'
  const match = rgb.match(/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
  if (!match) return [0, 0, 0];
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
function rgbToRgba([r, g, b], a = 1) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function rgbToCssVar([r, g, b], i) {
  return `--palette-color-${i + 1}: rgb(${r}, ${g}, ${b});`;
}

const PaletteExSection = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const [palette, setPalette] = useState([])
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const [showExport, setShowExport] = useState(false)
  const [copied, setCopied] = useState('')

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
    setPalette((prev) => prev.length < 10 ? [...prev, color] : prev);
  };

  // --- Export Modal Content ---
  const getExportFormats = () => {
    const arrs = palette.map(rgbStringToArray);
    return {
      css: arrs.map(rgbToCssVar).join('\n'),
      hex: arrs.map(rgbToHex).join(', '),
      hsl: arrs.map(rgbToHsl).join(', '),
      rgba: arrs.map(rgb => rgbToRgba(rgb, 1)).join(', '),
      json: JSON.stringify(arrs.map(rgb => ({ r: rgb[0], g: rgb[1], b: rgb[2] })), null, 2)
    };
  };
  const exportFormats = getExportFormats();

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1200);
  };

  return (
    <section className='flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden h-screen'>
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
                onLoad={handleImageLoad}
                onClick={handleImageClick}
                style={{ cursor: 'crosshair' }}
              />
              {/* Hidden canvas for color picking */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
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
      {imagePreview &&(
        <div className="picked-colors flex items-center gap-16 mt-12">
          <PalettesSelected paletteColors={palette} />
          <button
            type="button"
            className={`text-lg px-8 py-3 rounded-lg bg-indigo-600 text-white hover:brightness-95 transition-all duration-100 cursor-pointer${palette.length < 1 ? ' opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => palette.length > 0 && setShowExport(true)}
            disabled={palette.length < 1}
          >
            Export
          </button>
        </div>
      )}
      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-xl relative">
            <button className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-red-500" onClick={() => setShowExport(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">Export Palette</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">CSS Variables</span>
                  <button className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => handleCopy(exportFormats.css, 'css')}>{copied === 'css' ? 'Copied!' : 'Copy'}</button>
                </div>
                <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{exportFormats.css}</pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">HEX</span>
                  <button className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => handleCopy(exportFormats.hex, 'hex')}>{copied === 'hex' ? 'Copied!' : 'Copy'}</button>
                </div>
                <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{exportFormats.hex}</pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">HSL</span>
                  <button className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => handleCopy(exportFormats.hsl, 'hsl')}>{copied === 'hsl' ? 'Copied!' : 'Copy'}</button>
                </div>
                <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{exportFormats.hsl}</pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">RGBA</span>
                  <button className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => handleCopy(exportFormats.rgba, 'rgba')}>{copied === 'rgba' ? 'Copied!' : 'Copy'}</button>
                </div>
                <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{exportFormats.rgba}</pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">JSON</span>
                  <button className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => handleCopy(exportFormats.json, 'json')}>{copied === 'json' ? 'Copied!' : 'Copy'}</button>
                </div>
                <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto overflow-y-auto max-h-40">{exportFormats.json}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default PaletteExSection