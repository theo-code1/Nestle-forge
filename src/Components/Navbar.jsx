import React from 'react'

const Navbar = () => {
  return (
    <nav>
        <NestleForgeLogo width="32" height="32" color="black" className="flex md:hidden" />
        <MenuIcon />
    </nav>
  )
}

export default Navbar