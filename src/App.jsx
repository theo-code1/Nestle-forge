import UpscalerSection from './Components/UpscalerSection'
import ConverterSection from './Components/ConverterSection'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from './Layout/Rootlayout'



const App = () => {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<UpscalerSection />} />
        <Route path='image-converter' element={<ConverterSection />} />
      </Route>
    )
  )



  return (  
    <RouterProvider router={router} />
  )
}

export default App