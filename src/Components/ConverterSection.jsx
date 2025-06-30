import { useState } from 'react';

const formatCategories = {
  Image: ['PNG', 'JPEG', 'WEBP', 'BMP', 'GIF', 'ICO'],
  Document: ['PDF', 'DOC', 'DOCX'],
  Vector: ['SVG', 'EPS', 'AI'],
  Video: ['MP4', 'AVI'],
  Archive: ['ZIP', 'RAR'],
};

export default function FormatDropdown({ onSelect }) {
  const [activeCategory, setActiveCategory] = useState('Image');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredFormats = formatCategories[activeCategory].filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-black text-white px-4 py-2 rounded shadow"
      >
        Choose Format
      </button>

      {open && (
        <div className="absolute z-50 mt-2 bg-gray-900 text-white rounded shadow-lg w-[300px] p-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          />

          <div className="flex gap-4 mb-4">
            <div className="w-1/3 space-y-2">
              {Object.keys(formatCategories).map((category) => (
                <button
                  key={category}
                  className={`block w-full text-left px-2 py-1 rounded ${
                    activeCategory === category
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="w-2/3 grid grid-cols-3 gap-2">
              {filteredFormats.map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    onSelect(format);
                    setOpen(false);
                  }}
                  className="bg-gray-700 hover:bg-blue-600 text-white py-1 rounded text-sm"
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







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
