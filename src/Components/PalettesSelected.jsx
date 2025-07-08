import React from 'react'
export default function PalettesSelected () {
  return (
    <nav className="palettes-selected relative flex bg-black/30 w-[25dvw] py-2 px-4 rounded-[16px]">
        <PaletteArticle />
         <PaletteArticle /> {/*colorArticle={"green"} */}
        <button className="add-palette text-black bg-white/80 hover:brightness-95 transition-all duration-100 cursor-pointer rounded-tr-[12px] rounded-br-[12px] text-3xl text-center px-4 py-[14px] absolute right-2">+</button>
    </nav>
  )
}

export function PaletteArticle() {

    return(
        <div className={`h-16 max-w-24 rounded-[12px] `}
             style={{backgroundColor: 'blue'}}></div>
    )
}