import { NavLink } from 'react-router-dom'
import NestleForgeLogo from './Icons/NestleForgeLogo.jsx'
import LightIcon from './Icons/LightIcon.jsx'
import DarkIcon from './Icons/DarkIcon.jsx'
// import { useState } from 'react'

const SideBar = () => {
  // const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <main className='side-bar relative float-left h-screen border-r border-r-black/20 text-left py-6 px-2 flex flex-col gap-6 font-'>
      <div className="logo flex items-center gap-2 px-2 mb-2">
        <NestleForgeLogo width="32" height="32" color="black" className="" />
        <h1 className="logo-name text-lg font-medium">NestleForge</h1>
      </div>

      <hr className='opacity-50 w-9/10 mx-auto'/>

        <ul className='text-sm flex flex-col gap-1 font-medium'>
              <NavLink to='/'> <li className={`block hover:bg-gray-50 p-2 cursor-pointer rounded-md `}>Image Converter</li> </NavLink>
              <NavLink to='/image-compressor'> <li className={`block hover:bg-gray-50 p-2 cursor-pointer rounded-md `}>Image Compressor</li> </NavLink>
              <NavLink to='/background-remover'> <li className={`block hover:bg-gray-50 p-2 cursor-pointer rounded-md `}>Background Remover</li> </NavLink>
              <NavLink to='/color-palette-extractor'> <li className={`block hover:bg-gray-50 p-2 cursor-pointer rounded-md `}>Color Palette Extractor</li> </NavLink>
            
        </ul>

        <div className="toggle-place absolute bottom-4 ">
          <div className="toggle-switch">
            <label className="switch-label">
              <input type="checkbox" className="checkbox" />
              <span className="slider"></span>
              </label>
          </div>  
        </div>

        {/* <div className="toggle-place absolute bottom-4 left-2">
          <div onClick={() => document.querySelector('.toggle').click()} className={`toggle-switch group flex justify-between relative mx-2 w-20 h-10 px-1 py-2 rounded-full ${isDarkMode ? 'bg-[#297BFD]' : 'bg-[#C0C0C0]'} transition-all duration-150`}>
              <LightIcon /> <DarkIcon />
            <button type='button' onClick={() => setIsDarkMode(!isDarkMode)} className={`toggle size-8 rounded-full group-hover:brightness-95 bg-white  transition-all duration-150 ${isDarkMode ? 'absolute top-1 right-1' : 'absolute top-1'}`}>
            </button>
          </div>
        </div> */}
    </main>
  )
}

export default SideBar