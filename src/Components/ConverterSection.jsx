import { useState, useEffect } from "react";
import Upload from "./Icons/Upload.jsx";
import { convertImage } from "../utils/api";
import ConvertedImg from "./ConvertedImg.jsx";
// import FaTrash from "./Icons/Delete.jsx";



export default function ConverterSection() {
  const [errors, setErrors] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [allUploadedImages, setAllUploadedImages] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      allUploadedImages.forEach(image => {
        URL.revokeObjectURL(image.url);
        if (image.convertedUrl) {
          URL.revokeObjectURL(image.convertedUrl);
        }
      });
    };
  }, [allUploadedImages]);



  // const handleDelete = (url) => {
  //   setUploadedFiles((prev) => {
  //     const filtered = prev.filter((file) => file.url !== url);
  //     // Clean up object URL
  //     const removed = prev.find((file) => file.url === url);
  //     if (removed) URL.revokeObjectURL(removed.url);
  //     return filtered;
  //   });
  // };

  // const handleSelectDroppedFile = (droppedFile) => {
  //   handleFileSelect(droppedFile.file);
  //   // Don't clear droppedFiles - let user manage them manually
  // };

  // const handleRemoveDroppedFile = (id) => {
  //   setDroppedFiles((prev) => {
  //     const filtered = prev.filter((file) => file.id !== id);
  //     // Clean up object URL
  //     const removed = prev.find((file) => file.id === id);
  //     if (removed) URL.revokeObjectURL(removed.url);
  //     return filtered;
  //   });
  // };

  const updateImageFormat = (imageId, format) => {
    setAllUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { 
              ...img, 
              convertToFormat: format,
              isConverted: false,
              convertedUrl: undefined,
              convertedName: undefined
            }
          : img
      )
    );
  };

  // const handleFileSelect = (file) => {
  //   if (!file) return;

  //   const fileFormat = file.type.split("/")[1].toUpperCase();
  //   const imageUrl = URL.createObjectURL(file);
  //   const imageDetails = {
  //     name: file.name,
  //     format: fileFormat,
  //     size: (file.size / 1024).toFixed(2) + " KB",
  //   };
    
  //   setSelectedImgDetails(imageDetails);
  //   setSelectedImg(imageUrl);
  //   setIsConverted(false); // Reset conversion status for new image

  //   // Add to all uploaded images
  //   setAllUploadedImages(prev => [...prev, {
  //     id: Math.random().toString(36).substr(2, 9),
  //     url: imageUrl,
  //     details: imageDetails,
  //     file: file,
  //     convertToFormat: ""
  //   }]);

  //   // Set the file input value for consistency
  //   const fileInput = document.getElementById("file");
  //   if (fileInput) {
  //     // Create a new FileList-like object
  //     const dataTransfer = new DataTransfer();
  //     dataTransfer.items.add(file);
  //     fileInput.files = dataTransfer.files;
  //   }
  // };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (Object.values(loadingImages).some(loading => loading)) return;
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      return;
    }
    imageFiles.forEach(file => {
      const fileFormat = file.type.split("/")[1].toUpperCase();
      const imageUrl = URL.createObjectURL(file);
      const imageDetails = {
        name: file.name,
        format: fileFormat,
        size: (file.size / 1024).toFixed(2) + " KB",
      };
      setAllUploadedImages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        details: imageDetails,
        file: file,
        convertToFormat: ""
      }]);
    });
  };

  const handleConverting = async (imageId) => {
    // Reset any previous errors for this specific image
    setErrors(prev => ({ ...prev, [imageId]: "" }));
    setLoadingImages(prev => ({ ...prev, [imageId]: true }));

    // Find the image to convert
    const imageToConvert = allUploadedImages.find(img => img.id === imageId);
    if (!imageToConvert) {
      setErrors(prev => ({ ...prev, [imageId]: "Image not found." }));
      setLoadingImages(prev => ({ ...prev, [imageId]: false }));
      return;
    }

    // Check if same format
    if (
      imageToConvert.details.format.toLowerCase() === imageToConvert.convertToFormat.toLowerCase()
    ) {
      setErrors(prev => ({ ...prev, [imageId]: "Please select a different format to convert." }));
      setLoadingImages(prev => ({ ...prev, [imageId]: false }));
      return;
    }

    try {
      // Validate inputs
      if (!imageToConvert.convertToFormat) {
        throw new Error("Please select a target format.");
      }

      console.log(
        "Starting conversion for file:",
        imageToConvert.details.name,
        "to format:",
        imageToConvert.convertToFormat
      );

      const result = await convertImage(imageToConvert.file, imageToConvert.convertToFormat);

      console.log("Received result:", result);

      if (!result || !result.success) {
        throw new Error("Received invalid response from server");
      }

      // Create a filename for the download
      const originalName = imageToConvert.details.name.split(".").slice(0, -1).join(".");
      const filename = result.filename || `${originalName}_converted.${imageToConvert.convertToFormat.toLowerCase()}`;

      console.log("Initiating download for:", filename);

      // Store the converted file URL in the image object
      setAllUploadedImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { 
                ...img, 
                convertedUrl: result.url,
                convertedName: filename,
                convertedSize: (result.size / 1024).toFixed(2) + " KB",
                isConverted: true
              }
            : img
        )
      );
      console.log("Conversion completed");
    } catch (error) {
      console.error("Conversion error:", error);
      let errorMessage = "An error occurred during conversion";

      if (error.message) {
        if (error.message.includes("NetworkError")) {
          errorMessage = "Failed to connect to the server. Please try again.";
        } else if (error.message.includes("404")) {
          errorMessage = "Server endpoint not found. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      setErrors(prev => ({ ...prev, [imageId]: errorMessage }));
    } finally {
      setLoadingImages(prev => ({ ...prev, [imageId]: false }));
    }
  };

  return (
    <section className="flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden max-h-[90dvh]">
      <div className="heading flex flex-col items-center gap-4">
        <h1 className="text-4xl font-medium text-center">
          Convert your images to any Format you want
        </h1>
        <p className="text-[16px]  font-[400]  text-center">
          Easily change your images into any popular format.Fast, simple, and
          lossless <br /> conversion for all your needs.
        </p>
      </div>

      <div className="files-management relative w-full flex items-start">
        <div
          className={`drag-drop-container z-10 flex flex-col items-center justify-center gap-4 w-1/2 pt-16 pb-12 px-16 mt-12 rounded-xl border-2 border-dashed mx-auto ${
            Object.values(loadingImages).some(loading => loading)
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer opacity-100"
          }
          ${Object.values(loadingImages).some(loading => loading) ? 'hover:border-black' : 'hover:border-indigo-600'}`}
          onClick={
            !Object.values(loadingImages).some(loading => loading) ? () => document.getElementById("file").click() : null
          }
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload />

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop your images here</h3>
            <p className="text-gray-600 text-sm mb-4">or click to browse files</p>
            <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, ICO, AVIF</p>
          </div>

          <div className={`select-file flex gap-4 items-center mt-4 `}>
            <input
              type="file"
              id="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const imageFiles = files.filter(file => file.type.startsWith("image/"));
                if (imageFiles.length === 0) {
                  return;
                }
                imageFiles.forEach(file => {
                  const fileFormat = file.type.split("/")[1].toUpperCase();
                  const imageUrl = URL.createObjectURL(file);
                  const imageDetails = {
                    name: file.name,
                    format: fileFormat,
                    size: (file.size / 1024).toFixed(2) + " KB",
                  };
                  setAllUploadedImages(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    url: imageUrl,
                    details: imageDetails,
                    file: file,
                    convertToFormat: ""
                  }]);
                });
              }}
            />
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </span>
          </div>
        </div>


      </div>
      
      

      {allUploadedImages.length > 0 && (
        <div className="w-full flex flex-col max-w-4xl gap-6 mt-10">
          {allUploadedImages.map((image) => (
            <>
            <div
              key={image.id}
              className="relative group bg-white rounded-lg shadow-md flex flex-col items-center"
            >
              <ConvertedImg
                isConverted={image.isConverted || false}
                isLoading={loadingImages[image.id] || false}
                selectedImgDetails={image.details}
                selectedImg={image.url}
                setConvertToFormat={(format) => updateImageFormat(image.id, format)}
                convertToFormat={image.convertToFormat}
                handleConverting={() => handleConverting(image.id)}
                convertedImage={image.url}
                ImageName={image.details.name}
                ImageSize={image.details.size}
                imgHref={image.convertedUrl || ""}
                DownloadImg={image.convertedName || ""}
                handleDelete={() => {
                  // Remove this image from the list
                  setAllUploadedImages(prev => prev.filter(img => img.id !== image.id));
                  // Clean up the object URLs
                  URL.revokeObjectURL(image.url);
                  if (image.convertedUrl) {
                    URL.revokeObjectURL(image.convertedUrl);
                  }
                  // Clear any errors for this image
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[image.id];
                    return newErrors;
                  });
                }}
                imageId={image.id}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                showErr={errors[image.id] || ""}
              />
            </div>


                <span className="text-red-500 text-sm font-[400] mt-2">{errors[image.id] || ""}</span>
              </>
              
          ))}

        </div>
      )}

      {/* Footer Section */}
      <div className="w-full mt-16 py-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Our Image Converter?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 text-xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Fast & Efficient</h4>
              <p className="text-gray-600 text-sm">Convert multiple images simultaneously with our optimized processing</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 text-xl">🔒</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Secure Processing</h4>
              <p className="text-gray-600 text-sm">Your images are processed locally and never stored on our servers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 text-xl">🎨</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">High Quality</h4>
              <p className="text-gray-600 text-sm">Maintain image quality across all supported formats</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">© 2025 Image Converter. Built with React & Flask for seamless image conversion.</p>
          </div>
        </div>
      </div>

    </section>
  );
}
