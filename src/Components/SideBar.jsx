import { NavLink } from 'react-router-dom'
import NestleForgeLogo from './Icons/NestleForgeLogo.jsx'
import LightIcon from './Icons/LightIcon.jsx'

const SideBar = () => {

  return (
    <main className='side-bar relative float-left h-screen border-r border-r-black/20 text-left py-6 px-2 flex flex-col gap-8 font-'>
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

        <div className="toggle-place absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="toggle-switch relative mx-2 bg-[#C0C0C0] w-22 h-10 px-2 rounded-full ">
              {/* <LightIcon /> */}
            <div className="toggle size-8 rounded-full bg-white absolute top-1">
            </div>
          </div>
        </div>
    </main>
  )
}

export default SideBar