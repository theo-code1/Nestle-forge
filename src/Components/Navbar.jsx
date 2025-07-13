import { useState } from 'react'
import NestleForgeLogo from './Icons/NestleForgeLogo'
import MenuIcon from './Icons/MenuIcon'
import Close from './Icons/Close'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

    const [isMenuOpened, setIsMenuOpened] = useState(false)

  return (
    <>
        <nav className='flex md:hidden w-screen fixed top-0 left-0 items-center justify-between px-4 py-4 bg-white border-b border-black/20'>
            <div className="Logo flex gap-2 items-center ">
                <NestleForgeLogo width="32" height="32" color="black" className="" />
                <h2 className='text-lg font-medium'>NestleForge</h2>
            </div>
            <button onClick={() => setIsMenuOpened(!isMenuOpened)}>
                <MenuIcon width='32'  color='black' className='z-30'/>
            </button>
        </nav>
        <div className={`flex md:hidden fixed top-0 left-0 w-screen h-screen px-8 pt-24 bg-white z-50 transition-all duration-300 ${isMenuOpened ? 'translate-x-0' : 'translate-x-full'}`}>
                <NestleForgeLogo width="36" height="36" color="black" className="absolute top-6 left-8 " />
            <button onClick={() => setIsMenuOpened(!isMenuOpened)}>
                <Close width='48'  color='black' className='absolute top-4 right-4 p-2 z-30 '/>
            </button>
            
            <ul className='w-fit text-xl text-center flex flex-col gap-2 mx-auto  font-medium mt-2' onClick={() => setIsMenuOpened(false)}>
                <NavLink to='/'> <li className={`block active:bg-gray-100 p-2 cursor-pointer rounded-md `}>Image Converter</li> </NavLink>
                <hr className='w-4/5 text-gray-500 mx-auto'/>
                <NavLink to='/image-compressor'> <li className={`block active:bg-gray-100 p-2 cursor-pointer rounded-md `}>Image Compressor</li> </NavLink>
                <hr className='w-4/5 text-gray-500 mx-auto'/>
                <NavLink to='/background-remover'> <li className={`block active:bg-gray-100 p-2 cursor-pointer rounded-md `}>Background Remover</li> </NavLink>
                <hr className='w-4/5 text-gray-500 mx-auto'/>
                <NavLink to='/color-palette-extractor'> <li className={`block active:bg-gray-100 p-2 cursor-pointer rounded-md `}>Color Palette Extractor</li> </NavLink>
            </ul>

            <div className="toggle-place absolute bottom-6 left-8">
                <div className="toggle-switch">
                    <label className="switch-label">
                        <input type="checkbox" className="checkbox" />
                        <span className="slider"></span>
                    </label>
                </div>  
            </div>
        </div>
    </>
  )
}

export default Navbar