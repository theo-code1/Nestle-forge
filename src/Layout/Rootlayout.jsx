import Navbar from '../Components/Navbar'
import SideBar from '../Components/SideBar'
import { Outlet } from 'react-router-dom'

const Rootlayout = () => {
  return (
    <section>
        <SideBar />
        <Outlet />
    </section>
  )
}

export default Rootlayout