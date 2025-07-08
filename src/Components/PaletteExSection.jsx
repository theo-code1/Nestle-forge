// src/components/VibrantPalette.jsx
import React, { useState } from 'react';

const VibrantPalette = () => {
  const [imageURL, setImageURL] = useState(null);
  const [colors, setColors] = useState([]);

  const handleImageUpload = async () => {
  };
// etc.


  return (
    <section className='flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden max-h-screen'>
        <div className="headers flex flex-col gap-4">
            <h1 className='text-4xl text-center text-black font-medium prose'>Extract palettes from your images.</h1>
            <p className='text-center '>Turn your images into stunning color schemes. Perfect for design, branding,<br />and creative inspiration.</p>
        </div>
        

      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

      {imageURL && (
        <img src={imageURL} alt="Preview" className="w-64 h-auto rounded shadow mb-4" />
      )}

      {colors.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded shadow"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
  </section>
  );
};

export default VibrantPalette;
