import React, { useRef, useState } from 'react';
import { PaletteArticle } from './PalettesSelected';

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState(null);
  const [paletteColors, setPaletteColors] = useState([]);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImageSrc(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Draw image to canvas when loaded
  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  // Handle click on canvas to pick color
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    setPaletteColors((prev) => prev.length < 10 ? [...prev, color] : prev);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageSrc && (
        <div className="relative">
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Uploaded"
            style={{ display: 'none' }}
            onLoad={handleImageLoad}
          />
          <canvas
            ref={canvasRef}
            style={{ maxWidth: 400, maxHeight: 400, cursor: 'crosshair', borderRadius: 8 }}
            onClick={handleCanvasClick}
          />
        </div>
      )}
      {paletteColors.length > 0 && (
        <nav className="palettes-selected flex w-[25dvw] rounded-[16px] overflow-hidden mt-4">
          {paletteColors.map((color, idx) => (
            <PaletteArticle key={idx} articleColor={color} />
          ))}
        </nav>
      )}
    </div>
  );
} 