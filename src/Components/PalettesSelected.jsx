import React from 'react'
export default function PalettesSelected ({ paletteColors }) {
  // Use default colors if paletteColors not provided
  const colors = paletteColors || ['red', 'blue', 'green', 'yellow'];
  return (
    <nav className="palettes-selected relative flex w-[25dvw] rounded-[16px] overflow-hidden">
      {colors.map((color, idx) => (
        <PaletteArticle key={idx} articleColor={color} />
      ))}
      {!paletteColors && (
        <button
          className="add-palette text-black bg-white/80 brightness-90 hover:brightness-95 transition-all duration-100 cursor-pointer rounded-tr-[12px] rounded-br-[12px] text-3xl text-center px-4 py-[14px] absolute right-0 top-0 select-none"
        >
          +
        </button>
      )}
    </nav>
  )
}

export function PaletteArticle({ articleColor }) {
  return (
    <div
      className="h-16 flex-1"
      style={{ backgroundColor: articleColor }}
    ></div>
  )
}