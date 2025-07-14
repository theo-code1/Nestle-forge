import React, { useState } from 'react'
import MdContentCopy from './Icons/CopyIcon'

// Utility function to convert RGB to Hex
function rgbToHex(rgb) {
  // Handle rgb(r, g, b) format
  if (rgb.startsWith('rgb')) {
    const match = rgb.match(/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    if (match) {
      const [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
  }
  // Handle hex format (already hex)
  if (rgb.startsWith('#')) {
    return rgb;
  }
  // Handle named colors by creating a temporary element
  const tempDiv = document.createElement('div');
  tempDiv.style.color = rgb;
  document.body.appendChild(tempDiv);
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);
  
  const match = computedColor.match(/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
  if (match) {
    const [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  return rgb;
}

export default function PalettesSelected ({ paletteColors }) {
  // Use default colors if paletteColors not provided
  const colors = paletteColors || ['red', 'blue', 'green', 'yellow'];
  return (
    <nav className="palettes-selected relative flex w-[25dvw] gap-1">
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
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const hexColor = rgbToHex(articleColor);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hexColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div className="flex flex-col items-center flex-1 ">
      <div
        className="h-16 w-full relative group cursor-pointer rounded-lg shadow-[0_2px_15px_0_#0000001a]"
        style={{ backgroundColor: articleColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCopy}
      >
        {/* Copy icon overlay */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center  transition-all duration-200">
              <MdContentCopy className="w-5 h-5 text-white mix-blend-difference" />
          </div>
        )}
        
        {/* Copied feedback */}
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-200">
            <div className="bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium">
              Copied!
            </div>
          </div>
        )}
      </div>
      
      {/* Hex value display */}
      <div className="text-xs text-gray-700 dark:text-white/80 mt-2 font-mono text-center min-w-[60px]">
        {hexColor}
      </div>
    </div>
  )
}