import Navbar from '../Components/Navbar'
import SideBar from '../Components/SideBar'
import { Outlet } from 'react-router-dom'

const Rootlayout = () => {
  return (
    <div>
        <SideBar />
        <Navbar />
        
        <Outlet />
    </div>
  )
}

export default Rootlayout