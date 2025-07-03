import { useState } from 'react';
import Upload from "./Icons/Upload.jsx";
import ToArrow from "./Icons/toArrow.jsx";
import Dropdwn from "./Icons/dropdown.jsx";
import { convertImage, downloadBlob } from "../utils/api";
import ConvertedImg from './ConvertedImg.jsx';

const formatCategories = {
  Image: ['PNG', 'JPEG', 'WEBP', 'BMP', 'GIF', 'ICO'],
  Document: ['PDF', 'DOC', 'DOCX'],
  Vector: ['SVG', 'EPS', 'AI'],
};

export default function ConverterSection() {

  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedImgDetails, setSelectedImgDetails] = useState({
    name: "No file selected",
    format: "No format selected",
    size: ''
  })
  const [convertToFormat, setConvertToFormat] = useState("Webp");
  const [openMenuFormats, setOpenMenuFormats] = useState(false);
  const [showErr, setShowErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(Object.keys(formatCategories)[0]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isConverted, setIsConverted] = useState(false);

  // const [selectedFormat, setSelectedFormat] = useState("");
  // const [fileName, setFileName] = useState("No image selected");
  const truncateFileName = (name, length = 20) => {
    if (name.length <= length) return name;
    const extension = name.split('.').pop();
    return name.slice(0, length - extension.length - 3) + '...' + extension;
  };
  


  const resetFileInput = () => {
    const fileInput = document.getElementById('file');
    if (fileInput) {
      fileInput.value = '';  // This resets the file input
    }
  };

  const resetState = () => {
    setSelectedImg(null);
    setSelectedImgDetails({
      name: "No file selected",
      format: "No format selected",
      size: ''
    });
  };

  const handleConverting = async () => {
    // Reset any previous errors and states
    setShowErr('');
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!selectedImg) {
        throw new Error("Please select an image to convert.");
      }
      
      if (!convertToFormat) {
        throw new Error("Please select a target format.");
      }
      
      // Get a fresh reference to the file
      const fileInput = document.getElementById('file');
      if (!fileInput?.files?.length) {
        throw new Error('No file selected');
      }
      
      const file = fileInput.files[0];
      
      console.log('Starting conversion for file:', file.name, 'to format:', convertToFormat);
      
      // Use the API utility for conversion
      const blob = await convertImage(file, convertToFormat);
      
      console.log('Received blob:', {
        size: blob.size,
        type: blob.type
      });
      
      if (!blob || blob.size === 0) {
        throw new Error('Received empty file from server');
      }
      
      // Create a filename for the download
      const originalName = file.name.split('.').slice(0, -1).join('.');
      const filename = `${originalName}_converted.${convertToFormat.toLowerCase()}`;
      
      console.log('Initiating download for:', filename);
      
      // Use the downloadBlob utility function
      downloadBlob(blob, filename);
      setDownloadUrl(URL.createObjectURL(blob));
      setIsConverted(false);
      console.log('Download initiated');
      
    } catch (error) {
      console.error('Conversion error:', error);
      let errorMessage = 'An error occurred during conversion';
      
      if (error.message) {
        if (error.message.includes('NetworkError')) {
          errorMessage = 'Failed to connect to the server. Please try again.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Server endpoint not found. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setShowErr(errorMessage);
      resetFileInput();
      resetState();
    } finally {
      setIsLoading(false);
      setIsConverted(true);
    }
  };
  

return (
  <section className="flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden max-h-[90dvh]">
    <div className="heading flex flex-col items-center gap-4">
      <h1 className="text-4xl font-medium text-center">Conver your images to any Format you want</h1>
      <p className="text-[16px]  font-[400]  text-center">Easily change your images into any popular format.Fast, simple, and lossless <br /> conversion for all your needs.</p>
    </div>

    <div 
        className={`drag-drop-container z-10 flex flex-col items-center justify-center gap-4 w-1/2 pt-16 pb-12 px-16 mt-12 rounded-xl border-2 border-dashed hover:border-indigo-600 mx-auto ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'}`}
        onClick={!isLoading ? () => document.getElementById('file').click() : null }
      >
        {!selectedImg && (
          <Upload />)}

        {selectedImg && (
          <img src={selectedImg} alt="Selected" className="w-50 h-50 object-cover rounded-md" />
        )}

        <div className={`select-file flex gap-4 items-center mt-4 `}>
          <input 
            type="file" 
            id="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              const fileFormat = selectedFile.type.split('/')[1].toUpperCase();
              console.log('format : ' + fileFormat);
              console.log('size : ' + (selectedFile.size / 1024).toFixed(2) + ' KB');
              setSelectedImgDetails({
                name: selectedFile.name,
                format: fileFormat,
                size: (selectedFile.size / 1024).toFixed(2) + ' KB'
              });
              setSelectedImg(URL.createObjectURL(selectedFile));
            }}
          />
          <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
            Uplaod Image
          </span>
          <span id="file-name" className="text-[16px]  text-gray-800">
            {truncateFileName(selectedImgDetails.name)}
          </span>


        </div>
        {selectedImg && (<>
          <div className="select-formates flex items-center gap-4 mt-4 z-30">
            <button type="button" className="text-lg font-medium border-indigo-700 border px-4 py-2 rounded-lg">{selectedImgDetails.format}</button>
            <ToArrow />
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuFormats(!openMenuFormats);
                }} 
                type="button" 
                className="text-lg font-medium border-indigo-700 border pl-4 pr-2 py-2 rounded-lg flex items-center hover:bg-black/5 cursor-pointer transition-all duration-100"
              >
                {convertToFormat || 'to...'}
                <Dropdwn className={`transition-transform duration-200 ${openMenuFormats ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div> 

          {openMenuFormats && (
            <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="flex">
                {/* Categories List */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                  {Object.keys(formatCategories).map((category) => (
                    <div 
                      key={category}
                      className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                        hoveredCategory === category 
                          ? 'bg-white text-indigo-700 font-semibold' 
                          : 'text-gray-800 hover:bg-gray-100'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredCategory(category);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
                
                {/* Formats List */}
                <div className="w-2/3 p-2">
                  {hoveredCategory && formatCategories[hoveredCategory]?.map((format) => (
                    <button
                      key={format}
                      className={`w-full px-4 py-2.5 text-sm text-left rounded-md transition-colors ${
                        convertToFormat === format 
                          ? 'bg-indigo-600 text-white font-medium' 
                          : 'text-gray-800 hover:bg-indigo-50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConvertToFormat(format);
                        setOpenMenuFormats(false);
                      }}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          </>
        )}

      </div>
      {selectedImg === null ? (<span className='text-red-500 text-sm font-[400] mt-2'>{showErr}</span>) : ''}
      
      {!isConverted && (
 <button type="button" onClick={handleConverting} className={`submit px-6 py-2.5 rounded-lg text-lg bg-indigo-600 text-white hover:brightness-90 active:brightness-80 transition-all duration-150 ${isLoading ? 'brightness-80 hover:brightness-80 active:brightness-80 cursor-not-allowed' : ''} `}> {isLoading ? 'Converting...' : 'Convert Image'}</button>  
      )}
      {isConverted && downloadUrl && (
        <a href={downloadUrl} download={`converted.${convertToFormat}`} className='bg-indigo-600 text-lg font-medium text-white px-6 py-2.5 rounded-lg hover:brightness-90 active:brightness-80 transition-all duration-150'>Download</a>
      )}

      
      {isConverted && ( <ConvertedImg convertedImage={selectedImg} ImageName={selectedImgDetails.name.split('.')[0]+`.`+convertToFormat} ImageSize={selectedImgDetails.size}/> )}
  </section>
)
}














