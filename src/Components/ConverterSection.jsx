import { useState, useEffect } from "react";
import Upload from "./Icons/Upload.jsx";
import { convertImage } from "../utils/api";
import ConvertedImg from "./ConvertedImg.jsx";



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
    <section className="bg-white dark:bg-black/90 dark:text-white/90 flex flex-col items-center gap-8 pt-14 pb-12 overflow-y-auto overflow-x-hidden h-screen selection:bg-black/80 selection:text-white">
      <div className="heading flex flex-col items-center gap-4">
        <h1 className="text-4xl font-medium text-center">
        Format Switcher
        </h1>
        <p className="text-[16px]  font-[400]  text-center">
        Easily change your images into any popular format.Fast, simple, and lossless
        </p>
      </div>

        <div
          className={`drag-drop-container z-10 flex flex-col items-center justify-center gap-4 w-3/4 lg:w-1/2 py-10 px-4 lg:px-12 mt-8 lg:mt-16 rounded-xl border-2 border-dashed mx-auto ${
            Object.values(loadingImages).some(loading => loading)
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer opacity-100"
          }
          ${Object.values(loadingImages).some(loading => loading) ? 'hover:border-black' : 'hover:border-[#3582FD]'}`}
          onClick={
            !Object.values(loadingImages).some(loading => loading) ? () => document.getElementById("file").click() : null
          }
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload size={`6rem`} className="p-4 bg-[#67A1FE]/60 rounded-full"/>

          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-800 ">Drop your images here</h3>
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
            <button className="bg-[#3582FD] text-white px-4 py-2 rounded-xl hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </button>
          </div>
        </div>
      
      

      {allUploadedImages.length > 0 && (
        <div className="w-[56dvw] grid grid-cols-2 gap-x-6 gap-y-12 mt-10">
          {allUploadedImages.map((image) => (
            <div key={image.id} className="w-full">
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
          <span className="text-red-500 text-sm font-[400] mt-2">{errors[image.id] || ""}</span>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
