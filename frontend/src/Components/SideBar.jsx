import { NavLink } from 'react-router-dom'
import NestleForgeLogo from './Icons/NestleForgeLogo.jsx'
import { useState } from 'react';


const SideBar = () => {

  const [logoColorTheme, setLogoColorTheme] = useState('light')

  const handleToggle = (e) => {
    const htmlElement = document.documentElement;
    if (e.target.checked) {
      htmlElement.classList.add('dark');
      setLogoColorTheme(() => 'white')
    } else {
      htmlElement.classList.remove('dark');
      setLogoColorTheme(() => 'black')
    }
  };

  return (
    <main className='side-bar bg-white dark:bg-black hidden md:flex flex-col gap-6 relative float-left h-screen border-r border-r-black/20 text-left py-6 px-2 selection:text-white selection:bg-black dark:selection:text-black dark:selection:bg-white'>
      <div className="logo flex items-center gap-2 px-2 mb-2">
        <NestleForgeLogo width="32" height="32" color={logoColorTheme} className={`text-black dark:text-white/90`} />
        <h1 className="logo-name text-black dark:text-white/90 text-lg  font-medium">NestleForge</h1>
      </div>

      <hr className='text-black dark:text-white opacity-50 w-9/10 mx-auto'/>

        <ul className='text-black dark:text-white/90 text-[16px] flex flex-col gap-1 font-medium'>
              <NavLink to='/'> <li className={`block hover:bg-gray-100 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md `}>Image Converter</li> </NavLink>
              <NavLink to='/image-compressor'> <li className={`block hover:bg-gray-100 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md `}>Image Compressor</li> </NavLink>
              <NavLink to='/background-remover'> <li className={`block hover:bg-gray-100 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md `}>Background Remover</li> </NavLink>
              <NavLink to='/color-palette-extractor'> <li className={`block hover:bg-gray-100 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md `}>Color Palette Extractor</li> </NavLink>
            
        </ul>

        <div className="toggle-place absolute bottom-4 left-1/2 -translate-x-1/2 ">
          <div className="toggle-switch">
            <label className="switch-label">
              <input type="checkbox" className="checkbox" onChange={handleToggle} />
              <span className="slider"></span>
              </label>
          </div>  
        </div>
    </main>
  )
}

export default SideBar