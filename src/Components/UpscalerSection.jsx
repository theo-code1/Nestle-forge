import React, { useState, useRef, useEffect } from "react";

const UpscalerSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [selectedMode, setSelectedMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const fileInputRef = useRef(null);


  // Cleanup preview URL when preview changes or component unmounts
  
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setUpscaledImage(null);
      setShowComparison(false);
      setSelectedMode(""); // Reset mode when new image selected
    }
  };

  // Handle drag and drop image upload
  const handleDrop = (e) => {
    e.preventDefault();
    if (selectedImage) return; // Prevent if image already selected
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setUpscaledImage(null);
      setShowComparison(false);
      setSelectedMode("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle upscale button click
  const handleUpscale = async () => {
    // Validate image is selected
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    
    // Validate upscale mode is selected
    if (!selectedMode) {
      alert("Please select an upscale mode (2x, 4x, or 8x).");
      return;
    }
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("mode", selectedMode);

    try {
      // Set loading state and hide any previous results
      setIsLoading(true);
      setShowComparison(false);
      
      // Set up request timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      // Make the API request
      const response = await fetch("http://localhost:8000/upscale", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status} error`);
      }

      // Process successful response
      const data = await response.json();
      
      if (!data.upscaled) {
        throw new Error("No upscaled image data received from server");
      }

      // Update state with the upscaled image
      setUpscaledImage(`data:image/png;base64,${data.upscaled}`);
      setShowComparison(true);
      
    } catch (error) {
      console.error("Upscaling error:", error);
      
      // Show appropriate error message
      if (error.name === "AbortError") {
        alert("The request took too long. Please try again.");
      } else {
        alert(`Error: ${error.message || 'Failed to upscale image. Please try again.'}`);
      }
      
      // Reset the comparison view
      setShowComparison(false);
      setUpscaledImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all states and clear file input
  const handleReset = () => {
    setSelectedImage(null);
    setPreview(null);
    setUpscaledImage(null);
    setShowComparison(false);
    setSelectedMode("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <section className="pt-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center">Start Upscaling Your Images</h1>
      <p className="text-lg text-center mt-4 text-gray-600">
        Upload your image and let our AI-powered upscaler enhance it.
        <br />
        Get stunning, high-resolution results in seconds.
      </p>

      <div
        className={`mt-16 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center transition-colors ${
          selectedImage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-indigo-400"
        }`}
        onClick={() => !selectedImage && fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
            <p className="text-gray-600 mt-4">{selectedImage.name}</p>

            <div className="mt-4">
              <label className="block text-sm mb-1 text-gray-700">Upscale Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">-- Select Mode --</option>
                <option value="2x">2x (Fast)</option>
                <option value="4x">4x (High Quality)</option>
                <option value="8x">8x (Very High)</option>
              </select>
            </div>

            <div className="mt-4 space-x-4">
              <button
                onClick={handleUpscale}
                disabled={isLoading || !selectedMode}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
                  isLoading || !selectedMode ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Upscaling..." : "Upscale Image"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Remove Image
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-gray-600">
              <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG, up to 10MB</p>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {showComparison && upscaledImage && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-center mb-4">Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Original</p>
              <img src={preview} alt="Original" className="max-w-full h-auto rounded-lg border border-gray-200" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Upscaled ({selectedMode})</p>
              <img src={upscaledImage} alt="Upscaled" className="max-w-full h-auto rounded-lg border border-gray-200" />
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = upscaledImage;
                  link.download = `upscaled_${selectedImage.name}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Upscaled Image
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button onClick={handleReset} className="text-indigo-600 hover:text-indigo-800">
              ← Back to upload
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpscalerSection;















// import React, { useState, useRef, useEffect } from "react";

// const UpscalerSection = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [upscaledImage, setUpscaledImage] = useState(null);
//   const [selectedMode, setSelectedMode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showComparison, setShowComparison] = useState(false);
//   const fileInputRef = useRef(null);

//   // Clean up preview URL on unmount or when image changes
//   useEffect(() => {
//     return () => {
//       if (preview) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setSelectedImage(file);
//       setPreview(URL.createObjectURL(file));
//       setUpscaledImage(null);
//       setShowComparison(false);
//       setSelectedMode(""); // reset mode on new image
//     }
//   };

//   const handleUpscale = async () => {
//     if (!selectedImage) {
//       alert("Please select an image first.");
//       return;
//     }
//     if (!selectedMode) {
//       alert("Please select an upscale mode.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", selectedImage);
//     formData.append("mode", selectedMode);

//     try {
//       setIsLoading(true);

//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 30000);

//       const response = await fetch("http://localhost:8000/upscale", {
//         method: "POST",
//         body: formData,
//         signal: controller.signal,
//       });

//       clearTimeout(timeout);

//       if (!response.ok) {
//         const errData = await response.json().catch(() => ({}));
//         const errorMessage = errData.error || `HTTP error ${response.status}`;
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();

//       if (!data.upscaled) throw new Error("No upscaled image returned.");

//       setUpscaledImage(`data:image/png;base64,${data.upscaled}`);
//       setShowComparison(true);
//     } catch (error) {
//       if (error.name === "AbortError") {
//         alert("Request timed out. Please try again.");
//       } else {
//         alert(`Error: ${error.message}`);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setSelectedImage(null);
//     setPreview(null);
//     setUpscaledImage(null);
//     setShowComparison(false);
//     setSelectedMode("");
//     if (fileInputRef.current) fileInputRef.current.value = null;
//   };

//   return (
//     <section className="pt-16 px-4 max-w-4xl mx-auto">
//       <h1 className="text-4xl font-bold text-center">Start Upscaling Your Images</h1>
//       <p className="text-lg text-center mt-4 text-gray-600">
//         Upload your image and let our AI-powered upscaler enhance it.
//         <br />
//         Get stunning, high-resolution results in seconds.
//       </p>

//       <div
//         className={`mt-16 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center transition-colors ${
//           selectedImage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-indigo-400"
//         }`}
//         onClick={() => !selectedImage && fileInputRef.current.click()}
//         onDrop={(e) => {
//           e.preventDefault();
//           if (!selectedImage) {
//             const file = e.dataTransfer.files[0];
//             if (file && file.type.startsWith("image/")) {
//               setSelectedImage(file);
//               setPreview(URL.createObjectURL(file));
//               setUpscaledImage(null);
//               setShowComparison(false);
//               setSelectedMode("");
//             }
//           }
//         }}
//         onDragOver={(e) => e.preventDefault()}
//       >
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
//             <p className="text-gray-600 mt-4">{selectedImage.name}</p>

//             <div className="mt-4">
//               <label className="block text-sm mb-1 text-gray-700">Upscale Mode</label>
//               <select
//                 value={selectedMode}
//                 onChange={(e) => setSelectedMode(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
//               >
//                 <option value="">-- Select Mode --</option>
//                 <option value="2x">2x (Fast)</option>
//                 <option value="4x">4x (High Quality)</option>
//                 <option value="8x">8x (Very High)</option>
//               </select>
//             </div>

//             <div className="mt-4 space-x-4">
//               <button
//                 onClick={handleUpscale}
//                 disabled={isLoading || !selectedMode}
//                 className={`px-6 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
//                   isLoading || !selectedMode ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
//                 }`}
//               >
//                 {isLoading ? "Upscaling..." : "Upscale Image"}
//               </button>
//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//               >
//                 Remove Image
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//               <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                 />
//               </svg>
//             </div>
//             <p className="text-gray-600">
//               <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
//             </p>
//             <p className="text-sm text-gray-500 mt-1">JPG, PNG, up to 10MB</p>
//           </>
//         )}

//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleImageChange}
//           accept="image/*"
//           className="hidden"
//         />
//       </div>

//       {showComparison && upscaledImage && (
//         <div className="mt-8">
//           <h3 className="text-lg font-medium text-center mb-4">Comparison</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="text-center">
//               <p className="text-sm text-gray-500 mb-2">Original</p>
//               <img src={preview} alt="Original" className="max-w-full h-auto rounded-lg border border-gray-200" />
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500 mb-2">Upscaled ({selectedMode})</p>
//               <img src={upscaledImage} alt="Upscaled" className="max-w-full h-auto rounded-lg border border-gray-200" />
//               <button
//                 onClick={() => {
//                   const link = document.createElement("a");
//                   link.href = upscaledImage;
//                   link.download = `upscaled_${selectedImage.name}`;
//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);
//                 }}
//                 className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Download Upscaled Image
//               </button>
//             </div>
//           </div>
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleReset}
//               className="text-indigo-600 hover:text-indigo-800"
//             >
//               ← Back to upload
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default UpscalerSection;















// import React, { useState, useRef } from 'react';

// const UpscalerSection = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [upscaledImage, setUpscaledImage] = useState(null);
//   const [selectedMode, setSelectedMode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showComparison, setShowComparison] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setSelectedImage(file);
//       setPreview(URL.createObjectURL(file));
//       setUpscaledImage(null);
//       setShowComparison(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setSelectedImage(file);
//       setPreview(URL.createObjectURL(file));
//       setUpscaledImage(null);
//       setShowComparison(false);
//     }
//   };

//   const handleDragOver = (e) => e.preventDefault();

//   const handleUpscale = async () => {
//     if (!selectedImage) {
//       alert("Please select an image first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", selectedImage);
//     formData.append("mode", selectedMode);

//     try {
//       setIsLoading(true);
//       const response = await fetch("http://localhost:8000/upscale", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok || data.error || !data.upscaled) {
//         const message = data.error || `HTTP Error: ${response.status}`;
//         throw new Error(message);
//       }

//       setUpscaledImage(`data:image/png;base64,${data.upscaled}`);
//       setShowComparison(true);
//     } catch (error) {
//       console.error("Upscale error:", error.message);
//       alert(`Error: ${error.message}. Please try again with a different image.`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setSelectedImage(null);
//     setPreview(null);
//     setUpscaledImage(null);
//     setShowComparison(false);
//     fileInputRef.current.value = null;
//   };

//   return (
//     <section className="pt-16 px-4 max-w-4xl mx-auto">
//       <h1 className="text-4xl font-bold text-center">Start Upscaling Your Images</h1>
//       <p className="text-lg text-center mt-4 text-gray-600">
//         Upload your image and let our AI-powered upscaler enhance it.<br />
//         Get stunning, high-resolution results in seconds.
//       </p>

//       <div
//         className={`mt-16 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center transition-colors ${
//           selectedImage ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400'
//         }`}
//         onClick={() => {
//           if (!selectedImage) fileInputRef.current.click();
//         }}
//         onDrop={(e) => {
//           if (!selectedImage) handleDrop(e);
//         }}
//         onDragOver={(e) => {
//           if (!selectedImage) handleDragOver(e);
//         }}
//       >

//         {preview ? (
//           <>
//             <img
//               src={preview}
//               alt="Preview"
//               className="max-h-64 mx-auto rounded-lg shadow-md"
//             />
//             <p className="text-gray-600 mt-4">{selectedImage.name}</p>

//             <div className="mt-4">
//               <label className="block text-sm mb-1 text-gray-700">Upscale Mode</label>
//               <select
//                 value={selectedMode}
//                 onChange={(e) => setSelectedMode(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
//               >
//                 <option value="2x">2x (Fast)</option>
//                 <option value="4x">4x (High Quality)</option>
//                 <option value="8x">8x (Very High)</option>
//               </select>
//             </div>

//             <div className="mt-4 space-x-4">
//               <button
//                 onClick={handleUpscale}
//                 disabled={isLoading}
//                 className={`px-6 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
//                 }`}
//               >
//                 {isLoading ? "Upscaling..." : "Upscale Image"}
//               </button>
//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//               >
//                 Remove Image
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//               <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//               </svg>
//             </div>
//             <p className="text-gray-600">
//               <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
//             </p>
//             <p className="text-sm text-gray-500 mt-1">JPG, PNG, up to 10MB</p>
//           </>
//         )}

//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleImageChange}
//           accept="image/*"
//           className="hidden"
//         />
//       </div>

//       {showComparison && upscaledImage && (
//         <div className="mt-8">
//           <h3 className="text-lg font-medium text-center mb-4">Comparison</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="text-center">
//               <p className="text-sm text-gray-500 mb-2">Original</p>
//               <img
//                 src={preview}
//                 alt="Original"
//                 className="max-w-full h-auto rounded-lg border border-gray-200"
//               />
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500 mb-2">Upscaled ({selectedMode})</p>
//               <img
//                 src={upscaledImage}
//                 alt="Upscaled"
//                 className="max-w-full h-auto rounded-lg border border-gray-200"
//               />
//               <button
//                 onClick={() => {
//                   const link = document.createElement("a");
//                   link.href = upscaledImage;
//                   link.download = `upscaled_${selectedImage.name}`;
//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);
//                 }}
//                 className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Download Upscaled Image
//               </button>
//             </div>
//           </div>
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleReset}
//               className="text-indigo-600 hover:text-indigo-800"
//             >
//               ← Back to upload
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default UpscalerSection;