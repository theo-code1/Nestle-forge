import React, { useState } from 'react'
export default function PalettesSelected () {
  // State for palette colors
  const [paletteColors, setPaletteColors] = useState([
    'red', 'blue', 'green', 'yellow'
  ]);

  // Add a new color (default: gray, or randomize if you want)
  const addPalette = () => {
    paletteColors.length <= 9 ? setPaletteColors([...paletteColors, 'gray']) : ''
  };

  return (
    <nav className="palettes-selected relative flex w-[25dvw] pr-12 rounded-[12px] overflow-hidden">
      {paletteColors.map((color, idx) => (
        <PaletteArticle key={idx} articleColor={color} />
      ))}
      <button
        className="add-palette text-black bg-white/80 brightness-90 hover:brightness-95 transition-all duration-100 cursor-pointer rounded-tr-[12px] rounded-br-[12px] text-3xl text-center px-4 py-[14px] absolute right-0 top-0 select-none"
        onClick={addPalette}
      >
        +
      </button>
    </nav>
  )
}

export function PaletteArticle({ articleColor }) {
  return (
    <div
      className="h-16 flex-1" // flex-1 makes it expand equally
      style={{ backgroundColor: articleColor }}
    ></div>
  )
}