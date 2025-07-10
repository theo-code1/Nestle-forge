import { NavLink } from 'react-router-dom'
import NestleForgeLogo from './Icons/NestleForgeLogo.jsx'

const SideBar = () => {

  return (
    <main className='side-bar float-left w-1/7 h-screen border-r border-r-black/20 text-left py-8 px-4 flex flex-col gap-16 font-'>
      <div className="logo">
        <NestleForgeLogo />
      </div>
        <ul className='text-sm flex flex-col gap-2 font-medium'>
              <NavLink to='/'> <li className={`block hover:bg-gray-100 p-2 cursor-pointer rounded-lg `}>Image Converter</li> </NavLink>
              <NavLink to='/image-compressor'> <li className={`block hover:bg-gray-100 p-2 cursor-pointer rounded-lg `}>Image Compressor</li> </NavLink>
              <NavLink to='/background-remover'> <li className={`block hover:bg-gray-100 p-2 cursor-pointer rounded-lg `}>Background Remover</li> </NavLink>
              <NavLink to='/color-palette-extractor'> <li className={`block hover:bg-gray-100 p-2 cursor-pointer rounded-lg `}>Color Palette Extractor</li> </NavLink>

            
        </ul>
    </main>
  )
}

export default SideBar