import React from 'react'

const SideBar = () => {
    // const [activeSection, setActiveSection] = React.useState("Image UpscalerSection")

    const sideItems = [
        {name: "Image Upscaler", href: "#"},
        {name: "Image Converter", href: "#"},
        {name: "Image Compressor", href: "#"},
        {name: "Background Remover", href: "#"},
        {name: "Image Resizer&Cropper", href: "#"},
        {name: "Color Palette Extractor", href: "#"},
    ]

    const itemSection = `${sideItems[0].name.slice(sideItems[0].name.indexOf(" ") + 1, sideItems[0].name.length)}Section`
    console.log(itemSection)
  return (
    <main className='side-bar float-left w-1/7 h-screen border-r border-r-black/20 text-left py-8 px-4 flex flex-col gap-16 font-'>
        <h1 className='text-2xl font-bold text-center   '>Logo</h1>
        <ul className='text-[16px] flex flex-col gap-2 font-medium'>
            {sideItems.map((item, index) => (
                <li 
                key={index}
                className='hover:bg-gray-100 p-2 cursor-pointer rounded-lg' 
                > <a 
                href={sideItems[index].name.slice(sideItems[index].name.indexOf(" ") + 1, sideItems[index].name.length)+'Section'}
                >{item.name}</a></li>
            ))}
            
        </ul>
    </main>
  )
}

export default SideBar