//   const filteredFormats = formatCategories[activeCategory].filter((f) =>
//     f.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="bg-black text-white px-4 py-2 rounded shadow"
//       >
//         Choose Format
//       </button>

//       {open && (
    //     <div className="absolute z-50 mt-2 bg-gray-900 text-white rounded shadow-lg w-[300px] p-4">
    //       <input
    //         type="text"
    //         placeholder="Search..."
    //         value={search}
    //         onChange={(e) => setSearch(e.target.value)}
    //         className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
    //       />

    //       <div className="flex gap-4 mb-4">
    //         <div className="w-1/3 space-y-2">
    //           {Object.keys(formatCategories).map((category) => (
    //             <button
    //               key={category}
    //               className={`block w-full text-left px-2 py-1 rounded ${
    //                 activeCategory === category
    //                   ? 'bg-gray-700 text-white'
    //                   : 'text-gray-400 hover:bg-gray-800'
    //               }`}
    //               onClick={() => setActiveCategory(category)}
    //             >
    //               {category}
    //             </button>
    //           ))}
    //         </div>

    //         <div className="w-2/3 grid grid-cols-3 gap-2">
    //           {filteredFormats.map((format) => (
    //             <button
    //               key={format}
    //               onClick={() => {
    //                 onSelect(format);
    //                 setOpen(false);
    //               }}
    //               className="bg-gray-700 hover:bg-blue-600 text-white py-1 rounded text-sm"
    //             >
    //               {format}
    //             </button>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
//   );
// }







// import { useState } from 'react';

// export default function ImageConverter() {
//   const [convertedUrl, setConvertedUrl] = useState(null);
//   const [format, setFormat] = useState('image/png');
//   const [fileName, setFileName] = useState('converted-image');

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       setFileName(file.name.split('.').slice(0, -1).join('.') || 'converted-image');
//       convertImage(file);
//     } else {
//       alert('Please upload a valid image file.');
//     }
//   };

//   const convertImage = (file) => {
//     const img = new Image();
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       img.src = e.target.result;
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0);

//         // Convert and set data URL
//         const quality = format === 'image/jpeg' ? 0.92 : 1; // adjust if needed
//         const dataUrl = canvas.toDataURL(format, quality);
//         setConvertedUrl(dataUrl);
//       };
//     };

//     reader.readAsDataURL(file);
//   };

//   const getExtension = (mime) => {
//     return mime.split('/')[1];
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-gray-800">Image Format Converter</h1>

//       <div className="w-full max-w-md space-y-4">
//         {/* File Input */}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//         />

//         {/* Format Select */}
//         <div>
//           <label className="block mb-1 text-sm font-medium text-gray-700">Choose format:</label>
//           <select
//             value={format}
//             onChange={(e) => setFormat(e.target.value)}
//             className="w-full p-2 border rounded bg-white text-gray-700"
//           >
//             <option value="image/png">PNG</option>
//             <option value="image/jpeg">JPEG</option>
//             <option value="image/webp">WEBP</option>
//           </select>
//         </div>
//       </div>

//       {/* Result */}
//       {convertedUrl && (
//         <div className="flex flex-col items-center space-y-4 mt-6">
//           <img src={convertedUrl} alt="Converted" className="max-w-md rounded shadow" />
//           <a
//             href={convertedUrl}
//             download={`${fileName}.${getExtension(format)}`}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//           >
//             Download {getExtension(format).toUpperCase()}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }
