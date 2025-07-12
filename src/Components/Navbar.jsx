import MenuIcon from './Icons/MenuIcon'
import NestleForgeLogo from './Icons/NestleForgeLogo'

const Navbar = () => {
  return (
    <nav className='flex md:hidden w-screen items-center justify-between px-4 py-4'>
        <div className="Logo flex gap-2 items-center ">
            <NestleForgeLogo width="32" height="32" color="black" className="flex md:hidden" />
            <h2 className='text-lg font-medium'>NestleForge</h2>
        </div>
        <MenuIcon width='32'  color='black' className=''/>
    </nav>
  )
}

export default Navbar