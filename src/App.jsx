import React from 'react'
import SideBar from './Components/SideBar'
import UpscalerSection from './Components/UpscalerSection'
import Navbar from './Components/Navbar'
import ConverterSection from './Components/ConverterSection'

const App = () => {
  return (
    <>
    <SideBar />
    <Navbar />
    <UpscalerSection />
    <ConverterSection />
    </>
  )
}

export default App