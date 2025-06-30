/* eslint-disable no-unused-vars */
import React from 'react'
import SideBar from './Components/SideBar'
import UpscalerSection from './Components/UpscalerSection'
import Navbar from './Components/Navbar'
import ConverterSection from './Components/ConverterSection'

// Map URL hashes to section names
const HASH_TO_SECTION = {
  'ImageUpscaler': 'UpscalerSection',
  'ImageConverter': 'ConverterSection',
  'ImageCompressor': 'CompressorSection',
  'BackgroundRemover': 'BackgroundRemoverSection',
  'ImageResizer&Cropper': 'ResizerCropperSection',
  'ColorPaletteExtractor': 'ColorPaletteExtractorSection'
};

const App = () => {
  // Get initial section from URL hash or localStorage
  const [activeSection, setActiveSection] = React.useState(() => {
    // First check URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash && HASH_TO_SECTION[hash]) {
      return HASH_TO_SECTION[hash];
    }
    // Fall back to localStorage or default
    return localStorage.getItem('activeSection') || "UpscalerSection";
  });

  // Update localStorage and URL hash whenever activeSection changes
  React.useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
    
    // Update URL hash
    const hashEntry = Object.entries(HASH_TO_SECTION).find(([_, section]) => section === activeSection);
    if (hashEntry) {
      const [hash] = hashEntry;
      window.history.pushState({}, '', `#${hash}`);
    }
  }, [activeSection]);
  
  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && HASH_TO_SECTION[hash] && HASH_TO_SECTION[hash] !== activeSection) {
        setActiveSection(HASH_TO_SECTION[hash]);
      }
    };
    
    window.addEventListener('popstate', handleHashChange);
    return () => window.removeEventListener('popstate', handleHashChange);
  }, [activeSection]);

  return (
    <>
    <SideBar activeSection={activeSection} setActiveSection={setActiveSection}/>
    <Navbar />
    {activeSection === "UpscalerSection" && <UpscalerSection />}
    {activeSection === "ConverterSection" && <ConverterSection />}
    </>
  )
}

export default App