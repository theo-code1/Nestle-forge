import UpscalerSection from './Components/UpscalerSection'
import ConverterSection from './Components/ConverterSection'
import NotFound from './Components/NotFound'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from './Layout/Rootlayout'



const App = () => {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<UpscalerSection />} />
        <Route path='image-converter' element={<ConverterSection />} />
        {/* <Route path='image-compressor' element={<CompressorSection />} /> */}
        {/* <Route path='background-remover' element={<BgRemoverSection />} /> */}
        {/* <Route path='image-resizer-cropper' element={<ImgResizerSection />} /> */}
        {/* <Route path='color-palette-extractor' element={<PaletteExSection />} /> */}
        <Route path='*' element={<NotFound />} />
      </Route>
    )
  )



  return (  
    <RouterProvider router={router} />
  )
}

export default App