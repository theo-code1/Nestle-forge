import React from 'react'

const SideBar = ({ activeSection, setActiveSection }) => {

    const sideItems = [ "Image Upscaler",
                        "Image Converter",
                        "Image Compressor",
                        "Background Remover",
                        "Image Resizer&Cropper",
                        "Color Palette Extractor",
    ]

    console.log(activeSection)

    // const itemSection = `${sideItems[0].name.slice(sideItems[0].name.indexOf(" ") + 1, sideItems[0].name.length)}Section`
    // console.log(itemSection)
  return (
    <main className='side-bar float-left w-1/7 h-screen border-r border-r-black/20 text-left py-8 px-4 flex flex-col gap-16 font-'>
        <h1 className='text-2xl font-bold text-center   '>Logo</h1>
        <ul className='text-[16px] flex flex-col gap-2 font-medium'>
            {sideItems.map((item, index) => (
                <li 
                key={index}
                className='hover:bg-gray-100 p-2 cursor-pointer rounded-lg' 
                > <a 
                href={`#${item.replace(/\s+/g, '')}`}
                onClick={(e) => {
                  e.preventDefault();
                  const section = item.slice(item.indexOf(" ") + 1, item.length) + 'Section';
                  setActiveSection(section);
                  window.history.pushState({}, '', `#${item.replace(/\s+/g, '')}`);
                }}
                className={`block ${activeSection === item.slice(item.indexOf(" ") + 1, item.length) + 'Section' ? 'text-blue-600 font-semibold' : ''}`}
                >{item}</a></li>
            ))}
            
        </ul>
    </main>
  )
}

export default SideBar